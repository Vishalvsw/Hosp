import React, { useState, useMemo, useEffect } from 'react';
import { mockEMRData, mockPatients, mockAppointments, mockDoctors } from '../data/mockData';
import type { EMRRecord, Appointment, Patient, Doctor, EMRRecordType } from '../types';
import { useAuth } from '../hooks/useAuth';
import AddEMRRecordModal from '../components/AddEMRRecordModal';
import AppointmentDetailModal from '../components/AppointmentDetailModal';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';

const getRecordTypeColor = (type: EMRRecord['type']) => {
    const colors: Record<EMRRecord['type'], string> = {
        'Progress Note': 'bg-blue-100 text-blue-800',
        'Allergy': 'bg-red-100 text-red-800',
        'Medication': 'bg-green-100 text-green-800',
        'Lab Result': 'bg-purple-100 text-purple-800',
        'Imaging Report': 'bg-amber-100 text-amber-800',
    };
    return colors[type] || 'bg-slate-100 text-slate-800';
};

const recordTypes: EMRRecordType[] = ['Progress Note', 'Allergy', 'Medication', 'Lab Result', 'Imaging Report'];
const SNIPPET_LENGTH = 80;

export const EMRPage: React.FC = () => {
    const { hasRole } = useAuth();
    const canManageEMR = hasRole(['admin', 'doctor', 'nurse']);

    const [records, setRecords] = useState<EMRRecord[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<EMRRecordType | 'all'>('all');
    const [expandedRecordId, setExpandedRecordId] = useState<number | null>(null);
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<EMRRecord | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<{
        appointment: Appointment | null;
        patient: Patient | null;
        doctor: Doctor | null;
    }>({ appointment: null, patient: null, doctor: null });

    useEffect(() => {
        setRecords(mockEMRData);
    }, []);

    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p.name])), []);
    const appointmentMap = useMemo(() => new Map(mockAppointments.map(a => [a.id, a])), []);
    const doctorMap = useMemo(() => new Map(mockDoctors.map(d => [d.id, d])), []);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const patientMatch = selectedPatientId === 'all' || record.patientId === selectedPatientId;
            const typeMatch = selectedType === 'all' || record.type === selectedType;
            return patientMatch && typeMatch;
        });
    }, [records, selectedPatientId, selectedType]);

    const handleOpenAddModal = (record: EMRRecord | null = null) => {
        setRecordToEdit(record);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setRecordToEdit(null);
    };

    const handleSaveRecord = (formData: Omit<EMRRecord, 'id'>) => {
        if (recordToEdit) {
            // Edit
            setRecords(records.map(r => r.id === recordToEdit.id ? { ...recordToEdit, ...formData } : r));
        } else {
            // Add
            const newRecord: EMRRecord = {
                id: Math.max(...records.map(r => r.id), 0) + 1,
                ...formData
            };
            setRecords([newRecord, ...records]);
        }
        handleCloseAddModal();
    };

    const handleOpenAppointmentModal = (appointmentId: number) => {
        const appointment = appointmentMap.get(appointmentId);
        if (appointment) {
            const patient = mockPatients.find(p => p.id === appointment.patientId) || null;
            const doctor = doctorMap.get(appointment.doctorId) || null;
            setSelectedAppointmentDetails({ appointment, patient, doctor });
            setIsDetailModalOpen(true);
        }
    };
    
    const handleCloseDetailModal = () => setIsDetailModalOpen(false);

    const handleToggleExpand = (recordId: number) => {
        setExpandedRecordId(prevId => (prevId === recordId ? null : recordId));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Electronic Medical Records (EMR)</h1>
                <p className="text-slate-500 mt-1">Browse and manage patient clinical data.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <label htmlFor="patient-filter" className="text-sm font-medium text-slate-700 mr-2">Patient:</label>
                            <select
                                id="patient-filter"
                                value={selectedPatientId}
                                onChange={e => setSelectedPatientId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="all">All Patients</option>
                                {mockPatients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="type-filter" className="text-sm font-medium text-slate-700 mr-2">Type:</label>
                            <select
                                id="type-filter"
                                value={selectedType}
                                onChange={e => setSelectedType(e.target.value as EMRRecordType | 'all')}
                                className="p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="all">All Types</option>
                                {recordTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>
                    {canManageEMR && (
                        <button onClick={() => handleOpenAddModal()} className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700">
                            Add New Record
                        </button>
                    )}
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Record Summary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredRecords.map(record => {
                                const isExpanded = expandedRecordId === record.id;
                                const isTruncated = record.details.length > SNIPPET_LENGTH;
                                const snippet = isTruncated ? record.details.substring(0, SNIPPET_LENGTH) + '...' : record.details;

                                return (
                                <React.Fragment key={record.id}>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{patientMap.get(record.patientId) || 'Unknown'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{record.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRecordTypeColor(record.type)}`}>
                                                {record.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-sm">
                                            <p className="font-semibold text-slate-800 truncate">{record.title}</p>
                                            <p className="text-slate-500">{snippet}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{record.author}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-4">
                                                {canManageEMR && (
                                                    <button onClick={() => handleOpenAddModal(record)} className="text-cyan-600 hover:text-cyan-900">Edit</button>
                                                )}
                                                {record.appointmentId && (
                                                    <button
                                                        onClick={() => handleOpenAppointmentModal(record.appointmentId!)}
                                                        className="text-slate-500 hover:text-slate-700"
                                                        title="View Associated Appointment"
                                                    >
                                                        <CalendarIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {isTruncated && (
                                                     <button
                                                        onClick={() => handleToggleExpand(record.id)}
                                                        className="text-slate-500 hover:text-slate-700"
                                                        title={isExpanded ? "Collapse" : "Expand Details"}
                                                    >
                                                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && isTruncated && (
                                        <tr className="bg-slate-50">
                                            <td colSpan={6} className="px-10 py-4 text-sm text-slate-800 border-l-4 border-cyan-500">
                                                 <h4 className="font-bold mb-2 text-slate-700">Full Details for "{record.title}"</h4>
                                                 <p className="whitespace-pre-wrap leading-relaxed">{record.details}</p>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {canManageEMR && (
                <AddEMRRecordModal
                    isOpen={isAddModalOpen}
                    onClose={handleCloseAddModal}
                    onSaveRecord={handleSaveRecord}
                    recordToEdit={recordToEdit}
                    patients={mockPatients}
                />
            )}
            
            <AppointmentDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                appointment={selectedAppointmentDetails.appointment}
                patient={selectedAppointmentDetails.patient}
                doctor={selectedAppointmentDetails.doctor}
            />
        </div>
    );
};