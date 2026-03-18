'use client';

import { useQueue } from '@/lib/queue-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, AlertCircle, CheckCircle, Wrench } from 'lucide-react';

export default function MachinesPage() {
  const { machines, updateMachineStatus } = useQueue();

  const statusIcons: Record<string, React.ReactNode> = {
    available: <CheckCircle className="h-5 w-5 text-green-500" />,
    'in-use': <Zap className="h-5 w-5 text-yellow-500" />,
    maintenance: <Wrench className="h-5 w-5 text-red-500" />,
  };

  const statusColors: Record<string, string> = {
    available: 'bg-green-500/20 text-green-400',
    'in-use': 'bg-yellow-500/20 text-yellow-400',
    maintenance: 'bg-red-500/20 text-red-400',
  };

  const typeEmojis: Record<string, string> = {
    CT: '🔍',
    MRI: '🧲',
    Ultrasound: '📊',
    XRay: '🔬',
    EKG: '❤️',
    Lab: '🧪',
  };

  const availableMachines = machines.filter(m => m.status === 'available').length;
  const inUseMachines = machines.filter(m => m.status === 'in-use').length;
  const maintenanceMachines = machines.filter(m => m.status === 'maintenance').length;

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Machine Management</h1>
          <p className="text-muted-foreground">Monitor and manage medical equipment status</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available</p>
                <p className="text-3xl font-bold text-green-400">{availableMachines}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500/30" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">In Use</p>
                <p className="text-3xl font-bold text-yellow-400">{inUseMachines}</p>
              </div>
              <Zap className="h-10 w-10 text-yellow-500/30" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Maintenance</p>
                <p className="text-3xl font-bold text-red-400">{maintenanceMachines}</p>
              </div>
              <Wrench className="h-10 w-10 text-red-500/30" />
            </div>
          </Card>
        </div>

        {/* Machines Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Equipment Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {machines.map(machine => (
              <Card key={machine.id} className="p-6 border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{typeEmojis[machine.type]}</span>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{machine.name}</h3>
                      <p className="text-sm text-muted-foreground">{machine.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcons[machine.status]}
                    <Badge className={`${statusColors[machine.status]} border-0`}>
                      {machine.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground text-sm">{machine.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <p className="font-semibold text-foreground text-sm">{(machine.utilizationRate * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {machine.currentPatient && (
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Current Patient</p>
                    <p className="text-sm font-semibold text-foreground">ID: {machine.currentPatient}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {machine.status === 'available' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50"
                      onClick={() => updateMachineStatus(machine.id, 'in-use')}
                    >
                      Mark In Use
                    </Button>
                  )}
                  {machine.status === 'in-use' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50"
                      onClick={() => updateMachineStatus(machine.id, 'available')}
                    >
                      Complete
                    </Button>
                  )}
                  {machine.status !== 'maintenance' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-destructive/50 text-destructive hover:text-destructive"
                      onClick={() => updateMachineStatus(machine.id, 'maintenance')}
                    >
                      Maintenance
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
