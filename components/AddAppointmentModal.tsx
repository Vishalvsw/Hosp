import React, { useState, useEffect } from 'react';
import type { Appointment, AppointmentFormData, Patient, Doctor } from '../types';
import { XIcon } from './icons/XIcon';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAppointment: (appointment: AppointmentFormData) => void;
  appointmentToEdit: Appointment | null;
  defaultDate?: string | null;
  patients: Patient[];
  doctors: Doctor[];
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSaveAppointment,
  appointmentToEdit,
  defaultDate,
  patients,
  doctors,
}) => {
  const [patientId, setPatientId] = useState<number | ''>('');
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');

  const [errors, setErrors] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (appointmentToEdit) {
        setPatientId(appointmentToEdit.patientId);
        setDoctorId(appointmentToEdit.doctorId);
        setDate(appointmentToEdit.date);
        setTime(appointmentToEdit.time);
        setType(appointmentToEdit.type);
      } else {
        // Reset form for a new appointment
        setPatientId('');
        setDoctorId('');
        setDate(defaultDate || new Date().toISOString().split('T')[0]);
        setTime('');
        setType('');
      }
      setErrors({ patientId: '', doctorId: '', date: '', time: '', type: '' });
    }
  }, [isOpen, appointmentToEdit, defaultDate]);

  const validate = () => {
    const newErrors = { patientId: '', doctorId: '', date: '', time: '', type: '' };
    let isValid = true;
    
    if (!patientId) {
        newErrors.patientId = 'Patient is required.';
        isValid = false;
    }
    if (!doctorId) {
        newErrors.doctorId = 'Doctor is required.';
        isValid = false;
    }
    if (!date) {
        newErrors.date = 'Date is required.';
        isValid = false;
    }
    if (!time.trim()) {
        newErrors.time = 'Time is required.';
        isValid = false;
    } else if (!/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(time.trim())) {
        newErrors.time = 'Time must be in HH:MM AM/PM format.';
        isValid = false;
    }
    if (!type.trim()) {
        newErrors.type = 'Appointment type is required.';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveAppointment({
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        date,
        time: time.toUpperCase(),
        type,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEditing = !!appointmentToEdit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="appointment-patient" className="block text-sm font-medium text-slate-700">Patient</label>
              <select
                id="appointment-patient"
                value={patientId}
                onChange={(e) => setPatientId(Number(e.target.value))}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.patientId ? 'border-red-500' : 'border-slate-300'}`}
              >
                <option value="" disabled>Select a patient</option>
                {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.patientId && <p className="text-sm text-red-600 mt-1">{errors.patientId}</p>}
            </div>
             <div>
              <label htmlFor="appointment-doctor" className="block text-sm font-medium text-slate-700">Doctor</label>
              <select
                id="appointment-doctor"
                value={doctorId}
                onChange={(e) => setDoctorId(Number(e.target.value))}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.doctorId ? 'border-red-500' : 'border-slate-300'}`}
              >
                <option value="" disabled>Select a doctor</option>
                {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
              {errors.doctorId && <p className="text-sm text-red-600 mt-1">{errors.doctorId}</p>}
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="appointment-date" className="block text-sm font-medium text-slate-700">Date</label>
                <input
                    type="date"
                    id="appointment-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.date ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
            </div>
            <div>
                <label htmlFor="appointment-time" className="block text-sm font-medium text-slate-700">Time</label>
                <input
                    type="text"
                    id="appointment-time"
                    placeholder="e.g., 09:30 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.time ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.time && <p className="text-sm text-red-600 mt-1">{errors.time}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="appointment-type" className="block text-sm font-medium text-slate-700">Type of Appointment</label>
            <input
              type="text"
              id="appointment-type"
              placeholder="e.g., Consultation, Follow-up"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.type ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Cancel</button>
            <button type="submit" className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700">{isEditing ? 'Save Changes' : 'Schedule'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;