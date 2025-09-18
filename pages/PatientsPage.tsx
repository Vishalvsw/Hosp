import React, { useState, useMemo, useEffect } from 'react';
import { mockPatients, mockAppointments, mockEMRData, mockDoctors } from '../data/mockData';
import type { Patient, PatientFormData } from '../types';
import { useAuth } from '../hooks/useAuth';
import AddPatientModal from '../components/AddPatientModal';
import PatientDetailModal from '../components/PatientDetailModal';
import { SearchIcon } from '../components/icons/SearchIcon';

const getStatusColor = (status: Patient['status']) => {
    switch (status) {
        case 'Stable': return 'bg-blue-100 text-blue-800';
        case 'Recovering': return 'bg-green-100 text-green-800';
        case 'Critical': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

export const PatientsPage: React.FC = () => {
    const { hasRole } = useAuth();
    const canManagePatients = hasRole(['admin', 'receptionist']);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<Patient | null>(null);

    useEffect(() => {
        setPatients(mockPatients);
    }, []);

    const filteredPatients = useMemo(() => {
        return patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [patients, searchTerm]);

    const handleOpenAddModal = (patient: Patient | null = null) => {
        setPatientToEdit(patient);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setPatientToEdit(null);
    };

    const handleOpenDetailModal = (patient: Patient) => {
        setSelectedPatientForDetails(patient);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedPatientForDetails(null);
    };

    const handleSavePatient = (formData: PatientFormData) => {
        if (patientToEdit) {
            // Edit
            setPatients(patients.map(p =>
                p.id === patientToEdit.id ? { ...patientToEdit, ...formData } : p
            ));
        } else {
            // Add
            const newPatient: Patient = {
                id: Math.max(...patients.map(p => p.id)) + 1,
                ...formData,
                lastVisit: new Date().toISOString().split('T')[0],
                status: 'Stable',
            };
            setPatients([...patients, newPatient]);
        }
        handleCloseAddModal();
    };

    const patientDetailsData = useMemo(() => {
        if (!selectedPatientForDetails) return { appointments: [], emrRecords: [] };

        const appointments = mockAppointments.filter(a => a.patientId === selectedPatientForDetails.id)
                                             .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const emrRecords = mockEMRData.filter(r => r.patientId === selectedPatientForDetails.id)
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { appointments, emrRecords };
    }, [selectedPatientForDetails]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Patient Management</h1>
                <p className="text-slate-500 mt-1">Search, view, and manage patient records.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by patient name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    {canManagePatients && (
                        <button onClick={() => handleOpenAddModal()} className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700">
                            Add New Patient
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Age</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Visit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredPatients.map(patient => (
                                <tr key={patient.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{patient.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{patient.age}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{patient.gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{patient.contactPhone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{patient.lastVisit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                       <div className="flex items-center gap-4">
                                            <button onClick={() => handleOpenDetailModal(patient)} className="text-cyan-600 hover:text-cyan-900">
                                                View Details
                                            </button>
                                            {canManagePatients && (
                                                <button onClick={() => handleOpenAddModal(patient)} className="text-slate-600 hover:text-slate-900">Edit</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {canManagePatients && (
                <AddPatientModal
                    isOpen={isAddModalOpen}
                    onClose={handleCloseAddModal}
                    onSavePatient={handleSavePatient}
                    patientToEdit={patientToEdit}
                />
            )}

            <PatientDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                patient={selectedPatientForDetails}
                appointments={patientDetailsData.appointments}
                emrRecords={patientDetailsData.emrRecords}
                doctors={mockDoctors}
            />
        </div>
    );
};