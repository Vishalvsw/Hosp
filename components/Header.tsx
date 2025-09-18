import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { BellIcon } from './icons/BellIcon';
import { UserIcon } from './icons/UserIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const Header: React.FC = () => {
  const { user, switchRole, roles } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <header className="flex-shrink-0 bg-white border-b border-slate-200">
        <div className="flex items-center justify-end p-4 h-20">
          <p>Not logged in</p>
        </div>
      </header>
    );
  }

  return (
    <header className="flex-shrink-0 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between p-4 h-20">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients, doctors..."
            className="w-full max-w-xs pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700">
            <BellIcon className="w-6 h-6" />
          </button>
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.title}</p>
              </div>
              <button className="p-1 rounded-full text-slate-500 hover:bg-slate-100">
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-slate-200">
                <div className="p-2">
                  <p className="text-xs text-slate-500 px-2 py-1">Switch User Role</p>
                  {roles.map((role) => (
                     <button
                        key={role}
                        onClick={() => {
                          if (switchRole) switchRole(role);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                          user.role === role
                            ? 'bg-cyan-100 text-cyan-700'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                       {capitalize(role)}
                     </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;