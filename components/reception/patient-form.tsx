'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueue } from '@/lib/queue-context';
import { generatePatientToken } from '@/lib/mock-data';
import { Plus } from 'lucide-react';

export function PatientForm() {
  const { patients, addPatient, departments } = useQueue();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    department: 'Cardiology',
  });
  const [newToken, setNewToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.phone) return;

    const token = generatePatientToken(formData.department, patients.length + 1);
    const newPatient = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      phone: formData.phone,
      token,
      status: 'waiting' as const,
      timestamp: new Date(),
      estimatedWait: 10,
      department: formData.department,
    };

    addPatient(newPatient);
    setNewToken(token);
    setFormData({ name: '', age: '', phone: '', department: 'Cardiology' });
    setTimeout(() => setNewToken(''), 3000);
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
        <Plus className="h-4 w-4" />
        Register Patient
      </Button>
    );
  }

  return (
    <Card className="border-border p-6 bg-card fixed inset-0 m-auto max-w-md z-50">
      <h2 className="mb-4 text-xl font-semibold text-card-foreground">Register New Patient</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-card-foreground">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Patient name"
            className="mt-1 border-border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-card-foreground">Age</label>
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="Age"
              className="mt-1 border-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone"
              className="mt-1 border-border"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-card-foreground">Department</label>
          <Select value={formData.department} onValueChange={(val) => setFormData({ ...formData, department: val })}>
            <SelectTrigger className="mt-1 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {newToken && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground">Patient Token</p>
            <p className="text-2xl font-bold text-primary">{newToken}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
            Register
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Close
          </Button>
        </div>
      </form>
    </Card>
  );
}
