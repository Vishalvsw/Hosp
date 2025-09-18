import React, { useState, useEffect } from 'react';
import type { EMRRecord, Patient, EMRRecordType } from '../types';
import { XIcon } from './icons/XIcon';

interface AddEMRRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (record: Omit<EMRRecord, 'id'>) => void;
  recordToEdit: EMRRecord | null;
  patients: Patient[];
}

const recordTypes: EMRRecordType[] = ['Progress Note', 'Allergy', 'Medication', 'Lab Result', 'Imaging Report'];

// Helper to parse medication details string for editing
const parseMedicationDetails = (detailsStr: string) => {
    const parsed = { dosage: '', frequency: '', startDate: '', endDate: '', notes: '' };
    const parts = detailsStr.split('. ');
    const noteParts: string[] = [];

    parts.forEach(part => {
        if (part.startsWith('Dosage: ')) parsed.dosage = part.replace('Dosage: ', '').trim();
        else if (part.startsWith('Frequency: ')) parsed.frequency = part.replace('Frequency: ', '').trim();
        else if (part.startsWith('Start Date: ')) parsed.startDate = part.replace('Start Date: ', '').trim();
        else if (part.startsWith('End Date: ')) parsed.endDate = part.replace('End Date: ', '').trim();
        else if (part.startsWith('Notes: ')) parsed.notes = part.replace('Notes: ', '').trim();
        else if (part) noteParts.push(part);
    });
    
    // Fallback for older, unstructured detail formats
    if (noteParts.length > 0 && !parsed.dosage && !parsed.frequency) {
        parsed.notes = noteParts.join('. ');
    }

    return parsed;
};


