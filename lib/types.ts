export interface Patient {
  id: string;
  name: string;
  token: string;
  department: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'discharged';
  timestamp: string;
  estimatedWaitTime: number;
  admissionTime?: string;
  dischargeTime?: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  status: 'available' | 'busy';
  currentPatient?: string;
  averageConsultationTime: number;
}

export interface Department {
  id: string;
  name: string;
  doctors: number;
  averageWaitTime: number;
}

export interface Machine {
  id: string;
  name: string;
  type: 'CT' | 'MRI' | 'Ultrasound' | 'XRay' | 'EKG' | 'Lab';
  status: 'available' | 'in-use' | 'maintenance';
  currentPatient?: string;
  location: string;
  maintenanceSchedule?: string;
  utilizationRate: number;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driver: string;
  status: 'available' | 'in-transit' | 'at-hospital' | 'maintenance';
  location: { lat: number; lng: number };
  currentPatient?: string;
  responseTime: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface PatientHistory {
  id: string;
  patientId: string;
  patientName: string;
  admissionTime: string;
  estimatedDischargeTime: string;
  department: string;
  diagnosis: string;
  procedures: string[];
  machinesUsed: string[];
  dischargeTime?: string;
  status: 'admitted' | 'recovering' | 'discharged';
}

export interface QueuePrediction {
  timestamp: string;
  predictedQueue: number;
  confidence: number;
  peakTime?: string;
  algorithm: string;
}

export interface Message {
  id: string;
  patientId: string;
  message: string;
  timestamp: string;
  type: 'notification' | 'confirmation' | 'query';
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'bot' | 'staff';
  message: string;
  timestamp: string;
}
