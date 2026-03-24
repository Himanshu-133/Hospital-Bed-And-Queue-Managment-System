// AIIMS Hospital Dataset - Based on Indian healthcare patterns
// Data reflects typical AIIMS (All India Institute of Medical Sciences) operations

import { Patient, Doctor, Department, Machine, Ambulance, PatientHistory } from './types';

// Seeded random function for deterministic data generation (no hydration mismatch)
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// AIIMS Departments (based on major AIIMS centers)
export const aiimsDepartments = [
  { id: 'dept1', name: 'General Medicine', activeQueues: 12, totalPatients: 145 },
  { id: 'dept2', name: 'Surgery', activeQueues: 8, totalPatients: 92 },
  { id: 'dept3', name: 'Cardiology', activeQueues: 6, totalPatients: 58 },
  { id: 'dept4', name: 'Neurology', activeQueues: 5, totalPatients: 43 },
  { id: 'dept5', name: 'Orthopedics', activeQueues: 7, totalPatients: 67 },
  { id: 'dept6', name: 'Gynecology & Obstetrics', activeQueues: 9, totalPatients: 78 },
  { id: 'dept7', name: 'Pediatrics', activeQueues: 8, totalPatients: 89 },
  { id: 'dept8', name: 'Ophthalmology', activeQueues: 7, totalPatients: 76 },
  { id: 'dept9', name: 'ENT', activeQueues: 6, totalPatients: 54 },
  { id: 'dept10', name: 'Dentistry', activeQueues: 5, totalPatients: 41 },
];

// Common Indian patient names and patterns
const indianFirstNames = [
  'Rajesh', 'Priya', 'Arjun', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Divya',
  'Amit', 'Neha', 'Suresh', 'Pooja', 'Arun', 'Isha', 'Karan', 'Zara',
  'Mahesh', 'Ananya', 'Nikhil', 'Ravi', 'Shruti', 'Varun', 'Aditi', 'Sanjay',
  'Meera', 'Deepak', 'Ritika', 'Manish', 'Kavya', 'Harish', 'Nisha', 'Akshay',
  'Shalini', 'Gaurav', 'Anjul', 'Prakash', 'Sonali', 'Ashok', 'Navya',
];

const indianLastNames = [
  'Sharma', 'Singh', 'Patel', 'Gupta', 'Khan', 'Kumar', 'Reddy', 'Verma',
  'Rao', 'Bhat', 'Desai', 'Iyer', 'Nair', 'Menon', 'Yadav', 'Tiwari',
  'Dwivedi', 'Mishra', 'Tripathi', 'Joshi', 'Srivastava', 'Pandey',
];

const commonIndianDiseases = [
  'Type 2 Diabetes', 'Hypertension', 'Asthma', 'COPD', 'Tuberculosis',
  'Dengue Fever', 'Malaria', 'Typhoid', 'Respiratory Infection',
  'Urinary Tract Infection', 'Gastroenteritis', 'Migraine', 'Arthritis',
  'Anemia', 'Thyroid Disorder', 'Kidney Stones', 'Viral Fever',
  'Heart Disease', 'Stroke', 'Cancer (Various)', 'Jaundice',
];

const procedures = [
  'Blood Test', 'CT Scan', 'MRI Scan', 'X-Ray', 'Ultrasound',
  'EKG', 'Endoscopy', 'Colonoscopy', 'Biopsy', 'ECG',
  'Physical Examination', 'Blood Pressure Monitoring', 'Medication Consultation',
  'Wound Dressing', 'Lab Analysis', 'Vision Test', 'Hearing Test',
];

// Generate realistic Indian patient names
function generatePatientName(seed: number): string {
  const firstName = indianFirstNames[Math.floor(seededRandom(seed) * indianFirstNames.length)];
  const lastName = indianLastNames[Math.floor(seededRandom(seed + 1000) * indianLastNames.length)];
  return `${firstName} ${lastName}`;
}

