'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const hourlyData = [
  { hour: '08:00', queue: 45, served: 38 },
  { hour: '09:00', queue: 78, served: 72 },
  { hour: '10:00', queue: 95, served: 88 },
  { hour: '11:00', queue: 112, served: 102 },
  { hour: '12:00', queue: 98, served: 95 },
  { hour: '13:00', queue: 145, served: 138 },
  { hour: '14:00', queue: 168, served: 155 },
  { hour: '15:00', queue: 142, served: 140 },
];

const departmentPerformance = [
  { dept: 'Cardiology', avgWait: 8, served: 24 },
  { dept: 'Orthopedics', avgWait: 6, served: 18 },
  { dept: 'Neurology', avgWait: 10, served: 15 },
  { dept: 'Pediatrics', avgWait: 4, served: 22 },
  { dept: 'General', avgWait: 12, served: 28 },
];

const patientStatusData = [
  { name: 'Completed', value: 85, color: '#10b981' },
  { name: 'In Consultation', value: 12, color: '#3b82f6' },
  { name: 'Waiting', value: 23, color: '#f59e0b' },
];

export default function QueueAnalytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Queue Analytics</h1>
        <p className="text-muted-foreground">Detailed insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border p-6 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Avg Wait Time</p>
          <p className="text-3xl font-bold text-primary">8.2 min</p>
          <p className="text-xs text-muted-foreground mt-2">↓ 12% from yesterday</p>
        </Card>
        <Card className="border-border p-6 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Patients Served</p>
          <p className="text-3xl font-bold text-secondary">342</p>
          <p className="text-xs text-muted-foreground mt-2">Today</p>
        </Card>
        <Card className="border-border p-6 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Peak Hour</p>
          <p className="text-3xl font-bold text-accent">14:00</p>
          <p className="text-xs text-muted-foreground mt-2">168 patients</p>
        </Card>
        <Card className="border-border p-6 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Doctor Util.</p>
          <p className="text-3xl font-bold text-primary">87%</p>
          <p className="text-xs text-muted-foreground mt-2">Avg occupancy</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Queue Trend */}
        <Card className="border-border p-6 bg-card">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">Hourly Queue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="hour" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="queue" stroke="hsl(var(--primary-500))" strokeWidth={2} name="In Queue" />
              <Line type="monotone" dataKey="served" stroke="hsl(var(--secondary-500))" strokeWidth={2} name="Served" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Performance */}
        <Card className="border-border p-6 bg-card">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">Department Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="dept" stroke="currentColor" />
              <YAxis stroke="currentColor" yAxisId="left" />
              <YAxis stroke="currentColor" yAxisId="right" orientation="right" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="avgWait" fill="hsl(var(--primary-500))" name="Avg Wait (min)" />
              <Bar yAxisId="right" dataKey="served" fill="hsl(var(--secondary-500))" name="Served" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card className="border-border p-6 bg-card">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Patient Status Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={patientStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                {patientStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col justify-center space-y-4">
            {patientStatusData.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-4 w-4 rounded" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.value} patients</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
