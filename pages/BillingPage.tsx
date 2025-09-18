import React, { useState, useMemo, useEffect } from 'react';
import { StripeIcon } from '../components/icons/StripeIcon';
import { RazorpayIcon } from '../components/icons/RazorpayIcon';
import { mockPatients, mockDoctors, mockAppointments, mockInvoices } from '../data/mockData';
import type { Appointment, Patient, Doctor, Invoice, InvoiceStatus, InvoiceFormData } from '../types';
import AppointmentDetailModal from '../components/AppointmentDetailModal';
import AddInvoiceModal from '../components/AddInvoiceModal';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { useAuth } from '../hooks/useAuth';


const getStatusColor = (status: Invoice['status']) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-amber-100 text-amber-800';
    case 'Overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const GatewayCard: React.FC<{
  icon: React.ReactNode;
  name: string;
  description: string;
  isConnected: boolean;
  onToggle: () => void;
}> = ({ icon, name, description, isConnected, onToggle }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
        <div className="flex items-center gap-4">
            {icon}
            <div>
                <h3 className="font-semibold text-slate-800">{name}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm font-medium">Status</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {isConnected ? 'Connected' : 'Not Connected'}
                </span>
            </div>
            <button
                onClick={onToggle}
                className={`font-semibold py-2 px-4 rounded-md transition-colors ${
                    isConnected
                        ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        : 'bg-cyan-600 text-white hover:bg-cyan-700'
                }`}
            >
                {isConnected ? 'Manage' : 'Connect'}
            </button>
        </div>
    </div>
);

export const BillingPage: React.FC = () => {
    const { hasRole } = useAuth();
    const canManageBilling = hasRole(['admin', 'receptionist']);

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [stripeConnected, setStripeConnected] = useState(true);
    const [razorpayConnected, setRazorpayConnected] = useState(false);
    
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
    
    const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<{
        appointment: Appointment | null;
        patient: Patient | null;
        doctor: Doctor | null;
    }>({ appointment: null, patient: null, doctor: null });

    useEffect(() => {
        setInvoices(mockInvoices);
    }, []);
    
    const appointmentMap = useMemo(() => new Map(mockAppointments.map(a => [a.id, a])), []);
    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const doctorMap = useMemo(() => new Map(mockDoctors.map(d => [d.id, d])), []);

    const handleOpenAppointmentModal = (appointmentId: number) => {
        const appointment = appointmentMap.get(appointmentId);
        if (appointment) {
            setSelectedAppointmentDetails({
                appointment,
                patient: patientMap.get(appointment.patientId) || null,
                doctor: doctorMap.get(appointment.doctorId) || null,
            });
            setIsDetailModalOpen(true);
        }
    };

    const handleUpdateStatus = (invoiceId: string, newStatus: InvoiceStatus) => {
        setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));
    };

    const handleSaveInvoice = (formData: InvoiceFormData) => {
        const newInvoice: Invoice = {
            id: `INV-${String(invoices.length + 10).padStart(3, '0')}`,
            ...formData,
            status: 'Pending',
        };
        setInvoices([newInvoice, ...invoices]);
        setIsAddInvoiceModalOpen(false);
    };
    
    const handleCloseModal = () => setIsDetailModalOpen(false);

    return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Billing & Payments</h1>
        <p className="text-slate-500 mt-1">Manage invoices, payments, and financial records.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Payment Gateway Integrations</h2>
        <div className="space-y-4">
            <GatewayCard 
                icon={<StripeIcon className="w-16 h-auto text-indigo-600" />}
                name="Stripe"
                description="Global online payment processing for businesses."
                isConnected={stripeConnected}
                onToggle={() => setStripeConnected(!stripeConnected)}
            />
            <GatewayCard 
                icon={<RazorpayIcon className="w-16 h-auto text-blue-500" />}
                name="Razorpay"
                description="Payments solution in India for online businesses."
                isConnected={razorpayConnected}
                onToggle={() => setRazorpayConnected(!razorpayConnected)}
            />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Invoices</h2>
            {canManageBilling && (
                <button
                    onClick={() => setIsAddInvoiceModalOpen(true)}
                    className="flex items-center gap-2 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create New Invoice
                </button>
            )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{patientMap.get(invoice.patientId)?.name || 'Unknown Patient'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                        {canManageBilling && invoice.status !== 'Paid' && (
                           <button onClick={() => handleUpdateStatus(invoice.id, 'Paid')} className="text-green-600 hover:text-green-900">Mark as Paid</button>
                        )}
                         {canManageBilling && invoice.status === 'Paid' && (
                           <button onClick={() => handleUpdateStatus(invoice.id, 'Pending')} className="text-amber-600 hover:text-amber-900">Mark as Pending</button>
                        )}
                        {invoice.appointmentId && (
                            <button
                                onClick={() => handleOpenAppointmentModal(invoice.appointmentId!)}
                                className="text-slate-500 hover:text-slate-700 p-1"
                                title="View Associated Appointment"
                            >
                                <CalendarIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
       <AppointmentDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseModal}
            appointment={selectedAppointmentDetails.appointment}
            patient={selectedAppointmentDetails.patient}
            doctor={selectedAppointmentDetails.doctor}
        />

        {canManageBilling && (
            <AddInvoiceModal
                isOpen={isAddInvoiceModalOpen}
                onClose={() => setIsAddInvoiceModalOpen(false)}
                onSaveInvoice={handleSaveInvoice}
                patients={mockPatients}
            />
        )}
    </div>
  );
};
