'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQueue } from '@/lib/queue-context';
import { Clock, User } from 'lucide-react';

export function PatientList() {
  const { patients } = useQueue();
  const displayPatients = patients.filter(p => p.status !== 'completed').slice(0, 10);

  const statusColors = {
    'waiting': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'in-consultation': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <Card className="border-border p-6 bg-card">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">Registered Patients</h3>
      
      <div className="space-y-2">
        {displayPatients.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No patients registered</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold text-muted-foreground">Token</th>
                  <th className="text-left py-2 font-semibold text-muted-foreground">Patient</th>
                  <th className="text-left py-2 font-semibold text-muted-foreground">Department</th>
                  <th className="text-left py-2 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-2 font-semibold text-muted-foreground">Wait</th>
                </tr>
              </thead>
              <tbody>
                {displayPatients.map(patient => (
                  <tr key={patient.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <span className="font-mono font-semibold text-primary">{patient.token}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-card-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.age} years</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{patient.department}</td>
                    <td className="py-3">
                      <Badge variant="outline" className={statusColors[patient.status]}>
                        {patient.status === 'in-consultation' ? 'In Progress' : patient.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {patient.estimatedWait}m
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
