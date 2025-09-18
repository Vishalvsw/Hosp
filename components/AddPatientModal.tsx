import React, { useState, useEffect } from 'react';
import type { Patient, PatientFormData } from '../types';
import { XIcon } from './icons/XIcon';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePatient: (patient: PatientFormData) => void;
  patientToEdit: Patient | null;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onSavePatient, patientToEdit }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [contactPhone, setContactPhone] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [groupNumber, setGroupNumber] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    age: '',
    contactPhone: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (patientToEdit) {
        setName(patientToEdit.name);
        setAge(String(patientToEdit.age));
        setGender(patientToEdit.gender);
        setContactPhone(patientToEdit.contactPhone);
        setInsuranceProvider(patientToEdit.insuranceProvider || '');
        setPolicyNumber(patientToEdit.policyNumber || '');
        setGroupNumber(patientToEdit.groupNumber || '');
      } else {
        // Reset form for adding a new patient
        setName('');
        setAge('');
        setGender('Male');
        setContactPhone('');
        setInsuranceProvider('');
        setPolicyNumber('');
        setGroupNumber('');
      }
      // Clear previous errors when modal opens
      setErrors({ name: '', age: '', contactPhone: ''});
    }
  }, [isOpen, patientToEdit]);

  const validate = () => {
    const newErrors = { name: '', age: '', contactPhone: ''};
    let isValid = true;
    
    if (!name.trim()) {
        newErrors.name = 'Name is required.';
        isValid = false;
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum <= 0) {
        newErrors.age = 'A valid age is required.';
        isValid = false;
    }
    
    if (!contactPhone.trim()) {
        newErrors.contactPhone = 'Contact phone is required.';
        isValid = false;
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(contactPhone.trim())) {
        newErrors.contactPhone = 'Phone must be in XXX-XXX-XXXX format.';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSavePatient({
        name,
        age: parseInt(age, 10),
        gender,
        contactPhone,
        insuranceProvider: insuranceProvider.trim() || undefined,
        policyNumber: policyNumber.trim() || undefined,
        groupNumber: groupNumber.trim() || undefined,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEditing = !!patientToEdit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Patient' : 'Add New Patient'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <div>
            <label htmlFor="patient-name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              id="patient-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="patient-age" className="block text-sm font-medium text-slate-700">Age</label>
                <input
                    type="number"
                    id="patient-age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.age ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.age && <p className="text-sm text-red-600 mt-1">{errors.age}</p>}
            </div>
            <div>
                <label htmlFor="patient-gender" className="block text-sm font-medium text-slate-700">Gender</label>
                <select
                    id="patient-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
          </div>
          <div>
            <label htmlFor="patient-contact" className="block text-sm font-medium text-slate-700">Contact Phone</label>
            <input
              type="text"
              id="patient-contact"
              placeholder="e.g., 555-123-4567"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.contactPhone ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.contactPhone && <p className="text-sm text-red-600 mt-1">{errors.contactPhone}</p>}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-md font-medium text-slate-700 mb-2">Insurance Details (Optional)</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="patient-insurance" className="block text-sm font-medium text-slate-700">Insurance Provider</label>
                    <input
                        type="text"
                        id="patient-insurance"
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="patient-policy" className="block text-sm font-medium text-slate-700">Policy Number</label>
                        <input
                            type="text"
                            id="patient-policy"
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="patient-group" className="block text-sm font-medium text-slate-700">Group Number</label>
                        <input
                            type="text"
                            id="patient-group"
                            value={groupNumber}
                            onChange={(e) => setGroupNumber(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                </div>
            </div>
          </div>


          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Cancel</button>
            <button type="submit" className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700">{isEditing ? 'Save Changes' : 'Add Patient'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;