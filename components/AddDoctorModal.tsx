import React, { useState, useEffect } from 'react';
import type { Doctor, DoctorFormData } from '../types';
import { XIcon } from './icons/XIcon';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDoctor: (doctor: DoctorFormData) => void;
  doctorToEdit: Doctor | null;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onSaveDoctor, doctorToEdit }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    specialty: '',
    contactPhone: '',
    email: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (doctorToEdit) {
        setName(doctorToEdit.name);
        setSpecialty(doctorToEdit.specialty);
        setContactPhone(doctorToEdit.contactPhone);
        setEmail(doctorToEdit.email);
      } else {
        setName('');
        setSpecialty('');
        setContactPhone('');
        setEmail('');
      }
      setErrors({ name: '', specialty: '', contactPhone: '', email: ''});
    }
  }, [isOpen, doctorToEdit]);

  const validate = () => {
    const newErrors = { name: '', specialty: '', contactPhone: '', email: ''};
    let isValid = true;
    
    if (!name.trim()) {
        newErrors.name = 'Name is required.';
        isValid = false;
    }

    if (!specialty.trim()) {
        newErrors.specialty = 'Specialty is required.';
        isValid = false;
    }
    
    if (!contactPhone.trim()) {
        newErrors.contactPhone = 'Contact phone is required.';
        isValid = false;
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(contactPhone.trim())) {
        newErrors.contactPhone = 'Phone must be in XXX-XXX-XXXX format.';
        isValid = false;
    }

    if (!email.trim()) {
        newErrors.email = 'Email is required.';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveDoctor({
        name,
        specialty,
        contactPhone,
        email,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEditing = !!doctorToEdit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Doctor Profile' : 'Add New Doctor'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="doctor-name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              id="doctor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="doctor-specialty" className="block text-sm font-medium text-slate-700">Specialty</label>
            <input
              type="text"
              id="doctor-specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.specialty ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.specialty && <p className="text-sm text-red-600 mt-1">{errors.specialty}</p>}
          </div>
          <div>
            <label htmlFor="doctor-contact" className="block text-sm font-medium text-slate-700">Contact Phone</label>
            <input
              type="text"
              id="doctor-contact"
              placeholder="e.g., 555-123-4567"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.contactPhone ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.contactPhone && <p className="text-sm text-red-600 mt-1">{errors.contactPhone}</p>}
          </div>
           <div>
            <label htmlFor="doctor-email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              id="doctor-email"
              placeholder="e.g., name@hms.pro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Cancel</button>
            <button type="submit" className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700">{isEditing ? 'Save Changes' : 'Add Doctor'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
