'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { Patient } from '@/lib/types';

interface PatientMessagingProps {
  patients: Patient[];
}

export function PatientMessaging({ patients }: PatientMessagingProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [sentMessages, setSentMessages] = useState<Record<string, boolean>>({});

  const handleSendConfirmation = (patientId: string) => {
    setSentMessages(prev => ({ ...prev, [patientId]: true }));
    setTimeout(() => {
      setSentMessages(prev => ({ ...prev, [patientId]: false }));
    }, 3000);
  };

  const waitingPatients = patients.filter(p => p.status === 'waiting').slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Patient Queue Management</h3>
        <span className="text-sm text-muted-foreground">{waitingPatients.length} patients waiting</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {waitingPatients.map((patient, idx) => (
          <Card key={patient.id} className="p-4 border-border hover:bg-card/80 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.token} • {patient.department}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground ml-11">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Wait: {patient.estimatedWaitTime}m
                  </div>
                  <div>Age: {Math.floor(Math.random() * 70 + 20)}</div>
                </div>
              </div>

              <div className="flex gap-2 flex-col">
                <Button
                  onClick={() => handleSendConfirmation(patient.id)}
                  size="sm"
                  variant={sentMessages[patient.id] ? 'default' : 'outline'}
                  className={`gap-2 transition-all ${
                    sentMessages[patient.id]
                      ? 'bg-green-500 hover:bg-green-600 text-white border-0'
                      : 'border-border/50'
                  }`}
                >
                  {sentMessages[patient.id] ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      Sent
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      Send Confirmation
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setSelectedPatient(selectedPatient === patient.id ? null : patient.id)}
                  size="sm"
                  variant="outline"
                  className="gap-2 border-border/50"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message
                </Button>
              </div>
            </div>

            {/* Message Input */}
            {selectedPatient === patient.id && (
              <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
                <p className="text-sm font-medium text-foreground">Send message to {patient.name}</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={`patient@email.com`}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <Button size="sm" className="bg-primary">
                    Send Email
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Patient will receive confirmation email and SMS with queue position and estimated wait time.
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
