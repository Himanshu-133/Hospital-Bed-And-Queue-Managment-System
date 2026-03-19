'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQueue } from '@/lib/queue-context';
import { useState, useEffect } from 'react';
import { User, Clock, CheckCircle2, ChevronRight, Phone, Mail, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const DOCTOR_ID = 'doc-card-1'; // Simulated current doctor (Cardiology)

export default function DoctorDashboard() {
  const { patients, doctors, callNextPatient, completePatient, updateDoctor } = useQueue();
  const [currentDoctor, setCurrentDoctor] = useState<typeof doctors[0] | undefined>(undefined);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);

  useEffect(() => {
    const doctor = doctors.find(d => d.id === DOCTOR_ID);
    setCurrentDoctor(doctor);
  }, [doctors]);

  useEffect(() => {
    if (currentDoctor?.currentPatient) {
      const currentPatient = patients.find(p => p.id === currentDoctor.currentPatient);
      if (currentPatient) {
        setArrivalTime(new Date(currentPatient.timestamp).toLocaleTimeString());
      }
    }
  }, [currentDoctor?.currentPatient, patients]);

  const departmentPatients = patients.filter(p => p.department === currentDoctor?.department);
  const currentPatientId = currentDoctor?.currentPatient;
  const currentPatient = patients.find(p => p.id === currentPatientId);
  const nextPatient = departmentPatients.find(p => p.status === 'waiting');
  const allWaiting = departmentPatients.filter(p => p.status === 'waiting');

  const handleNext = () => {
    if (currentPatient) {
      completePatient(currentPatient.id);
      updateDoctor(DOCTOR_ID, { currentPatient: undefined, status: 'available' });
    }
    callNextPatient(DOCTOR_ID);
    if (nextPatient) {
      updateDoctor(DOCTOR_ID, { currentPatient: nextPatient.id, status: 'busy' });
    }
  };

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Dashboard</h1>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {currentDoctor?.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-foreground">{currentDoctor?.name}</p>
            <p className="text-sm text-muted-foreground">{currentDoctor?.specialization} • Room {currentDoctor?.roomNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Current Patient Card */}
        <div className="lg:col-span-2 space-y-6">
          {currentPatient ? (
            <Card className="border-primary bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
              <div className="mb-6 flex items-start justify-between">
                <Badge className="bg-primary text-primary-foreground">Currently Consulting</Badge>
                <Clock className="h-5 w-5 text-primary" />
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {currentPatient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground">{currentPatient.name}</h3>
                    <p className="text-primary font-mono font-semibold">Token: {currentPatient.token}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-white/50 dark:bg-white/5 p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Age</p>
                    <p className="text-lg font-semibold text-foreground">{currentPatient.age} years</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Phone</p>
                    <p className="text-lg font-semibold text-foreground">{currentPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Arrival Time</p>
                    <p className="text-lg font-semibold text-foreground">
                      {arrivalTime || '--:--:-- --'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Waited</p>
                    <p className="text-lg font-semibold text-foreground">15 min</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleNext} size="lg" className="flex-1 gap-2 bg-primary hover:bg-primary/90 h-12">
                  Complete & Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="flex-1 h-12">
                  Add Notes
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-dashed border-border p-12 text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Active Patient</h3>
              <p className="text-muted-foreground mb-6">Call the next patient to begin consultation</p>
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                Call Next Patient
              </Button>
            </Card>
          )}

          {/* Queue Preview */}
          <Card className="border-border p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">Waiting Queue</h3>
              <Badge className="bg-primary/20 text-primary">{allWaiting.length} waiting</Badge>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allWaiting.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No patients waiting</p>
              ) : (
                allWaiting.slice(0, 8).map((patient, idx) => (
                  <div key={patient.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    idx === 0
                      ? 'bg-primary/15 border border-primary/30 scale-105'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm ${
                      idx === 0
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.token}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs">{patient.estimatedWait}m</Badge>
                      {idx === 0 && (
                        <span className="text-xs font-semibold text-primary animate-pulse">Next</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Queue Status */}
          <Card className="border-border p-6 bg-card">
            <h3 className="mb-4 font-semibold text-card-foreground">Queue Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Waiting</span>
                <span className="font-bold text-lg text-primary">{allWaiting.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">In Consultation</span>
                <span className="font-bold text-lg text-secondary">
                  {departmentPatients.filter(p => p.status === 'in-consultation').length}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-lg">{departmentPatients.length}</span>
              </div>
            </div>
          </Card>

          {/* Next Patient Info */}
          {nextPatient && (
            <Card className="border-secondary/50 bg-secondary/5 p-6 border">
              <h3 className="mb-3 font-semibold text-card-foreground">Next Patient</h3>
              <div className="space-y-2">
                <Avatar className="h-12 w-12 border-2 border-secondary">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {nextPatient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-card-foreground">{nextPatient.name}</p>
                  <p className="text-sm text-muted-foreground">{nextPatient.age} years</p>
                </div>
                <p className="text-lg font-semibold text-secondary">{nextPatient.token}</p>
              </div>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="border-border p-6 bg-card">
            <h3 className="mb-4 font-semibold text-card-foreground">Today</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patients Seen</span>
                <span className="font-semibold text-foreground">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Time</span>
                <span className="font-semibold text-foreground">12 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Time</span>
                <span className="font-semibold text-foreground">2h 24m</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
