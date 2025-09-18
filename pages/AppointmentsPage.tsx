import React, { useState, useMemo, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { mockAppointments, mockPatients, mockDoctors } from '../data/mockData';
import type { Appointment, AppointmentFormData, Patient, Doctor } from '../types';
import { useAuth } from '../hooks/useAuth';
import AddAppointmentModal from '../components/AddAppointmentModal';
import AppointmentDetailModal from '../components/AppointmentDetailModal';

const getEventColor = (status: Appointment['status']) => {
    switch (status) {
        case 'Confirmed': return '#10b981'; // green-500
        case 'Pending': return '#f59e0b'; // amber-500
        case 'Cancelled': return '#ef4444'; // red-500
        default: return '#64748b'; // slate-500
    }
};

export const AppointmentsPage: React.FC = () => {
    const { hasRole } = useAuth();
    const canManageAppointments = hasRole(['admin', 'doctor', 'receptionist', 'nurse']);

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    
    // State for Filters
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | 'all'>('all');
    const [selectedPatientId, setSelectedPatientId] = useState<number | 'all'>('all');
    const [selectedStatus, setSelectedStatus] = useState<Appointment['status'] | 'all'>('all');

    // State for Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // State for data passed to modals
    const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
    const [defaultDate, setDefaultDate] = useState<string | null>(null);
    const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<{
        appointment: Appointment | null;
        patient: Patient | null;
        doctor: Doctor | null;
    }>({ appointment: null, patient: null, doctor: null });

    useEffect(() => {
        setAppointments(mockAppointments);
    }, []);

    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const doctorMap = useMemo(() => new Map(mockDoctors.map(d => [d.id, d])), []);

    const calendarEvents = useMemo(() => {
        const filteredAppointments = appointments.filter(a => {
            const doctorMatch = selectedDoctorId === 'all' || a.doctorId === selectedDoctorId;
            const patientMatch = selectedPatientId === 'all' || a.patientId === selectedPatientId;
            const statusMatch = selectedStatus === 'all' || a.status === selectedStatus;
            return doctorMatch && patientMatch && statusMatch;
        });

        return filteredAppointments.map(a => ({
            id: String(a.id),
            title: patientMap.get(a.patientId)?.name || 'Unknown',
            start: new Date(`${a.date} ${a.time.replace(/(AM|PM)/, ' $1')}`),
            allDay: false,
            backgroundColor: getEventColor(a.status),
            borderColor: getEventColor(a.status),
            extendedProps: {
                status: a.status,
            }
        }));
    }, [appointments, patientMap, selectedDoctorId, selectedPatientId, selectedStatus]);

    const handleDateClick = (arg: { dateStr: string }) => {
        if (!canManageAppointments) return;
        setAppointmentToEdit(null);
        setDefaultDate(arg.dateStr);
        setIsAddModalOpen(true);
    };

    const handleEventClick = (clickInfo: { event: { id: string } }) => {
        const appointmentId = Number(clickInfo.event.id);
        const appointment = appointments.find(a => a.id === appointmentId);
        if (appointment) {
            setSelectedAppointmentDetails({
                appointment,
                patient: patientMap.get(appointment.patientId) || null,
                doctor: doctorMap.get(appointment.doctorId) || null,
            });
            setIsDetailModalOpen(true);
        }
    };

    const handleCloseModals = () => {
        setIsAddModalOpen(false);
        setIsDetailModalOpen(false);
        setAppointmentToEdit(null);
        setDefaultDate(null);
        setSelectedAppointmentDetails({ appointment: null, patient: null, doctor: null });
    };

    const handleSaveAppointment = (formData: AppointmentFormData) => {
        if (appointmentToEdit) {
            // Edit
            setAppointments(appointments.map(a =>
                a.id === appointmentToEdit.id ? { ...appointmentToEdit, ...formData, status: 'Confirmed' } : a
            ));
        } else {
            // Add
            const newAppointment: Appointment = {
                id: Math.max(...appointments.map(a => a.id), 0) + 1,
                ...formData,
                status: 'Confirmed',
            };
            setAppointments([...appointments, newAppointment]);
        }
        handleCloseModals();
    };

    const handleOpenEditModal = () => {
        if (!selectedAppointmentDetails.appointment) return;
        setAppointmentToEdit(selectedAppointmentDetails.appointment);
        setIsDetailModalOpen(false); // Close detail modal
        setIsAddModalOpen(true);   // Open add/edit modal
    };

    const handleCancelAppointment = () => {
        if (!selectedAppointmentDetails.appointment) return;
        setAppointments(prev => prev.map(appt => 
            appt.id === selectedAppointmentDetails.appointment!.id 
                ? { ...appt, status: 'Cancelled' }
                : appt
        ));
        handleCloseModals();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Appointment Scheduling</h1>
                <p className="text-slate-500 mt-1">Visually manage and schedule patient appointments.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-slate-200">
                    <h3 className="text-md font-semibold text-slate-700 shrink-0">Filter By:</h3>
                    <div className="flex items-center gap-2">
                        <label htmlFor="doctor-filter" className="text-sm font-medium text-slate-600">Doctor:</label>
                        <select
                            id="doctor-filter"
                            value={selectedDoctorId}
                            onChange={e => setSelectedDoctorId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        >
                            <option value="all">All Doctors</option>
                            {mockDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center gap-2">
                        <label htmlFor="patient-filter" className="text-sm font-medium text-slate-600">Patient:</label>
                        <select
                            id="patient-filter"
                            value={selectedPatientId}
                            onChange={e => setSelectedPatientId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        >
                            <option value="all">All Patients</option>
                            {mockPatients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center gap-2">
                        <label htmlFor="status-filter" className="text-sm font-medium text-slate-600">Status:</label>
                        <select
                            id="status-filter"
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value as Appointment['status'] | 'all')}
                            className="p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={calendarEvents}
                    editable={canManageAppointments}
                    selectable={canManageAppointments}
                    selectMirror={true}
                    dayMaxEvents={true}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    height="auto"
                />
            </div>
            
            {/* Detail Modal */}
            <AppointmentDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModals}
                appointment={selectedAppointmentDetails.appointment}
                patient={selectedAppointmentDetails.patient}
                doctor={selectedAppointmentDetails.doctor}
                onEdit={canManageAppointments ? handleOpenEditModal : undefined}
                onCancel={canManageAppointments ? handleCancelAppointment : undefined}
            />

            {/* Add/Edit Modal */}
            {canManageAppointments && (
                <AddAppointmentModal
                    isOpen={isAddModalOpen}
                    onClose={handleCloseModals}
                    onSaveAppointment={handleSaveAppointment}
                    appointmentToEdit={appointmentToEdit}
                    defaultDate={defaultDate}
                    patients={mockPatients}
                    doctors={mockDoctors}
                />
            )}
        </div>
    );
};