const AddEMRRecordModal: React.FC<AddEMRRecordModalProps> = ({ isOpen, onClose, onSaveRecord, recordToEdit, patients }) => {
  const [patientId, setPatientId] = useState<number | ''>('');
  const [type, setType] = useState<EMRRecordType>('Progress Note');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState(''); // Will be used for "Notes" in medication
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [author, setAuthor] = useState('Dr. Carol Evans');

  // New state for medication form
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const [errors, setErrors] = useState({
    patientId: '',
    title: '',
    details: '',
    date: '',
    author: '',
    dosage: '',
    frequency: '',
    startDate: '',
  });

  const resetForm = () => {
    setPatientId('');
    setType('Progress Note');
    setTitle('');
    setDetails('');
    setDate(new Date().toISOString().split('T')[0]);
    setAuthor('Dr. Carol Evans');
    setDosage('');
    setFrequency('');
    setStartDate('');
    setEndDate('');
    setErrors({ patientId: '', title: '', details: '', date: '', author: '', dosage: '', frequency: '', startDate: '' });
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (recordToEdit) {
        setPatientId(recordToEdit.patientId);
        setType(recordToEdit.type);
        setTitle(recordToEdit.title);
        setDate(recordToEdit.date);
        setAuthor(recordToEdit.author);

        if (recordToEdit.type === 'Medication') {
          const parsed = parseMedicationDetails(recordToEdit.details);
          setDosage(parsed.dosage);
          setFrequency(parsed.frequency);
          setStartDate(parsed.startDate || recordToEdit.date);
          setEndDate(parsed.endDate);
          setDetails(parsed.notes); // 'details' state now holds the notes
        } else {
          setDetails(recordToEdit.details);
        }
      }
    }
  }, [isOpen, recordToEdit]);

  const validate = () => {
    const newErrors = { patientId: '', title: '', details: '', date: '', author: '', dosage: '', frequency: '', startDate: '' };
    let isValid = true;
    
    if (!patientId) { newErrors.patientId = 'A patient must be selected.'; isValid = false; }
    if (!author.trim()) { newErrors.author = 'Author is required.'; isValid = false; }
    if (!date) { newErrors.date = 'Date is required.'; isValid = false; }
    else if (new Date(date) > new Date()) { newErrors.date = 'Date cannot be in the future.'; isValid = false; }
    
    if (type === 'Medication') {
        if (!title.trim()) { newErrors.title = 'Medication name is required.'; isValid = false; }
        if (!dosage.trim()) { newErrors.dosage = 'Dosage is required.'; isValid = false; }
        if (!frequency.trim()) { newErrors.frequency = 'Frequency is required.'; isValid = false; }
        if (!startDate) { newErrors.startDate = 'Start date is required.'; isValid = false; }
    } else {
        if (!title.trim()) { newErrors.title = 'Title is required.'; isValid = false; }
        if (!details.trim()) { newErrors.details = 'Details are required.'; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      let finalDetails = details;
      if (type === 'Medication') {
          const parts = [];
          if (dosage) parts.push(`Dosage: ${dosage}`);
          if (frequency) parts.push(`Frequency: ${frequency}`);
          if (startDate) parts.push(`Start Date: ${startDate}`);
          if (endDate) parts.push(`End Date: ${endDate}`);
          if (details) parts.push(`Notes: ${details}`);
          finalDetails = parts.join('. ');
      }
      onSaveRecord({
        patientId: Number(patientId),
        type,
        date,
        title,
        details: finalDetails,
        author,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEditing = !!recordToEdit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit EMR Record' : 'Add New EMR Record'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
              <label htmlFor="emr-patient" className="block text-sm font-medium text-slate-700">Patient</label>
              <select
                id="emr-patient"
                value={patientId}
                onChange={(e) => setPatientId(Number(e.target.value))}
                disabled={isEditing}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.patientId ? 'border-red-500' : 'border-slate-300'} ${isEditing ? 'bg-slate-100' : ''}`}
              >
                <option value="" disabled>Select a patient</option>
                {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.patientId && <p className="text-sm text-red-600 mt-1">{errors.patientId}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emr-type" className="block text-sm font-medium text-slate-700">Record Type</label>
                <select
                  id="emr-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as EMRRecordType)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                >
                  {recordTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="emr-date" className="block text-sm font-medium text-slate-700">Date of Record</label>
                <input
                  type="date"
                  id="emr-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.date ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
              </div>
          </div>
          
          {/* Conditional Fields */}
          {type === 'Medication' ? (
            <div className="space-y-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
              <h3 className="font-semibold text-slate-700">Medication Details</h3>
               <div>
                  <label htmlFor="med-name" className="block text-sm font-medium text-slate-700">Medication Name</label>
                  <input type="text" id="med-name" value={title} onChange={(e) => setTitle(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.title ? 'border-red-500' : 'border-slate-300'}`} />
                  {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="med-dosage" className="block text-sm font-medium text-slate-700">Dosage</label>
                      <input type="text" id="med-dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g., 500mg"
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.dosage ? 'border-red-500' : 'border-slate-300'}`} />
                      {errors.dosage && <p className="text-sm text-red-600 mt-1">{errors.dosage}</p>}
                  </div>
                  <div>
                      <label htmlFor="med-frequency" className="block text-sm font-medium text-slate-700">Frequency</label>
                      <input type="text" id="med-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="e.g., Twice daily"
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.frequency ? 'border-red-500' : 'border-slate-300'}`} />
                      {errors.frequency && <p className="text-sm text-red-600 mt-1">{errors.frequency}</p>}
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="med-start-date" className="block text-sm font-medium text-slate-700">Start Date</label>
                      <input type="date" id="med-start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.startDate ? 'border-red-500' : 'border-slate-300'}`} />
                      {errors.startDate && <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                      <label htmlFor="med-end-date" className="block text-sm font-medium text-slate-700">End Date (Optional)</label>
                      <input type="date" id="med-end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
                  </div>
              </div>
              <div>
                  <label htmlFor="med-notes" className="block text-sm font-medium text-slate-700">Notes</label>
                  <textarea id="med-notes" rows={2} value={details} onChange={(e) => setDetails(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></textarea>
              </div>
            </div>
          ) : (
             <>
              <div>
                <label htmlFor="emr-title" className="block text-sm font-medium text-slate-700">Title / Subject</label>
                <input
                  type="text"
                  id="emr-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label htmlFor="emr-details" className="block text-sm font-medium text-slate-700">Details</label>
                <textarea
                  id="emr-details"
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.details ? 'border-red-500' : 'border-slate-300'}`}
                ></textarea>
                {errors.details && <p className="text-sm text-red-600 mt-1">{errors.details}</p>}
              </div>
            </>
          )}

          <div>
            <label htmlFor="emr-author" className="block text-sm font-medium text-slate-700">Author</label>
            <input
              type="text"
              id="emr-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.author ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.author && <p className="text-sm text-red-600 mt-1">{errors.author}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Cancel</button>
            <button type="submit" className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700">{isEditing ? 'Save Changes' : 'Add Record'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEMRRecordModal;