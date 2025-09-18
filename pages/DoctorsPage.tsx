import React, { useState, useMemo, useEffect } from 'react';
import { mockDoctors } from '../data/mockData';
import type { Doctor, DoctorFormData } from '../types';
import { useAuth } from '../hooks/useAuth';
import AddDoctorModal from '../components/AddDoctorModal';
import { SearchIcon } from '../components/icons/SearchIcon';

export const DoctorsPage: React.FC = () => {
    const { hasRole } = useAuth();
    const canManageDoctors = hasRole(['admin', 'receptionist']);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

    useEffect(() => {
        setDoctors(mockDoctors);
    }, []);

    const filteredDoctors = useMemo(() => {
        return doctors.filter(d => 
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [doctors, searchTerm]);

    const handleOpenAddModal = (doctor: Doctor | null = null) => {
        setDoctorToEdit(doctor);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setDoctorToEdit(null);
    };

    const handleSaveDoctor = (formData: DoctorFormData) => {
        if (doctorToEdit) {
            // Edit
            setDoctors(doctors.map(d =>
                d.id === doctorToEdit.id ? { ...doctorToEdit, ...formData } : d
            ));
        } else {
            // Add
            const newDoctor: Doctor = {
                id: Math.max(...doctors.map(d => d.id), 0) + 1,
                ...formData,
            };
            setDoctors([...doctors, newDoctor]);
        }
        handleCloseAddModal();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Doctor Management</h1>
                <p className="text-slate-500 mt-1">Search, view, and manage doctor profiles.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or specialty..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    {canManageDoctors && (
                        <button onClick={() => handleOpenAddModal()} className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700">
                            Add New Doctor
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Specialty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                {canManageDoctors && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredDoctors.map(doctor => (
                                <tr key={doctor.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{doctor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doctor.specialty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doctor.contactPhone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doctor.email}</td>
                                    {canManageDoctors && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleOpenAddModal(doctor)} className="text-cyan-600 hover:text-cyan-900">Edit</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {canManageDoctors && (
                <AddDoctorModal
                    isOpen={isAddModalOpen}
                    onClose={handleCloseAddModal}
                    onSaveDoctor={handleSaveDoctor}
                    doctorToEdit={doctorToEdit}
                />
            )}
        </div>
    );
};