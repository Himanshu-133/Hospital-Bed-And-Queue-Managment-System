'use client';

import { PatientForm } from '@/components/reception/patient-form';
import { PatientList } from '@/components/reception/patient-list';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/admin/stats-card';
import { useQueue } from '@/lib/queue-context';
import { Users, Clock, CheckCircle2 } from 'lucide-react';

export default function ReceptionPanel() {
  const { patients } = useQueue();
  
  const waitingCount = patients.filter(p => p.status === 'waiting').length;
  const consultingCount = patients.filter(p => p.status === 'in-consultation').length;
  const completedCount = patients.filter(p => p.status === 'completed').length;

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Reception Panel</h1>
        <p className="text-muted-foreground">Manage patient registrations and queue</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Waiting"
          value={waitingCount}
          icon={<Users className="h-6 w-6" />}
          color="secondary"
        />
        <StatsCard
          title="In Consultation"
          value={consultingCount}
          icon={<Clock className="h-6 w-6" />}
          color="primary"
        />
        <StatsCard
          title="Completed Today"
          value={completedCount}
          icon={<CheckCircle2 className="h-6 w-6" />}
          color="accent"
        />
      </div>

      {/* Register & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PatientList />
        </div>
        
        <div className="space-y-6">
          <Card className="border-border p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="mb-4 text-lg font-semibold text-card-foreground">Quick Actions</h2>
            <div className="space-y-3">
              <PatientForm />
              <p className="text-xs text-muted-foreground text-center">
                Patients will receive a digital token upon registration
              </p>
            </div>
          </Card>

          <Card className="border-border p-6 bg-card">
            <h3 className="mb-4 font-semibold text-card-foreground">Queue Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Queue Fill</span>
                  <span className="font-semibold text-foreground">{((patients.length / 50) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${(patients.length / 50) * 100}%` }}></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {patients.length} total patients registered today
              </p>
            </div>
          </Card>

          <Card className="border-border p-6 bg-card">
            <h3 className="mb-3 font-semibold text-card-foreground">Avg Wait Time</h3>
            <p className="text-3xl font-bold text-primary mb-1">8-12 min</p>
            <p className="text-xs text-muted-foreground">Based on current flow</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
