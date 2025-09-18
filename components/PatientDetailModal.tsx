import React from 'react';
import type { Patient, Appointment, EMRRecord, Doctor } from '../types';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  appointments: Appointment[];
  emrRecords: EMRRecord[];
  doctors: Doctor[];
}

const getStatusColor = (status: Patient['status']) => {
    switch (status) {
        case 'Stable': return 'bg-blue-100 text-blue-800';
        case 'Recovering': return 'bg-green-100 text-green-800';
        case 'Critical': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const getAppointmentStatusColor = (status: Appointment['status']) => {
    switch (status) {
        case 'Confirmed': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-amber-100 text-amber-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ isOpen, onClose, patient, appointments, emrRecords, doctors }) => {
  if (!isOpen || !patient) return null;

  const doctorMap = new Map(doctors.map(d => [d.id, d.name]));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-cyan-100 p-2 rounded-full">
                <UserIcon className="w-6 h-6 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{patient.name} - Patient Details</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="my-4 space-y-6 overflow-y-auto pr-2">
            {/* Demographics */}
            <div>
                 <h3 className="font-semibold text-slate-800 mb-2">Demographic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="font-semibold text-slate-700">Age & Gender</p>
                        <p className="text-slate-600">{patient.age}, {patient.gender}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="font-semibold text-slate-700">Contact</p>
                        <p className="text-slate-600">{patient.contactPhone}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="font-semibold text-slate-700">Status</p>
                        <span className={`px-2 py-1 font-semibold rounded-full text-xs ${getStatusColor(patient.status)}`}>
                            {patient.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Insurance Information */}
            <div>
                <h3 className="font-semibold text-slate-800 mb-2">Insurance Details</h3>
                {(patient.insuranceProvider || patient.policyNumber) ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="font-semibold text-slate-700">Provider</p>
                            <p className="text-slate-600">{patient.insuranceProvider || 'N/A'}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="font-semibold text-slate-700">Policy #</p>
                            <p className="text-slate-600">{patient.policyNumber || 'N/A'}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="font-semibold text-slate-700">Group #</p>
                            <p className="text-slate-600">{patient.groupNumber || 'N/A'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 text-center text-sm text-slate-500 bg-slate-50 rounded-lg">
                        No insurance information on file.
                    </div>
                )}
            </div>

            {/* Appointment History */}
            <div>
                <h3 className="font-semibold text-slate-800 mb-2">Appointment History</h3>
                <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
                    {appointments.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date & Time</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Doctor</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {appointments.map(appt => (
                                    <tr key={appt.id}>
                                        <td className="px-4 py-2 text-sm text-slate-600">{appt.date} at {appt.time}</td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{doctorMap.get(appt.doctorId) || 'N/A'}</td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{appt.type}</td>
                                        <td className="px-4 py-2 text-sm">
                                            <span className={`px-2 py-1 font-semibold rounded-full text-xs ${getAppointmentStatusColor(appt.status)}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-4 text-center text-sm text-slate-500">No appointment history found.</p>
                    )}
                </div>
            </div>

            {/* Medical History */}
            <div>
                <h3 className="font-semibold text-slate-800 mb-2">Medical History Summary</h3>
                 <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
                    {emrRecords.length > 0 ? (
                         <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {emrRecords.map(record => (
                                    <tr key={record.id}>
                                        <td className="px-4 py-2 text-sm text-slate-600">{record.date}</td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{record.type}</td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{record.title}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <p className="p-4 text-center text-sm text-slate-500">No medical records found.</p>
                    )}
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-200 flex justify-end flex-shrink-0">
            <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;