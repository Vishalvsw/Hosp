import React, { useState, useMemo, useEffect } from 'react';
import { mockPatients, mockAppointments, mockDoctors } from '../data/mockData';
import type { Appointment, Patient, Doctor } from '../types';
import { PatientsIcon } from '../components/icons/PatientsIcon';
import { AppointmentsIcon } from '../components/icons/AppointmentsIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import AppointmentDetailModal from '../components/AppointmentDetailModal';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; }> = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="flex-shrink-0 bg-cyan-500/20 text-cyan-600 rounded-full p-3">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);


export const DashboardPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        setPatients(mockPatients);
        setAppointments(mockAppointments);
    }, []);

    const totalPatients = patients.length;
    const criticalPatients = patients.filter(p => p.status === 'Critical').length;
    
    const todaysDateString = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(a => a.date === todaysDateString && a.status !== 'Cancelled');
    
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<{
        appointment: Appointment | null;
        patient: Patient | null;
        doctor: Doctor | null;
    }>({ appointment: null, patient: null, doctor: null });

    const patientMap = React.useMemo(() => new Map(patients.map(p => [p.id, p])), [patients]);
    const doctorMap = React.useMemo(() => new Map(mockDoctors.map(d => [d.id, d])), []);
    
    const handleOpenAppointmentModal = (appointment: Appointment) => {
        setSelectedAppointmentDetails({
            appointment,
            patient: patientMap.get(appointment.patientId) || null,
            doctor: doctorMap.get(appointment.doctorId) || null,
        });
        setIsDetailModalOpen(true);
    };

    const handleCloseModal = () => setIsDetailModalOpen(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, Dr. Evans!</h1>
        <p className="text-slate-500 mt-1">Here's a summary of your hospital's activity today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<PatientsIcon className="w-6 h-6" />} title="Total Patients" value={totalPatients} />
        <StatCard icon={<AppointmentsIcon className="w-6 h-6" />} title="Today's Appointments" value={todaysAppointments.length} />
        <StatCard icon={<PatientsIcon className="w-6 h-6 text-red-500" />} title="Critical Condition" value={criticalPatients} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Appointments</h2>
          <div className="space-y-1">
            {todaysAppointments.slice(0, 5).map((appt) => (
              <div 
                key={appt.id} 
                onClick={() => handleOpenAppointmentModal(appt)}
                className="flex items-center space-x-4 p-2 -m-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <div className={`p-2 rounded-full ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-600' : appt.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">{patientMap.get(appt.patientId)?.name || 'Unknown Patient'}</p>
                  <p className="text-sm text-slate-500">{appt.time} - {appt.type}</p>
                </div>
                <div className="flex-grow text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        appt.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                    }`}>{appt.status}</span>
                </div>
              </div>
            ))}
             {todaysAppointments.length === 0 && (
                <p className="text-slate-500 text-sm">No appointments scheduled for today.</p>
            )}
          </div>
        </div>

        {/* Recent Patient Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Patient Activity</h2>
          <ul className="divide-y divide-slate-200">
            {patients.slice(0, 5).map(patient => (
                <li key={patient.id} className="py-3 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-800">{patient.name}</p>
                        <p className="text-sm text-slate-500">Last Visit: {patient.lastVisit}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        patient.status === 'Stable' ? 'bg-blue-100 text-blue-800' :
                        patient.status === 'Recovering' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>{patient.status}</span>
                </li>
            ))}
          </ul>
        </div>
      </div>

       <AppointmentDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseModal}
            appointment={selectedAppointmentDetails.appointment}
            patient={selectedAppointmentDetails.patient}
            doctor={selectedAppointmentDetails.doctor}
        />
    </div>
  );
};