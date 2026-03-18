'use client';

import { useQueue } from '@/lib/queue-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, CheckCircle, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function PatientMessagingPage() {
  const { patients } = useQueue();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [sentMessages, setSentMessages] = useState<Record<string, boolean>>({});
  const [messageContent, setMessageContent] = useState('');

  const waitingPatients = patients.filter(p => p.status === 'waiting').slice(0, 15);

  const handleSendConfirmation = (patientId: string, patientName: string) => {
    setSentMessages(prev => ({ ...prev, [patientId]: true }));
    setTimeout(() => {
      setSentMessages(prev => ({ ...prev, [patientId]: false }));
    }, 2000);
  };

  return (
    <main className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Patient Notifications</h1>
        <p className="text-muted-foreground">Send confirmations and messages to waiting patients via email and SMS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-border p-6 bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Waiting</p>
              <p className="text-3xl font-bold text-foreground">{waitingPatients.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-border p-6 bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Messages Sent</p>
              <p className="text-3xl font-bold text-primary">{Object.values(sentMessages).filter(Boolean).length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-border p-6 bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Wait Time</p>
              <p className="text-3xl font-bold text-foreground">32m</p>
            </div>
          </div>
        </Card>
        <Card className="border-border p-6 bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Response Rate</p>
              <p className="text-3xl font-bold text-green-500">94%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-border bg-card/50">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Queue Notifications</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {waitingPatients.map((patient, idx) => (
              <div
                key={patient.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{patient.name}</p>
                      <Badge variant="outline" className="border-border/50 text-xs">{patient.token}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{patient.department}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Estimated wait: {patient.estimatedWaitTime} minutes
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-col items-end">
                  <Button
                    onClick={() => handleSendConfirmation(patient.id, patient.name)}
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
                        Confirmed
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
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Message Compose Modal */}
      {selectedPatient && (
        <Card className="fixed inset-0 m-auto max-w-xl border-border bg-card z-50">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Send Message</h3>
            <button
              onClick={() => setSelectedPatient(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Patient Email</label>
              <input
                type="email"
                placeholder="patient@example.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Patient Phone (SMS)</label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Message</label>
              <textarea
                value={messageContent}
                onChange={e => setMessageContent(e.target.value)}
                placeholder="Your queue position is #3. Estimated wait time: 25 minutes. Please arrive 5 minutes early."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-32 resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                onClick={() => setSelectedPatient(null)}
                variant="outline"
                className="border-border/50"
              >
                Cancel
              </Button>
              <Button className="gap-2 bg-primary">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>
        </Card>
      )}
    </main>
  );
}
