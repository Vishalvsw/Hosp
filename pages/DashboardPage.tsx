import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockPatients, mockAppointments, mockDoctors } from '../data/mockData';
import type { Appointment, Patient, Doctor, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import { PatientsIcon } from '../components/icons/PatientsIcon';
import { AppointmentsIcon } from '../components/icons/AppointmentsIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { UserIcon } from '../components/icons/UserIcon';
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

const AppointmentList: React.FC<{
    appointments: Appointment[];
    onAppointmentClick: (appointment: Appointment) => void;
}> = ({ appointments, onAppointmentClick }) => {
    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const doctorMap = useMemo(() => new Map(mockDoctors.map(d => [d.id, d])), []);

    if (appointments.length === 0) {
        return <p className="text-slate-500 text-sm p-4 text-center">No appointments scheduled for today.</p>;
    }
    
    return (
        <div className="space-y-1">
            {appointments.slice(0, 5).map((appt) => (
              <div 
                key={appt.id} 
                onClick={() => onAppointmentClick(appt)}
                className="flex items-center space-x-4 p-2 -m-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <div className="p-2 rounded-full bg-cyan-100 text-cyan-600">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">
                    {patientMap.get(appt.patientId)?.name || 'Unknown Patient'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {appt.time} with {doctorMap.get(appt.doctorId)?.name || 'Unknown Doctor'}
                  </p>
                </div>
                <div className="flex-grow text-right">
                    <span className="text-sm text-slate-600">{appt.type}</span>
                </div>
              </div>
            ))}
        </div>
    );
};

// --- Role-Based Dashboards ---

const AdminReceptionistDashboard: React.FC = () => {
    const totalPatients = mockPatients.length;
    const criticalPatients = mockPatients.filter(p => p.status === 'Critical').length;
    const todaysDateString = new Date().toISOString().split('T')[0];
    const todaysAppointments = mockAppointments.filter(a => a.date === todaysDateString && a.status !== 'Cancelled');
    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p])), []);

    return (
        <>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<PatientsIcon className="w-6 h-6" />} title="Total Patients" value={totalPatients} />
                <StatCard icon={<AppointmentsIcon className="w-6 h-6" />} title="Today's Appointments" value={todaysAppointments.length} />
                <StatCard icon={<PatientsIcon className="w-6 h-6 text-red-500" />} title="Critical Condition" value={criticalPatients} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">All Upcoming Appointments Today</h2>
                    {todaysAppointments.length > 0 ? (
                        todaysAppointments.slice(0,5).map(appt => (
                             <div key={appt.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                                <div>
                                    <p className="font-medium text-slate-700">{patientMap.get(appt.patientId)?.name}</p>
                                    <p className="text-sm text-slate-500">{appt.time} - {appt.type}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${ appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{appt.status}</span>
                            </div>
                        ))
                    ) : <p className="text-slate-500 text-sm">No appointments scheduled for today.</p>}
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Patient Activity</h2>
                     <ul className="divide-y divide-slate-200">
                        {mockPatients.slice(0, 5).map(patient => (
                            <li key={patient.id} className="py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{patient.name}</p>
                                    <p className="text-sm text-slate-500">Last Visit: {patient.lastVisit}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${ patient.status === 'Stable' ? 'bg-blue-100 text-blue-800' : patient.status === 'Recovering' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{patient.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

const DoctorNurseDashboard: React.FC<{ user: User, onAppointmentClick: (appointment: Appointment) => void }> = ({ user, onAppointmentClick }) => {
    // Fix: The `User` type has an `id` property, not `userId`.
    const doctorProfile = useMemo(() => mockDoctors.find(d => d.userId === user.id), [user.id]);
    const todaysDateString = new Date().toISOString().split('T')[0];
    
    const appointmentsToday = useMemo(() => {
        return mockAppointments.filter(a => {
            const isToday = a.date === todaysDateString && a.status !== 'Cancelled';
            // If a doctor profile exists, filter by their ID. Otherwise, show all (for nurses etc.)
            const doctorMatch = doctorProfile ? a.doctorId === doctorProfile.id : true;
            return isToday && doctorMatch;
        });
    }, [doctorProfile, todaysDateString]);
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<AppointmentsIcon className="w-6 h-6" />} title="Your Appointments Today" value={appointmentsToday.length} />
                <StatCard icon={<PatientsIcon className="w-6 h-6" />} title="Total Patients" value={mockPatients.length} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                 <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Schedule for Today</h2>
                 <AppointmentList appointments={appointmentsToday} onAppointmentClick={onAppointmentClick} />
            </div>
        </>
    );
};

const PatientDashboard: React.FC<{ user: User, onAppointmentClick: (appointment: Appointment) => void }> = ({ user, onAppointmentClick }) => {
    // Fix: The `User` type has an `id` property, not `userId`.
    const patientProfile = useMemo(() => mockPatients.find(p => p.userId === user.id), [user.id]);
    const upcomingAppointments = useMemo(() => {
        if (!patientProfile) return [];
        const today = new Date();
        today.setHours(0,0,0,0);
        return mockAppointments.filter(a => 
            a.patientId === patientProfile.id && 
            new Date(a.date) >= today && 
            a.status !== 'Cancelled'
        ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [patientProfile]);

    if (!patientProfile) {
        return <p>Could not find your patient profile.</p>
    }

    const primaryDoctor = useMemo(() => {
        if (upcomingAppointments.length > 0) {
            return mockDoctors.find(d => d.id === upcomingAppointments[0].doctorId);
        }
        return null;
    }, [upcomingAppointments]);

    return (
        <>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<AppointmentsIcon className="w-6 h-6" />} title="Upcoming Appointments" value={upcomingAppointments.length} />
                {primaryDoctor && (
                     <StatCard icon={<UserIcon className="w-6 h-6" />} title="Your Primary Doctor" value={primaryDoctor.name} />
                )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Your Upcoming Appointments</h2>
                    <Link to="/appointments" className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700 text-sm">
                        Book New Appointment
                    </Link>
                 </div>
                 <AppointmentList appointments={upcomingAppointments} onAppointmentClick={onAppointmentClick} />
            </div>
        </>
    );
};

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<{
        appointment: Appointment | null;
        patient: Patient | null;
        doctor: Doctor | null;
    }>({ appointment: null, patient: null, doctor: null });

    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const doctorMap = useMemo(() => new Map(mockDoctors.map(d => [d.id, d])), []);

    const handleOpenAppointmentModal = (appointment: Appointment) => {
        setSelectedAppointmentDetails({
            appointment,
            patient: patientMap.get(appointment.patientId) || null,
            doctor: doctorMap.get(appointment.doctorId) || null,
        });
        setIsDetailModalOpen(true);
    };
    
    const handleCloseModal = () => setIsDetailModalOpen(false);

    if (!user) {
        return <div>Loading user profile...</div>;
    }

    const renderDashboardByRole = () => {
        switch (user.role) {
            case 'admin':
            case 'receptionist':
                return <AdminReceptionistDashboard />;
            case 'doctor':
            case 'nurse':
                return <DoctorNurseDashboard user={user} onAppointmentClick={handleOpenAppointmentModal} />;
            case 'patient':
                return <PatientDashboard user={user} onAppointmentClick={handleOpenAppointmentModal} />;
            default:
                return <p>No dashboard view available for your role.</p>;
        }
    }

    const getSubtitle = () => {
        switch (user.role) {
            case 'admin':
            case 'receptionist':
                return "Here's a summary of your hospital's activity today.";
            case 'doctor':
            case 'nurse':
                return "Here is your schedule and key metrics for today.";
            case 'patient':
                 return "Here you can manage your appointments and view your health summary.";
            default:
                return "Welcome to the Hospital Management System."
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-slate-500 mt-1">{getSubtitle()}</p>
            </div>
            
            {renderDashboardByRole()}

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
