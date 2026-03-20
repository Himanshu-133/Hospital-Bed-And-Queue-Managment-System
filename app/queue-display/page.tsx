'use client';

import { useQueue } from '@/lib/queue-context';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Stethoscope, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Chatbot from '@/components/chatbot';

export default function QueueDisplay() {
  const { patients, doctors } = useQueue();
  const [rotating, setRotating] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotating(p => (p + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const consultingPatients = patients.filter(p => p.status === 'in-progress');
  const waitingPatients = patients.filter(p => p.status === 'waiting');

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Back Button */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Hospital Queue Management</h1>
              <p className="text-muted-foreground">Real-time queue status and patient tracking</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 border-border/50">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <Card className="border-border p-6 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Currently Serving</p>
                  <p className="text-3xl font-bold text-foreground">{consultingPatients.length}</p>
                </div>
                <Stethoscope className="h-10 w-10 text-primary opacity-50" />
              </div>
            </Card>
            <Card className="border-border p-6 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Waiting</p>
                  <p className="text-3xl font-bold text-foreground">{waitingPatients.length}</p>
                </div>
                <Users className="h-10 w-10 text-secondary opacity-50" />
              </div>
            </Card>
            <Card className="border-border p-6 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-foreground">28m</p>
                </div>
                <Clock className="h-10 w-10 text-accent opacity-50" />
              </div>
            </Card>
          </div>

          {/* Now Serving Section */}
          {consultingPatients.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Now Serving</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {consultingPatients.map(patient => (
                  <Card key={patient.id} className="border-2 border-primary p-6 bg-card/80 backdrop-blur">
                    <div className="text-center space-y-3">
                      <div className="h-16 w-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                        <p className="text-3xl font-bold text-primary">{patient.token.slice(-2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.token}</p>
                      </div>
                      <Badge className="bg-primary/20 text-primary mx-auto">{patient.department}</Badge>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Consultation in progress
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Waiting Queue Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Waiting Queue ({waitingPatients.length} patients)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {waitingPatients.slice(0, 10).map((patient, idx) => (
                <Card key={patient.id} className="border-border p-4 hover:bg-card/80 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.token}</p>
                        <div className="flex gap-2 mt-2 text-xs">
                          <Badge variant="outline" className="border-border/50">{patient.department}</Badge>
                          <Badge variant="outline" className="border-border/50">Est. {patient.estimatedWaitTime}m</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Queue Display Grid */}
          <div className="rounded-2xl bg-card/50 backdrop-blur border border-border p-8">
            <p className="text-center text-lg font-semibold text-foreground mb-6">Queue Overview</p>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {waitingPatients.slice(0, 16).map(patient => (
                <div
                  key={patient.id}
                  className="rounded-lg bg-primary/10 hover:bg-primary/20 p-3 text-center transition-colors border border-primary/30 cursor-default"
                  title={patient.name}
                >
                  <p className="text-xs font-semibold text-primary">{patient.token}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />

      {/* Live indicator */}
      <div className="fixed bottom-6 left-6 flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 border border-green-500/30">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-xs text-green-600 font-medium">Live Updates</span>
      </div>
    </>
  );
}
