'use client';

import { useQueue } from '@/lib/queue-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle, CheckCircle, Stethoscope, Activity } from 'lucide-react';
import { useState } from 'react';

export default function PatientHistoryPage() {
  const { patientHistory, dischargePatient } = useQueue();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    admitted: 'bg-blue-500/20 text-blue-400',
    recovering: 'bg-yellow-500/20 text-yellow-400',
    discharged: 'bg-green-500/20 text-green-400',
  };

  const admitted = patientHistory.filter(p => p.status === 'admitted').length;
  const recovering = patientHistory.filter(p => p.status === 'recovering').length;
  const discharged = patientHistory.filter(p => p.status === 'discharged').length;

  const calculateLOS = (admission: string, discharge?: string) => {
    const startDate = new Date(admission);
    const endDate = discharge ? new Date(discharge) : new Date();
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Patient History & Discharge Planning</h1>
          <p className="text-muted-foreground">Manage patient admissions, length of stay, and discharge</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Currently Admitted</p>
                <p className="text-3xl font-bold text-blue-400">{admitted}</p>
              </div>
              <Activity className="h-10 w-10 text-blue-500/30" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Recovering</p>
                <p className="text-3xl font-bold text-yellow-400">{recovering}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-yellow-500/30" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Discharged</p>
                <p className="text-3xl font-bold text-green-400">{discharged}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500/30" />
            </div>
          </Card>
        </div>

        {/* Patient History Records */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Patient Records</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {patientHistory.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id)}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                      selectedPatient === patient.id
                        ? 'bg-primary/20 border-primary/50'
                        : 'border-border/50 bg-card/30 hover:bg-card/50'
                    }`}
                  >
                    <p className="font-semibold text-foreground text-sm">{patient.patientName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{patient.department}</p>
                    <Badge className={`${statusColors[patient.status]} border-0 mt-2 text-xs`}>
                      {patient.status}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              {selectedPatient && (
                (() => {
                  const patient = patientHistory.find(p => p.id === selectedPatient);
                  if (!patient) return null;

                  const losHours = calculateLOS(patient.admissionTime, patient.dischargeTime);

                  return (
                    <Card className="p-8 border-border/50 bg-card/30 space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between pb-4 border-b border-border/50">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">{patient.patientName}</h3>
                          <p className="text-muted-foreground mt-1">{patient.department}</p>
                        </div>
                        <Badge className={`${statusColors[patient.status]} border-0`}>
                          {patient.status}
                        </Badge>
                      </div>

                      {/* Admission Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Admission Date
                          </p>
                          <p className="font-semibold text-foreground">
                            {new Date(patient.admissionTime).toLocaleDateString()} {new Date(patient.admissionTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Length of Stay
                          </p>
                          <p className="font-semibold text-foreground">{losHours} hours</p>
                        </div>
                      </div>

                      {/* Estimated Discharge */}
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-xs text-muted-foreground mb-2">Estimated Discharge</p>
                        <p className="font-semibold text-foreground mb-3">
                          {new Date(patient.estimatedDischargeTime).toLocaleDateString()} {new Date(patient.estimatedDischargeTime).toLocaleTimeString()}
                        </p>
                        {!patient.dischargeTime && patient.status !== 'discharged' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 rounded-lg">
                              Approve Discharge
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 border-border/50">
                              Extend Stay
                            </Button>
                          </div>
                        )}
                        {patient.dischargeTime && (
                          <div className="text-sm text-green-400 flex items-center gap-1 mt-3">
                            <CheckCircle className="h-4 w-4" />
                            Discharged on {new Date(patient.dischargeTime).toLocaleTimeString()}
                          </div>
                        )}
                      </div>

                      {/* Diagnosis & Procedures */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-primary" />
                            Diagnosis
                          </p>
                          <p className="text-muted-foreground">{patient.diagnosis}</p>
                        </div>

                        {patient.procedures.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-2">Procedures</p>
                            <div className="flex flex-wrap gap-2">
                              {patient.procedures.map((proc, i) => (
                                <Badge key={i} variant="outline" className="border-border/50">
                                  {proc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {patient.machinesUsed.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-2">Equipment Used</p>
                            <div className="flex flex-wrap gap-2">
                              {patient.machinesUsed.map((machine, i) => (
                                <Badge key={i} variant="outline" className="border-primary/30 bg-primary/10">
                                  {machine}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })()
              )}

              {!selectedPatient && (
                <Card className="p-12 border-border/50 bg-card/30 text-center">
                  <p className="text-muted-foreground">Select a patient to view details</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
