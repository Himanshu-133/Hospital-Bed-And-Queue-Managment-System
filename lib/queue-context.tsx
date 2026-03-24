'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockPatients, mockDoctors, mockDepartments, mockMachines, mockAmbulances, mockAppointments, mockPatientHistory } from './mock-data';
import { Patient, Doctor, Department, Machine, Ambulance, Appointment, PatientHistory, QueuePrediction } from './types';
import { predictQueueLength } from './queue-prediction';

interface QueueContextType {
  patients: Patient[];
  doctors: Doctor[];
  departments: any[];
  machines: Machine[];
  ambulances: Ambulance[];
  appointments: Appointment[];
  patientHistory: PatientHistory[];
  queuePrediction: QueuePrediction | null;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  removePatient: (id: string) => void;
  callNextPatient: (doctorId: string) => void;
  completePatient: (patientId: string) => void;
  bookAppointment: (appointment: Appointment) => void;
  updateMachineStatus: (machineId: string, status: string) => void;
  updateAmbulanceLocation: (ambulanceId: string, lat: number, lng: number) => void;
  dischargePatient: (patientId: string) => void;
  confirmAppointment: (appointmentId: string, patientId: string, doctorId: string) => void;
  updateDoctor: (doctorId: string, updates: Partial<Doctor>) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [departments] = useState<any[]>(mockDepartments);
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(mockAmbulances);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [patientHistory, setPatientHistory] = useState<PatientHistory[]>(mockPatientHistory);

  const queuePrediction = React.useMemo(() => {
    return predictQueueLength(patients, patientHistory);
  }, [patients, patientHistory]);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const removePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const callNextPatient = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const nextPatient = patients.find(p => p.status === 'waiting' && p.department === doctor.department);
    if (nextPatient) {
      updatePatient(nextPatient.id, { status: 'in-progress' });
    }
  };

  const completePatient = (patientId: string) => {
    updatePatient(patientId, { status: 'completed' });
    setTimeout(() => removePatient(patientId), 2000);
  };

  const bookAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateMachineStatus = (machineId: string, status: string) => {
    setMachines(prev =>
      prev.map(m => m.id === machineId ? { ...m, status: status as any } : m)
    );
  };

  const updateAmbulanceLocation = (ambulanceId: string, lat: number, lng: number) => {
    setAmbulances(prev =>
      prev.map(a => a.id === ambulanceId ? { ...a, location: { lat, lng } } : a)
    );
  };

  const dischargePatient = (patientId: string) => {
    updatePatient(patientId, { status: 'discharged', dischargeTime: new Date().toISOString() });
  };

  const confirmAppointment = (appointmentId: string, patientId: string, doctorId: string) => {
    // Update appointment status to confirmed
    setAppointments(prev =>
      prev.map(apt => apt.id === appointmentId ? { ...apt, status: 'confirmed' as any } : apt)
    );

    // Add patient to queue if not already there
    const existingPatient = patients.find(p => p.id === patientId);
    if (!existingPatient) {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        addPatient({
          id: patientId,
          name: appointment.patientName,
          age: 35,
          phone: '9876543210',
          token: `APT-${appointmentId}`,
          status: 'waiting',
          timestamp: new Date().toISOString(),
          estimatedWait: 10,
          department: appointment.department,
        });
      }
    } else {
      updatePatient(patientId, { status: 'waiting' });
    }
  };

  const updateDoctor = (doctorId: string, updates: Partial<Doctor>) => {
    setDoctors(prev =>
      prev.map(d => d.id === doctorId ? { ...d, ...updates } : d)
    );
  };

  return (
    <QueueContext.Provider value={{
      patients,
      doctors,
      departments,
      machines,
      ambulances,
      appointments,
      patientHistory,
      queuePrediction,
      addPatient,
      updatePatient,
      removePatient,
      callNextPatient,
      completePatient,
      bookAppointment,
      updateMachineStatus,
      updateAmbulanceLocation,
      dischargePatient,
      confirmAppointment,
      updateDoctor,
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
}
