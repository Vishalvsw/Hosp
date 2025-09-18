import type { Patient, Appointment, EMRRecord, Doctor } from '../types';

export const mockPatients: Patient[] = [
  { id: 1, name: 'John Doe', age: 45, gender: 'Male', contactPhone: '555-0101', lastVisit: '2023-10-15', status: 'Stable', insuranceProvider: 'Blue Cross', policyNumber: 'XJ559201', groupNumber: 'GRP-1001' },
  { id: 2, name: 'Jane Smith', age: 34, gender: 'Female', contactPhone: '555-0102', lastVisit: '2023-11-02', status: 'Recovering', insuranceProvider: 'Aetna', policyNumber: 'BC772945', groupNumber: 'GRP-2023' },
  { id: 3, name: 'Robert Johnson', age: 62, gender: 'Male', contactPhone: '555-0103', lastVisit: '2023-09-28', status: 'Critical' },
  { id: 4, name: 'Emily White', age: 28, gender: 'Female', contactPhone: '555-0104', lastVisit: '2023-10-22', status: 'Stable', insuranceProvider: 'United Healthcare', policyNumber: 'UH987654', groupNumber: 'GRP-UH05' },
  { id: 5, name: 'Michael Brown', age: 51, gender: 'Male', contactPhone: '555-0105', lastVisit: '2023-11-05', status: 'Recovering' },
  { id: 6, name: 'Jessica Davis', age: 39, gender: 'Female', contactPhone: '555-0106', lastVisit: '2023-10-30', status: 'Stable', insuranceProvider: 'Cigna', policyNumber: 'CG123456', groupNumber: 'GRP-CIGNA' },
  { id: 7, name: 'David Wilson', age: 70, gender: 'Male', contactPhone: '555-0107', lastVisit: '2023-08-12', status: 'Critical' },
  { id: 8, name: 'Sarah Miller', age: 25, gender: 'Female', contactPhone: '555-0108', lastVisit: '2023-11-08', status: 'Stable' },
  { id: 9, name: 'Chris Lee', age: 48, gender: 'Male', contactPhone: '555-0109', lastVisit: '2023-10-18', status: 'Recovering', insuranceProvider: 'Aetna', policyNumber: 'AE459988', groupNumber: 'GRP-2023' },
  { id: 10, name: 'Amanda Taylor', age: 31, gender: 'Female', contactPhone: '555-0110', lastVisit: '2023-11-01', status: 'Stable' },
];

export const mockDoctors: Doctor[] = [
    { id: 1, name: 'Dr. Carol Evans', specialty: 'Cardiologist', contactPhone: '555-0201', email: 'carol.evans@hms.pro' },
    { id: 2, name: 'Dr. Ben Carter', specialty: 'Neurologist', contactPhone: '555-0202', email: 'ben.carter@hms.pro' },
    { id: 3, name: 'Dr. Susan Ray', specialty: 'Radiologist', contactPhone: '555-0203', email: 'susan.ray@hms.pro' },
    { id: 4, name: 'Dr. Michael Lee', specialty: 'Pediatrician', contactPhone: '555-0204', email: 'michael.lee@hms.pro' },
    { id: 5, name: 'Dr. Olivia Chen', specialty: 'Dermatologist', contactPhone: '555-0205', email: 'olivia.chen@hms.pro' },
];

const getDayString = (offset: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
};

export const mockAppointments: Appointment[] = [
  { id: 1, patientId: 1, doctorId: 1, date: getDayString(0), time: '09:00 AM', type: 'Follow-up', status: 'Confirmed' },
  { id: 2, patientId: 2, doctorId: 1, date: getDayString(0), time: '09:30 AM', type: 'New Patient', status: 'Confirmed' },
  { id: 3, patientId: 4, doctorId: 1, date: getDayString(1), time: '10:00 AM', type: 'Consultation', status: 'Pending' },
  { id: 4, patientId: 5, doctorId: 2, date: getDayString(1), time: '10:30 AM', type: 'Follow-up', status: 'Confirmed' },
  { id: 5, patientId: 6, doctorId: 1, date: getDayString(2), time: '11:00 AM', type: 'Check-up', status: 'Cancelled' },
  { id: 6, patientId: 8, doctorId: 1, date: getDayString(2), time: '11:30 AM', type: 'New Patient', status: 'Confirmed' },
  { id: 7, patientId: 3, doctorId: 2, date: getDayString(-1), time: '02:00 PM', type: 'Emergency', status: 'Confirmed' },
  { id: 8, patientId: 7, doctorId: 1, date: getDayString(-2), time: '03:00 PM', type: 'Urgent Care', status: 'Confirmed' },
];