// Generate AIIMS-scaled patient data
export const aiimsPatientsData: Patient[] = Array.from({ length: 250 }, (_, i) => {
  const seed = i * 1000;
  const departments = aiimsDepartments;
  const deptIndex = Math.floor(seededRandom(seed) * departments.length);
  const dept = departments[deptIndex];
  const now = new Date();
  const arrivalTime = new Date(now.getTime() - seededRandom(seed + 100) * 6 * 60 * 60 * 1000); // Last 6 hours

  const statuses: Array<'waiting' | 'in-progress' | 'completed' | 'discharged'> = ['waiting', 'in-progress', 'completed'];
  const randomStatus = statuses[Math.floor(seededRandom(seed + 200) * statuses.length)];

  return {
    id: `p${1000 + i}`,
    name: generatePatientName(seed),
    age: Math.floor(seededRandom(seed + 300) * 70 + 5),
    phone: `+91${Math.floor(seededRandom(seed + 400) * 9000000000 + 1000000000)}`,
    token: `T${String(i + 1).padStart(4, '0')}`,
    status: randomStatus,
    timestamp: arrivalTime.toISOString(),
    estimatedWait: Math.floor(seededRandom(seed + 500) * 120 + 15),
    department: dept.name,
    dischargeTime: randomStatus === 'completed' ? new Date().toISOString() : undefined,
  };
});

// AIIMS Doctors - realistic specializations
export const aiimsDoctorsData: Doctor[] = [
  // General Medicine (12 doctors)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `doc-gm-${i + 1}`,
    name: generatePatientName(10000 + i),
    specialization: 'General Medicine',
    department: 'General Medicine',
    status: seededRandom(20000 + i) > 0.4 ? 'available' : 'busy',
    currentPatient: seededRandom(30000 + i) > 0.4 ? `p${1000 + Math.floor(seededRandom(40000 + i) * 250)}` : undefined,
    roomNumber: `A${String(i + 1).padStart(3, '0')}`,
  })),
  // Surgery (8 doctors)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `doc-surg-${i + 1}`,
    name: generatePatientName(50000 + i),
    specialization: 'Surgery',
    department: 'Surgery',
    status: seededRandom(60000 + i) > 0.5 ? 'available' : 'busy',
    currentPatient: seededRandom(70000 + i) > 0.5 ? `p${1000 + Math.floor(seededRandom(80000 + i) * 250)}` : undefined,
    roomNumber: `B${String(i + 1).padStart(3, '0')}`,
  })),
  // Cardiology (6 doctors)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `doc-card-${i + 1}`,
    name: generatePatientName(90000 + i),
    specialization: 'Cardiology',
    department: 'Cardiology',
    status: seededRandom(100000 + i) > 0.3 ? 'available' : 'busy',
    currentPatient: seededRandom(110000 + i) > 0.3 ? `p${1000 + Math.floor(seededRandom(120000 + i) * 250)}` : undefined,
    roomNumber: `C${String(i + 1).padStart(3, '0')}`,
  })),
  // Neurology (5 doctors)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `doc-neuro-${i + 1}`,
    name: generatePatientName(130000 + i),
    specialization: 'Neurology',
    department: 'Neurology',
    status: seededRandom(140000 + i) > 0.4 ? 'available' : 'busy',
    currentPatient: seededRandom(150000 + i) > 0.4 ? `p${1000 + Math.floor(seededRandom(160000 + i) * 250)}` : undefined,
    roomNumber: `D${String(i + 1).padStart(3, '0')}`,
  })),
  // Orthopedics (7 doctors)
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `doc-ortho-${i + 1}`,
    name: generatePatientName(170000 + i),
    specialization: 'Orthopedics',
    department: 'Orthopedics',
    status: seededRandom(180000 + i) > 0.35 ? 'available' : 'busy',
    currentPatient: seededRandom(190000 + i) > 0.35 ? `p${1000 + Math.floor(seededRandom(200000 + i) * 250)}` : undefined,
    roomNumber: `E${String(i + 1).padStart(3, '0')}`,
  })),
];

