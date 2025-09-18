import React, { useState, useMemo } from 'react';
import { StripeIcon } from '../components/icons/StripeIcon';
import { RazorpayIcon } from '../components/icons/RazorpayIcon';
import { mockPatients, mockDoctors, mockAppointments } from '../data/mockData';
import type { Appointment, Patient, Doctor } from '../types';
import AppointmentDetailModal from '../components/AppointmentDetailModal';
import { CalendarIcon } from '../components/icons/CalendarIcon';

interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  appointmentId?: number;
}

const mockInvoices: Invoice[] = [
  { id: 'INV-001', patientName: 'John Doe', date: '2023-10-15', amount: 250.00, status: 'Paid', appointmentId: 1 },
  { id: 'INV-002', patientName: 'Jane Smith', date: '2023-11-02', amount: 150.75, status: 'Paid', appointmentId: 2 },
  { id: 'INV-003', patientName: 'Robert Johnson', date: '2023-09-28', amount: 800.00, status: 'Overdue', appointmentId: 7 },
  { id: 'INV-004', patientName: 'Emily White', date: '2023-10-22', amount: 75.00, status: 'Pending' },
  { id: 'INV-005', patientName: 'Michael Brown', date: '2023-11-05', amount: 450.50, status: 'Paid', appointmentId: 4 },
  { id: 'INV-006', patientName: 'Jessica Davis', date: '2023-10-30', amount: 120.00, status: 'Pending' },
];

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
    const [stripeConnected, setStripeConnected] = useState(true);
    const [razorpayConnected, setRazorpayConnected] = useState(false);
    
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<{
        appointment: Appointment | null;
        patient: Patient | null;
        doctor: Doctor | null;
    }>({ appointment: null, patient: null, doctor: null });
    
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
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Invoices</h2>
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
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{invoice.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                        <button className="text-cyan-600 hover:text-cyan-900">
                          View
                        </button>
                        {invoice.appointmentId && (
                            <button
                                onClick={() => handleOpenAppointmentModal(invoice.appointmentId!)}
                                className="text-slate-500 hover:text-slate-700"
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
    </div>
  );
};