import React from 'react';

export type PatientStatus = 'Stable' | 'Recovering' | 'Critical';
export type Gender = 'Male' | 'Female';

export interface Patient {
  id: number;
  userId?: string;
  name: string;
  age: number;
  gender: Gender;
  contactPhone: string;
  lastVisit: string;
  status: PatientStatus;
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
}

export type PatientFormData = Omit<Patient, 'id' | 'lastVisit' | 'status' | 'userId'>;

export interface Doctor {
  id: number;
  userId?: string;
  name: string;
  specialty: string;
  contactPhone: string;
  email: string;
}

export type DoctorFormData = Omit<Doctor, 'id' | 'userId'>;

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Cancelled';
export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  type: string;
  status: AppointmentStatus;
}

export type AppointmentFormData = Omit<Appointment, 'id' | 'status'>;

export type EMRRecordType = 'Progress Note' | 'Allergy' | 'Medication' | 'Lab Result' | 'Imaging Report';

export interface EMRRecord {
  id: number;
  patientId: number;
  appointmentId?: number;
  type: EMRRecordType;
  date: string;
  title: string;
  details: string;
  author: string;
}

export type PlanSubSectionType = 'text' | 'list' | 'table' | 'code' | 'component';

export interface PlanSubSection {
  subtitle: string;
  type: PlanSubSectionType;
  details: string | string[] | Record<string, string>[] | React.ReactNode;
}

export interface PlanSection {
  id: string;
  title: string;
  icon: React.ElementType; // Icon component
  content: PlanSubSection[];
}

// User role for auth
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  title: string;
  password?: string;
}

// Type for Sidebar navigation items
export interface NavLinkItem {
  name: string;
  href: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
}

// Billing types
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Invoice {
  id: string;
  patientId: number;
  date: string;
  amount: number;
  status: InvoiceStatus;
  appointmentId?: number;
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'status'>;
