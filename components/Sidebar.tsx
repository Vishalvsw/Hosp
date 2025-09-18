import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { NavLinkItem } from '../types';
import { AppLogoIcon } from './icons/AppLogoIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { PatientsIcon } from './icons/PatientsIcon';
import { DoctorIcon } from './icons/DoctorIcon';
import { AppointmentsIcon } from './icons/AppointmentsIcon';
import { EMRIcon } from './icons/EMRIcon';
import { BillingIcon } from './icons/BillingIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { RoadmapIcon } from './icons/RoadmapIcon';

const navigation: NavLinkItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon, allowedRoles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'] },
  { name: 'Patients', href: '/patients', icon: PatientsIcon, allowedRoles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { name: 'Doctors', href: '/doctors', icon: DoctorIcon, allowedRoles: ['admin', 'receptionist'] },
  { name: 'Appointments', href: '/appointments', icon: AppointmentsIcon, allowedRoles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'] },
  { name: 'EMR', href: '/emr', icon: EMRIcon, allowedRoles: ['admin', 'doctor', 'nurse'] },
  { name: 'Billing', href: '/billing', icon: BillingIcon, allowedRoles: ['admin', 'receptionist'] },
  { name: 'Project Plan', href: '/plan', icon: RoadmapIcon, allowedRoles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'] },
];

const Sidebar: React.FC = () => {
  const { hasRole } = useAuth();
  
  const filteredNavigation = navigation.filter(item => hasRole(item.allowedRoles));

  return (
    <div className="flex flex-col w-64 bg-white border-r border-slate-200">
      <div className="flex items-center justify-center h-20 border-b border-slate-200">
        <AppLogoIcon className="h-8 w-auto text-cyan-600" />
        <h1 className="ml-3 text-xl font-bold text-slate-800">HMS Pro</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
       {hasRole(['admin']) && (
        <div className="p-4 border-t border-slate-200">
          <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors w-full ${
                  isActive
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <SettingsIcon className="w-5 h-5 flex-shrink-0" />
              <span>Settings</span>
            </NavLink>
        </div>
       )}
    </div>
  );
};

export default Sidebar;