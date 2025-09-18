import React from 'react';
import type { Appointment, Patient, Doctor } from '../types';
import { useAuth } from '../hooks/useAuth';
import { XIcon } from './icons/XIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  patient: Patient | null;
  doctor: Doctor | null;
  onEdit?: () => void;
  onCancel?: () => void;
}

const getStatusColor = (status?: Appointment['status']) => {
    if (!status) return 'bg-slate-100 text-slate-800';
    switch (status) {
        case 'Confirmed': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-amber-100 text-amber-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ isOpen, onClose, appointment, patient, doctor, onEdit, onCancel }) => {
  const { hasRole } = useAuth();
  const canManageAppointments = hasRole(['admin', 'receptionist', 'doctor', 'nurse']);

  if (!isOpen || !appointment) return null;

  const isCancelled = appointment.status === 'Cancelled';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-100 p-2 rounded-full">
              <CalendarIcon className="w-6 h-6 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Appointment Details</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Status:</span>
                <span className={`px-2 py-1 font-semibold rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
                <p className="font-semibold text-slate-700">Patient Information</p>
                <p className="text-slate-600">{patient?.name ?? 'Unknown Patient'}, {patient?.age ?? 'N/A'} years old</p>
                <p className="text-slate-600">Contact: {patient?.contactPhone ?? 'N/A'}</p>
            </div>
             <div className="bg-slate-50 p-3 rounded-lg">
                <p className="font-semibold text-slate-700">Doctor Information</p>
                <p className="text-slate-600">{doctor?.name ?? 'Unknown Doctor'}</p>
                <p className="text-slate-600">Specialty: {doctor?.specialty ?? 'N/A'}</p>
            </div>
             <div className="bg-slate-50 p-3 rounded-lg">
                <p className="font-semibold text-slate-700">Appointment Information</p>
                <p className="text-slate-600">Date: {appointment.date}</p>
                <p className="text-slate-600">Time: {appointment.time}</p>
                <p className="text-slate-600">Type: {appointment.type}</p>
            </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Close</button>
            {canManageAppointments && !isCancelled && onCancel && (
                 <button 
                    type="button" 
                    onClick={onCancel} 
                    className="flex items-center gap-2 bg-red-100 text-red-700 font-semibold py-2 px-4 rounded-md hover:bg-red-200"
                >
                    <TrashIcon className="w-4 h-4" />
                    Cancel Appointment
                </button>
            )}
             {canManageAppointments && !isCancelled && onEdit && (
                 <button 
                    type="button" 
                    onClick={onEdit} 
                    className="flex items-center gap-2 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700"
                >
                    <EditIcon className="w-4 h-4" />
                    Edit
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;