// AIIMS Medical Machines - typical equipment
export const aiimsMachinesData: Machine[] = [
  // CT Scanners (4 units typical for large AIIMS)
  { id: 'm1', name: 'CT Scanner - Block A', type: 'CT', status: 'in-use', currentPatient: 'p1050', location: 'Floor 3 - Radiology', utilizationRate: 0.87 },
  { id: 'm2', name: 'CT Scanner - Block B', type: 'CT', status: 'available', location: 'Floor 3 - Radiology', utilizationRate: 0.45 },
  { id: 'm3', name: 'CT Scanner - Block C', type: 'CT', status: 'in-use', currentPatient: 'p1045', location: 'Floor 3 - Radiology', utilizationRate: 0.92 },
  { id: 'm4', name: 'CT Scanner - Emergency', type: 'CT', status: 'available', location: 'Floor 1 - Emergency', utilizationRate: 0.65 },
  // MRI Units (3 units)
  { id: 'm5', name: 'MRI Unit 1', type: 'MRI', status: 'in-use', currentPatient: 'p1040', location: 'Floor 2 - Radiology', utilizationRate: 0.95 },
  { id: 'm6', name: 'MRI Unit 2', type: 'MRI', status: 'maintenance', location: 'Floor 2 - Radiology', utilizationRate: 0 },
  { id: 'm7', name: 'MRI Unit 3', type: 'MRI', status: 'available', location: 'Floor 2 - Radiology', utilizationRate: 0.55 },
  // Ultrasound Machines (6 units)
  { id: 'm8', name: 'Ultrasound - OB/GYN 1', type: 'Ultrasound', status: 'in-use', currentPatient: 'p1055', location: 'Floor 4 - Gynecology', utilizationRate: 0.88 },
  { id: 'm9', name: 'Ultrasound - OB/GYN 2', type: 'Ultrasound', status: 'available', location: 'Floor 4 - Gynecology', utilizationRate: 0.62 },
  { id: 'm10', name: 'Ultrasound - General 1', type: 'Ultrasound', status: 'available', location: 'Floor 3 - General', utilizationRate: 0.71 },
  { id: 'm11', name: 'Ultrasound - General 2', type: 'Ultrasound', status: 'in-use', currentPatient: 'p1048', location: 'Floor 3 - General', utilizationRate: 0.78 },
  // X-Ray Machines (5 units)
  { id: 'm12', name: 'X-Ray Machine 1', type: 'XRay', status: 'available', location: 'Floor 1 - Emergency', utilizationRate: 0.85 },
  { id: 'm13', name: 'X-Ray Machine 2', type: 'XRay', status: 'available', location: 'Floor 2 - General', utilizationRate: 0.72 },
  { id: 'm14', name: 'X-Ray Machine 3', type: 'XRay', status: 'in-use', currentPatient: 'p1052', location: 'Floor 5 - Orthopedics', utilizationRate: 0.90 },
  { id: 'm15', name: 'X-Ray Machine 4', type: 'XRay', status: 'available', location: 'Floor 1 - Pediatrics', utilizationRate: 0.55 },
  // Cardiac Equipment
  { id: 'm16', name: 'ECG Machine 1', type: 'EKG', status: 'available', location: 'Floor 5 - Cardiology', utilizationRate: 0.68 },
  { id: 'm17', name: 'ECG Machine 2', type: 'EKG', status: 'available', location: 'Floor 5 - Cardiology', utilizationRate: 0.54 },
  { id: 'm18', name: 'Echocardiography Unit', type: 'Ultrasound', status: 'in-use', currentPatient: 'p1060', location: 'Floor 5 - Cardiology', utilizationRate: 0.82 },
  // Lab Equipment
  { id: 'm19', name: 'Blood Analyzer 1', type: 'Lab', status: 'in-use', currentPatient: 'p1035', location: 'Floor B1 - Lab', utilizationRate: 0.91 },
  { id: 'm20', name: 'Blood Analyzer 2', type: 'Lab', status: 'available', location: 'Floor B1 - Lab', utilizationRate: 0.67 },
  { id: 'm21', name: 'Chemistry Analyzer', type: 'Lab', status: 'available', location: 'Floor B1 - Lab', utilizationRate: 0.58 },
];

// AIIMS Ambulance Fleet
export const aimsAmbulancesData: Ambulance[] = [
  // Main campus ambulances
  { id: 'a1', vehicleNumber: 'AIIMS-AMB-001', driver: 'Rajesh Kumar', status: 'in-transit', location: { lat: 28.5761, lng: 77.2080 }, responseTime: 8, currentPatient: 'ext-1' },
  { id: 'a2', vehicleNumber: 'AIIMS-AMB-002', driver: 'Priya Singh', status: 'available', location: { lat: 28.5761, lng: 77.2080 }, responseTime: 0 },
  { id: 'a3', vehicleNumber: 'AIIMS-AMB-003', driver: 'Arjun Verma', status: 'at-hospital', location: { lat: 28.5761, lng: 77.2080 }, responseTime: 5 },
  { id: 'a4', vehicleNumber: 'AIIMS-AMB-004', driver: 'Sneha Patel', status: 'available', location: { lat: 28.5761, lng: 77.2080 }, responseTime: 0 },
  { id: 'a5', vehicleNumber: 'AIIMS-AMB-005', driver: 'Vikram Reddy', status: 'in-transit', location: { lat: 28.5750, lng: 77.2100 }, responseTime: 12, currentPatient: 'ext-2' },
  { id: 'a6', vehicleNumber: 'AIIMS-AMB-006', driver: 'Anjali Sharma', status: 'maintenance', location: { lat: 28.5761, lng: 77.2080 }, responseTime: 0 },
  { id: 'a7', vehicleNumber: 'AIIMS-AMB-007', driver: 'Rohan Gupta', status: 'available', location: { lat: 28.5761, lng: 77.2080 }, responseTime: 0 },
  { id: 'a8', vehicleNumber: 'AIIMS-AMB-008', driver: 'Divya Singh', status: 'in-transit', location: { lat: 28.5740, lng: 77.2060 }, responseTime: 15, currentPatient: 'ext-3' },
];