export const mockEMRData: EMRRecord[] = [
    { id: 1, patientId: 1, appointmentId: 1, type: 'Progress Note', date: '2023-10-15', title: 'Routine Check-up', details: 'Patient reports feeling well. Blood pressure is stable at 120/80. Continue current medication.', author: 'Dr. Carol Evans' },
    { id: 2, patientId: 1, type: 'Allergy', date: '2022-05-20', title: 'Penicillin', details: 'Patient experiences hives and shortness of breath.', author: 'Dr. Carol Evans' },
    { id: 3, patientId: 1, type: 'Medication', date: '2023-10-15', title: 'Lisinopril', details: 'Dosage: 10mg. Frequency: 1 tablet daily. Start Date: 2023-10-15. Notes: For hypertension.', author: 'Dr. Carol Evans' },
    { id: 4, patientId: 2, appointmentId: 2, type: 'Progress Note', date: '2023-11-02', title: 'Post-Op Follow-up', details: 'Surgical incision is healing well. No signs of infection. Patient can begin light physical therapy.', author: 'Dr. Ben Carter' },
    { id: 5, patientId: 3, appointmentId: 7, type: 'Imaging Report', date: '2023-09-28', title: 'Chest X-Ray', details: 'Findings consistent with pneumonia in the lower left lobe.', author: 'Dr. Susan Ray' },
    { id: 6, patientId: 3, type: 'Lab Result', date: '2023-09-28', title: 'CBC', details: 'White blood cell count is elevated, indicating infection.', author: 'LabCorp' },
    { id: 7, patientId: 2, type: 'Medication', date: '2023-11-02', title: 'Oxycodone', details: 'Dosage: 5mg. Frequency: Every 6 hours as needed. Start Date: 2023-11-02. End Date: 2023-11-09. Notes: For post-op pain.', author: 'Dr. Ben Carter' },
    { id: 8, patientId: 3, type: 'Medication', date: '2023-09-28', title: 'Amoxicillin', details: 'Dosage: 500mg. Frequency: Twice daily for 7 days. Start Date: 2023-09-28. End Date: 2023-10-05.', author: 'Dr. Carol Evans' },
    { id: 9, patientId: 4, type: 'Progress Note', date: '2023-10-22', title: 'Annual Physical', details: 'Patient is in good health. All vitals are normal. Recommended continuing healthy diet and exercise.', author: 'Dr. Carol Evans' },
    { id: 10, patientId: 4, type: 'Lab Result', date: '2023-10-22', title: 'Lipid Panel', details: 'Cholesterol levels are within the normal range.', author: 'LabCorp' },
    { id: 11, patientId: 5, type: 'Imaging Report', date: '2023-11-05', title: 'Head MRI', details: 'No abnormalities detected. Follow up regarding persistent headaches.', author: 'Dr. Susan Ray' },
    { id: 12, patientId: 5, appointmentId: 4, type: 'Progress Note', date: '2023-11-05', title: 'Neurology Consult', details: 'Patient complains of chronic migraines. MRI results are clear. Prescribing new medication to manage symptoms.', author: 'Dr. Ben Carter' },
    { id: 13, patientId: 6, type: 'Progress Note', date: '2023-10-30', title: 'Dermatology Visit', details: 'Examined skin rash. Appears to be a mild allergic reaction. Prescribed topical cream.', author: 'Dr. Ben Carter' },
    { id: 14, patientId: 6, type: 'Allergy', date: '2023-10-30', title: 'Latex', details: 'Patient reports mild skin irritation upon contact with latex gloves.', author: 'Dr. Ben Carter' },
    { id: 15, patientId: 7, appointmentId: 8, type: 'Progress Note', date: '2023-08-12', title: 'Emergency Admission', details: 'Patient admitted with severe chest pain. ECG shows signs of myocardial infarction. Admitted to CCU.', author: 'Dr. Carol Evans' },
    { id: 16, patientId: 7, type: 'Medication', date: '2023-08-12', title: 'Aspirin', details: 'Dosage: 325mg. Frequency: Administered once immediately. Start Date: 2023-08-12. Notes: Administered upon ER admission for suspected MI.', author: 'ER Nurse' },
    { id: 17, patientId: 8, type: 'Progress Note', date: '2023-11-08', title: 'Prenatal Check-up', details: '20-week check-up. Fetal heartbeat is strong. All measurements are normal.', author: 'Dr. Carol Evans' },
    { id: 18, patientId: 9, type: 'Progress Note', date: '2023-10-18', title: 'Orthopedic Follow-up', details: 'Knee injury is healing well. Continue with physical therapy exercises.', author: 'Dr. Ben Carter' },
    { id: 19, patientId: 9, type: 'Imaging Report', date: '2023-09-15', title: 'Knee X-Ray', details: 'Minor ligament sprain. No fractures detected.', author: 'Dr. Susan Ray' },
    { id: 20, patientId: 10, type: 'Progress Note', date: '2023-11-01', title: 'Flu Shot Administration', details: 'Patient received annual influenza vaccine. No adverse reactions noted.', author: 'Nurse Practitioner' },
    { id: 21, patientId: 1, type: 'Lab Result', date: '2023-10-15', title: 'A1C Level', details: 'A1C at 5.5%, indicating good blood sugar control.', author: 'LabCorp' },
    { id: 22, patientId: 8, type: 'Imaging Report', date: '2023-11-08', title: 'Ultrasound', details: 'Anatomy scan is normal. All expected structures are visible and appropriately sized for gestational age.', author: 'Dr. Susan Ray' }
];