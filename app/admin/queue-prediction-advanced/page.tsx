'use client';

import { useQueue } from '@/lib/queue-context';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Brain, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export default function QueuePredictionPage() {
  const { patients, patientHistory, queuePrediction } = useQueue();

  // Generate historical queue data
  const historicalData = [
    { time: '06:00', queue: 12, predicted: 15 },
    { time: '08:00', queue: 28, predicted: 32 },
    { time: '10:00', queue: 42, predicted: 40 },
    { time: '12:00', queue: 35, predicted: 38 },
    { time: '14:00', queue: 48, predicted: 50 },
    { time: '16:00', queue: 41, predicted: 45 },
    { time: '18:00', queue: 25, predicted: 28 },
    { time: '20:00', queue: 15, predicted: 18 },
  ];

  // Department distribution
  const departmentData = patients.reduce((acc: any[], p) => {
    const existing = acc.find(d => d.name === p.department);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: p.department, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Calculate metrics
  const currentQueue = patients.filter(p => p.status === 'waiting').length;
  const avgWaitTime = patients.length > 0
    ? Math.round(patients.reduce((sum, p) => sum + (p.estimatedWaitTime || 0), 0) / patients.length)
    : 0;

  const admissionRatePerHour = patientHistory.filter(p => {
    const admitTime = new Date(p.admissionTime);
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return admitTime > hourAgo;
  }).length;

  const dischargeRatePerHour = patientHistory.filter(p => {
    if (!p.dischargeTime) return false;
    const dischargeTime = new Date(p.dischargeTime);
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return dischargeTime > hourAgo;
  }).length;

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Queue Prediction & Analytics</h1>
          <p className="text-muted-foreground">Advanced forecasting using M/M/c queuing theory, EMA, and Poisson distribution</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Prediction Summary */}
        {queuePrediction && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="p-8 border-border/50 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Predicted Queue (Next Hour)</p>
                  <p className="text-4xl font-bold text-primary">{queuePrediction.predictedQueue}</p>
                </div>
                <Brain className="h-10 w-10 text-primary/50" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 h-2 bg-primary/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(queuePrediction.confidence * 100, 100)}%` }}
                  />
                </div>
                <span className="text-muted-foreground">{(queuePrediction.confidence * 100).toFixed(0)}% confidence</span>
              </div>
            </Card>

            <Card className="p-8 border-border/50 bg-card/30">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Algorithm</span>
                  <span className="font-semibold text-foreground">{queuePrediction.algorithm}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Peak Time</span>
                  <span className="font-semibold text-foreground">{queuePrediction.peakTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Admission Rate</span>
                  <span className="font-semibold text-foreground">{admissionRatePerHour}/hour</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Discharge Rate</span>
                  <span className="font-semibold text-foreground">{dischargeRatePerHour}/hour</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Queue</p>
                <p className="text-3xl font-bold text-foreground">{currentQueue}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/50" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Wait Time</p>
                <p className="text-3xl font-bold text-foreground">{avgWaitTime}m</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500/50" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-foreground">{patients.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/50" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Admitted Today</p>
                <p className="text-3xl font-bold text-foreground">{patientHistory.filter(p => p.status !== 'discharged').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500/50" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Historical vs Predicted */}
          <Card className="p-6 border-border/50 bg-card/30">
            <h3 className="text-lg font-bold text-foreground mb-6">Queue Trend Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="queue" stroke="#4f46e5" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#0ea5e9" strokeWidth={2} name="Predicted" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Department Distribution */}
          <Card className="p-6 border-border/50 bg-card/30">
            <h3 className="text-lg font-bold text-foreground mb-6">Queue by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Algorithm Explanation */}
        <Card className="p-8 border-border/50 bg-card/30">
          <h3 className="text-lg font-bold text-foreground mb-6">Prediction Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold">1</span>
                M/M/c Queuing Theory
              </h4>
              <p className="text-sm text-muted-foreground">
                Models multiple service channels with exponential arrivals and departures. Uses queue utilization factor to predict wait times for multiple doctors per department.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold">2</span>
                Exponential Moving Average
              </h4>
              <p className="text-sm text-muted-foreground">
                Captures recent trends in wait times with greater weight given to recent observations. Helps identify if queues are growing or shrinking.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold">3</span>
                Poisson Distribution
              </h4>
              <p className="text-sm text-muted-foreground">
                Models random arrival rates with lambda parameter from historical data. Provides probability distribution for expected arrivals in next hour.
              </p>
            </div>
          </div>

          {/* Data Structure */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <h4 className="font-semibold text-foreground mb-4">Data Optimization</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Uses AVL Binary Search Tree for O(log n) patient lookups by timestamp, enabling efficient processing of hundreds of concurrent patients.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