// AIIMS Patient History - realistic LOS and outcomes
export const aimsPatientHistoryData: PatientHistory[] = [
  // Recent discharges
  { id: 'hist1', patientId: 'p1', patientName: 'Rajesh Sharma', admissionTime: '2024-03-14T06:30:00', estimatedDischargeTime: '2024-03-16T14:00:00', department: 'Cardiology', diagnosis: 'Acute Coronary Syndrome', procedures: ['ECG', 'Troponin Test', 'Angiography'], machinesUsed: ['m16', 'm19'], status: 'discharged', dischargeTime: '2024-03-16T13:45:00' },
  { id: 'hist2', patientId: 'p2', patientName: 'Priya Gupta', admissionTime: '2024-03-15T09:15:00', estimatedDischargeTime: '2024-03-15T18:00:00', department: 'General Medicine', diagnosis: 'Type 2 Diabetes Mellitus', procedures: ['Blood Test', 'Glucose Monitoring', 'Consultation'], machinesUsed: ['m19'], status: 'discharged', dischargeTime: '2024-03-15T17:30:00' },
  { id: 'hist3', patientId: 'p3', patientName: 'Arjun Singh', admissionTime: '2024-03-13T14:00:00', estimatedDischargeTime: '2024-03-17T12:00:00', department: 'Orthopedics', diagnosis: 'Fracture - Femur', procedures: ['X-Ray', 'CT Scan', 'Surgery', 'Physical Therapy'], machinesUsed: ['m12', 'm3'], status: 'recovering' },
  { id: 'hist4', patientId: 'p4', patientName: 'Sneha Yadav', admissionTime: '2024-03-16T08:00:00', estimatedDischargeTime: '2024-03-18T16:00:00', department: 'Gynecology & Obstetrics', diagnosis: 'Normal Delivery', procedures: ['Ultrasound', 'Fetal Monitoring', 'Delivery'], machinesUsed: ['m8'], status: 'recovering' },
  { id: 'hist5', patientId: 'p5', patientName: 'Vikram Reddy', admissionTime: '2024-03-12T11:30:00', estimatedDischargeTime: '2024-03-18T10:00:00', department: 'General Medicine', diagnosis: 'Dengue Fever', procedures: ['Blood Test', 'Platelet Transfusion', 'Supportive Care'], machinesUsed: ['m19'], status: 'discharged', dischargeTime: '2024-03-18T09:45:00' },
  // Current admissions
  { id: 'hist6', patientId: 'p6', patientName: 'Anjali Patel', admissionTime: '2024-03-19T10:00:00', estimatedDischargeTime: '2024-03-21T14:00:00', department: 'Neurology', diagnosis: 'Acute Stroke', procedures: ['MRI Scan', 'CT Scan', 'Neurology Consultation', 'Rehabilitation'], machinesUsed: ['m5', 'm3'], status: 'recovering' },
  { id: 'hist7', patientId: 'p7', patientName: 'Rohan Sharma', admissionTime: '2024-03-19T15:30:00', estimatedDischargeTime: '2024-03-22T12:00:00', department: 'Surgery', diagnosis: 'Appendicitis', procedures: ['CT Scan', 'Blood Test', 'Appendectomy', 'Post-op Monitoring'], machinesUsed: ['m3', 'm19'], status: 'recovering' },
];

// Indian healthcare statistics for prediction
export const aimsHealthcareMetrics = {
  averageWaitTime: 45, // minutes in Indian hospitals
  averageLOS: 3.5, // Average Length of Stay in days
  admissionRate: 0.3, // 30% of OPD visits lead to admission
  dischargeRate: 0.28, // 28% of admitted patients discharged daily
  peakHours: [9, 10, 14, 15], // Peak consultation hours
  weekdayPatientMultiplier: 1.2, // 20% more patients on weekdays
  weekendPatientMultiplier: 0.7, // 30% fewer patients on weekends
  seasonalMultiplier: {
    monsoon: 1.8, // Higher during monsoon (dengue, malaria)
    summer: 1.5, // Higher during summer
    winter: 1.1, // Slightly higher in winter
    spring: 1.0, // Baseline
  },
};
