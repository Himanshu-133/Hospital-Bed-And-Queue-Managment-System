'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQueue } from '@/lib/queue-context';
import { Edit2, Trash2, Plus, Building2 } from 'lucide-react';

export default function ManageDepartments() {
  const { departments, patients } = useQueue();

  const getDeptStats = (deptName: string) => {
    const deptPatients = patients.filter(p => p.department === deptName);
    return {
      total: deptPatients.length,
      waiting: deptPatients.filter(p => p.status === 'waiting').length,
      consulting: deptPatients.filter(p => p.status === 'in-consultation').length,
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Departments</h1>
          <p className="text-muted-foreground">View and manage hospital departments</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map(dept => {
          const stats = getDeptStats(dept.name);
          return (
            <Card key={dept.id} className="border-border p-6 bg-card hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{dept.name}</h3>
                    <p className="text-xs text-muted-foreground">Department ID: {dept.id}</p>
                  </div>
                </div>
                <Badge variant="outline">{dept.activeQueues} queues</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 p-4 rounded-lg bg-muted/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center border-l border-r border-border">
                  <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
                  <p className="text-xs text-muted-foreground">Waiting</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.consulting}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
