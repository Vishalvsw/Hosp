import React, { useState, useEffect } from 'react';
import type { InvoiceFormData, Patient } from '../types';
import { XIcon } from './icons/XIcon';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveInvoice: (invoice: InvoiceFormData) => void;
  patients: Patient[];
}

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({ isOpen, onClose, onSaveInvoice, patients }) => {
  const [patientId, setPatientId] = useState<number | ''>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  
  const [errors, setErrors] = useState({
    patientId: '',
    amount: '',
    date: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setPatientId('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setErrors({ patientId: '', amount: '', date: ''});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = { patientId: '', amount: '', date: ''};
    let isValid = true;
    
    if (!patientId) {
        newErrors.patientId = 'A patient must be selected.';
        isValid = false;
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = 'A valid positive amount is required.';
        isValid = false;
    }
    
    if (!date) {
        newErrors.date = 'Invoice date is required.';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveInvoice({
        patientId: Number(patientId),
        amount: parseFloat(amount),
        date,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Create New Invoice</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="invoice-patient" className="block text-sm font-medium text-slate-700">Patient</label>
            <select
              id="invoice-patient"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="invoice-amount" className="block text-sm font-medium text-slate-700">Amount ($)</label>
                <input
                    type="number"
                    id="invoice-amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 250.00"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.amount ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
            </div>
            <div>
                <label htmlFor="invoice-date" className="block text-sm font-medium text-slate-700">Invoice Date</label>
                <input
                    type="date"
                    id="invoice-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${errors.date ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
            </div>
          </div>
         
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Cancel</button>
            <button type="submit" className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700">Create Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
