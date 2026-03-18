'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQueue } from '@/lib/queue-context';
import { Edit2, Trash2, Plus, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ManageDoctors() {
  const { doctors } = useQueue();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Doctors</h1>
          <p className="text-muted-foreground">View and manage medical staff</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <Card key={doctor.id} className="border-border p-6 bg-card hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Badge className={doctor.available ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'}>
                {doctor.available ? 'Available' : 'Busy'}
              </Badge>
            </div>

            <h3 className="font-semibold text-card-foreground mb-1">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{doctor.specialization}</p>
            
            <div className="space-y-2 mb-4 p-3 rounded-lg bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium text-card-foreground">{doctor.department}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Room</span>
                <span className="font-medium text-card-foreground">{doctor.roomNumber}</span>
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
        ))}
      </div>
    </div>
  );
}
