import { Patient, Doctor, Department, Machine, Ambulance, Appointment, PatientHistory } from './types';
import {
  aiimsPatientsData,
  aiimsDoctorsData,
  aiimsDepartments,
  aiimsMachinesData,
  aimsAmbulancesData,
  aimsPatientHistoryData,
} from './aiims-data';

// Import AIIMS trained dataset
export const mockMachines: Machine[] = aiimsMachinesData;
export const mockAmbulances: Ambulance[] = aimsAmbulancesData;
export const mockPatientHistory: PatientHistory[] = aimsPatientHistoryData;

export const mockAppointments: Appointment[] = [
  { id: 'apt1', patientId: 'p1000', patientName: 'Rajesh Sharma', doctorId: 'doc-card-1', department: 'Cardiology', date: '2024-03-20', time: '10:00', status: 'scheduled' },
  { id: 'apt2', patientId: 'p1001', patientName: 'Priya Singh', doctorId: 'doc-gm-2', department: 'General Medicine', date: '2024-03-20', time: '14:30', status: 'scheduled' },
  { id: 'apt3', patientId: 'p1002', patientName: 'Arjun Verma', doctorId: 'doc-ortho-1', department: 'Orthopedics', date: '2024-03-21', time: '11:00', status: 'scheduled' },
  { id: 'apt4', patientId: 'p1003', patientName: 'Sneha Patel', doctorId: 'doc-neuro-2', department: 'Neurology', date: '2024-03-21', time: '15:00', status: 'scheduled' },
  { id: 'apt5', patientId: 'p1004', patientName: 'Vikram Reddy', doctorId: 'doc-surg-1', department: 'Surgery', date: '2024-03-22', time: '09:30', status: 'scheduled' },
];

export const mockPatients: Patient[] = aiimsPatientsData.slice(0, 50);

export const mockDoctors: Doctor[] = aiimsDoctorsData;

export const mockDepartments: Department[] = aiimsDepartments;

export const generatePatientToken = (dept: string, count: number): string => {
  const deptCode = dept.substring(0, 2).toUpperCase();
  return `${deptCode}-${String(count).padStart(3, '0')}`;
};

export const calculateWaitTime = (patients: Patient[], status: 'waiting' | 'in-progress' | 'completed' = 'in-progress'): number => {
  const avgConsultationTime = 15;
  const waitingCount = patients.filter(p => p.status === 'waiting').length;
  const consultingCount = patients.filter(p => p.status === 'in-progress').length;
  return (waitingCount * avgConsultationTime) + (consultingCount > 0 ? 5 : 0);
};
