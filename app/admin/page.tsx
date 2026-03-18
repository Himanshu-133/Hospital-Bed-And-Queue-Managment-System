'use client';

import { StatsCard } from '@/components/admin/stats-card';
import { Card } from '@/components/ui/card';
import { Users, Activity, Clock, TrendingUp } from 'lucide-react';
import { useQueue } from '@/lib/queue-context';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const departmentData = [
  { dept: 'Cardiology', patients: 12, wait: 8 },
  { dept: 'Orthopedics', patients: 8, wait: 6 },
  { dept: 'Neurology', patients: 15, wait: 10 },
  { dept: 'Pediatrics', patients: 6, wait: 4 },
  { dept: 'General', patients: 20, wait: 12 },
];

const timelineData = [
  { time: '08:00', patients: 45 },
  { time: '09:00', patients: 78 },
  { time: '10:00', patients: 95 },
  { time: '11:00', patients: 112 },
  { time: '12:00', patients: 98 },
  { time: '13:00', patients: 145 },
  { time: '14:00', patients: 168 },
  { time: '15:00', patients: 142 },
];

export default function AdminDashboard() {
  const { patients, doctors } = useQueue();

  const waitingPatients = patients.filter(p => p.status === 'waiting').length;
  const consultingPatients = patients.filter(p => p.status === 'in-consultation').length;
  const availableDoctors = doctors.filter(d => d.available).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Real-time hospital queue management</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Patients"
          value={patients.length}
          icon={<Users className="h-6 w-6" />}
          trend="↑ 12% from yesterday"
          color="primary"
        />
        <StatsCard
          title="Waiting"
          value={waitingPatients}
          icon={<Clock className="h-6 w-6" />}
          trend={`${consultingPatients} in consultation`}
          color="secondary"
        />
        <StatsCard
          title="Available Doctors"
          value={`${availableDoctors}/${doctors.length}`}
          icon={<Activity className="h-6 w-6" />}
          trend="All departments covered"
          color="accent"
        />
        <StatsCard
          title="Avg Wait Time"
          value="8 min"
          icon={<TrendingUp className="h-6 w-6" />}
          trend="↓ 15% improvement"
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patients by Department */}
        <Card className="border-border p-6 bg-card">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">Patients by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="dept" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Bar dataKey="patients" fill="hsl(var(--primary-500))" name="Total Patients" />
              <Bar dataKey="wait" fill="hsl(var(--secondary-500))" name="Avg Wait (min)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Patient Flow Timeline */}
        <Card className="border-border p-6 bg-card">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">Patient Flow Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="time" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="patients" stroke="hsl(var(--primary-500))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary-500))' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Department Overview */}
      <Card className="border-border p-6 bg-card">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Department Status</h3>
        <div className="space-y-3">
          {departmentData.map((dept, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{dept.dept}</p>
                <p className="text-sm text-muted-foreground">{dept.patients} patients • {dept.wait}min wait</p>
              </div>
              <div className="flex gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${(dept.wait / 15) * 100}%` }}></div>
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{dept.wait}m</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
