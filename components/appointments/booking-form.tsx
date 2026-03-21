'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQueue } from '@/lib/queue-context';
import { Appointment } from '@/lib/types';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';

const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'General', 'Pediatrics'];

export function BookingForm() {
  const { bookAppointment, doctors } = useQueue();
  const [formData, setFormData] = useState({
    patientName: '',
    department: '',
    date: '',
    time: '',
    notes: '',
  });

  const availableDoctors = doctors.filter(d => d.department === formData.department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.department || !formData.date || !formData.time) {
      alert('Please fill all required fields');
      return;
    }

    const doctor = availableDoctors[0];
    if (!doctor) {
      alert('No doctors available in this department');
      return;
    }

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: `pat-${Date.now()}`,
      patientName: formData.patientName,
      doctorId: doctor.id,
      department: formData.department,
      date: formData.date,
      time: formData.time,
      status: 'scheduled',
      notes: formData.notes,
    };

    bookAppointment(appointment);
    alert('Appointment booked successfully!');
    setFormData({ patientName: '', department: '', date: '', time: '', notes: '' });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8 border-border/50 bg-card/30">
        <h2 className="text-2xl font-bold text-foreground mb-8">Book Your Appointment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <User className="h-4 w-4 text-primary" />
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="bg-input border-border/50"
              required
            />
          </div>

          {/* Department Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-input border-border/50"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Clock className="h-4 w-4 text-primary" />
              Time
            </label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="bg-input border-border/50"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information..."
              className="w-full px-4 py-2 rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={4}
            />
          </div>

          {/* Assigned Doctor Info */}
          {formData.department && availableDoctors.length > 0 && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Assigned Doctor</p>
              <p className="font-semibold text-foreground">{availableDoctors[0].name}</p>
              <p className="text-sm text-muted-foreground">{availableDoctors[0].department}</p>
            </div>
          )}

          <Button type="submit" className="w-full rounded-full py-6 text-base font-semibold">
            Confirm Appointment
          </Button>
        </form>
      </Card>
    </div>
  );
}
