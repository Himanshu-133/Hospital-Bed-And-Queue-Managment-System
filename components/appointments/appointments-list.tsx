'use client';

import { useQueue } from '@/lib/queue-context';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, User, Stethoscope, CheckCircle, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function AppointmentsList() {
  const { appointments, confirmAppointment } = useQueue();
  const [confirmedAppointment, setConfirmedAppointment] = useState<string | null>(null);

  const handleConfirm = (appointmentId: string, patientId: string, doctorId: string) => {
    confirmAppointment(appointmentId, patientId, doctorId);
    setConfirmedAppointment(appointmentId);
    setTimeout(() => setConfirmedAppointment(null), 2000);
  };

  const statusColor: Record<string, string> = {
    scheduled: 'bg-primary/20 text-primary',
    confirmed: 'bg-green-500/20 text-green-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-8">Your Appointments</h2>

      {appointments.length === 0 ? (
        <Card className="p-12 border-border/50 bg-card/30 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No appointments scheduled yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map(apt => (
            <Card key={apt.id} className="p-6 border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{apt.patientName}</h3>
                      <p className="text-sm text-muted-foreground">{apt.department}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[apt.status]}`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(apt.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {apt.time}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Assigned Doctor</p>
                    <p className="font-semibold text-foreground text-sm">{apt.doctorId}</p>
                  </div>

                  {apt.notes && (
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm text-foreground line-clamp-2">{apt.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {apt.status === 'scheduled' && (
                <div className="mt-4 flex gap-2 justify-end">
                  <Button
                    onClick={() => handleConfirm(apt.id, apt.patientId, apt.doctorId)}
                    size="sm"
                    className={`gap-2 transition-all ${
                      confirmedAppointment === apt.id
                        ? 'bg-green-500 text-white'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }`}
                  >
                    {confirmedAppointment === apt.id ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Confirmed
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4" />
                        Confirm & Join Queue
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 border-border/50 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
              {apt.status === 'confirmed' && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">You're in the queue. Check Doctor Dashboard for your status.</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
