import { Patient, PatientHistory, QueuePrediction } from './types';

// Binary Search Tree Node
class BSTNode {
  patient: Patient;
  left: BSTNode | null = null;
  right: BSTNode | null = null;
  height: number = 1;

  constructor(patient: Patient) {
    this.patient = patient;
  }
}

// Binary Search Tree for efficient O(log n) patient lookups by arrival time
class PatientBST {
  private root: BSTNode | null = null;

  insert(patient: Patient): void {
    this.root = this._insert(this.root, patient);
  }

  private _insert(node: BSTNode | null, patient: Patient): BSTNode {
    if (node === null) {
      return new BSTNode(patient);
    }

    const comparison = new Date(patient.timestamp).getTime() - new Date(node.patient.timestamp).getTime();
    if (comparison < 0) {
      node.left = this._insert(node.left, patient);
    } else {
      node.right = this._insert(node.right, patient);
    }

    this._updateHeight(node);
    return this._balance(node);
  }

  private _updateHeight(node: BSTNode): void {
    const leftHeight = node.left ? node.left.height : 0;
    const rightHeight = node.right ? node.right.height : 0;
    node.height = 1 + Math.max(leftHeight, rightHeight);
  }

  private _balance(node: BSTNode): BSTNode {
    const balanceFactor = this._getBalanceFactor(node);

    if (balanceFactor > 1 && node.left) {
      if (this._getBalanceFactor(node.left) < 0) {
        node.left = this._rotateLeft(node.left);
      }
      return this._rotateRight(node);
    }

    if (balanceFactor < -1 && node.right) {
      if (this._getBalanceFactor(node.right) > 0) {
        node.right = this._rotateRight(node.right);
      }
      return this._rotateLeft(node);
    }

    return node;
  }

  private _getBalanceFactor(node: BSTNode | null): number {
    if (!node) return 0;
    const leftHeight = node.left ? node.left.height : 0;
    const rightHeight = node.right ? node.right.height : 0;
    return leftHeight - rightHeight;
  }

  private _rotateRight(node: BSTNode): BSTNode {
    const newRoot = node.left!;
    node.left = newRoot.right;
    newRoot.right = node;
    this._updateHeight(node);
    this._updateHeight(newRoot);
    return newRoot;
  }

  private _rotateLeft(node: BSTNode): BSTNode {
    const newRoot = node.right!;
    node.right = newRoot.left;
    newRoot.left = node;
    this._updateHeight(node);
    this._updateHeight(newRoot);
    return newRoot;
  }

  getInOrder(): Patient[] {
    const result: Patient[] = [];
    this._inOrder(this.root, result);
    return result;
  }

  private _inOrder(node: BSTNode | null, result: Patient[]): void {
    if (node === null) return;
    this._inOrder(node.left, result);
    result.push(node.patient);
    this._inOrder(node.right, result);
  }
}

// Exponential Moving Average for trend analysis
function calculateEMA(values: number[], period: number = 5): number {
  if (values.length === 0) return 0;
  const multiplier = 2 / (period + 1);
  let ema = values[0];
  for (let i = 1; i < values.length; i++) {
    ema = values[i] * multiplier + ema * (1 - multiplier);
  }
  return ema;
}

// Poisson Distribution for queue arrival rate
function poissonProbability(lambda: number, k: number): number {
  const numerator = Math.pow(lambda, k) * Math.exp(-lambda);
  let denominator = 1;
  for (let i = 1; i <= k; i++) {
    denominator *= i;
  }
  return numerator / denominator;
}

// M/M/c Queuing Theory: Multiple servers, exponential arrivals and service
function mmcQueueAnalysis(
  arrivalRate: number,
  serviceRate: number,
  servers: number
): { avgWaitTime: number; utilization: number } {
  const rho = arrivalRate / (serviceRate * servers);
  
  if (rho >= 1) {
    return { avgWaitTime: Infinity, utilization: 1 };
  }

  // Calculate C(n,k) probability
  let sumTerm = 0;
  for (let k = 0; k < servers; k++) {
    let term = 1;
    for (let i = 1; i <= k; i++) {
      term *= (arrivalRate / (i * serviceRate));
    }
    sumTerm += term;
  }

  let cTerm = 1;
  for (let i = 1; i <= servers; i++) {
    cTerm *= (arrivalRate / (i * serviceRate));
  }

  const pw = cTerm / (sumTerm + cTerm * (1 - rho));
  const avgWaitTime = (pw / (servers * serviceRate * (1 - rho))) * (1 / arrivalRate);

  return {
    avgWaitTime,
    utilization: rho,
  };
}

// AIIMS-specific parameters for queue prediction
const AIIMS_PARAMS = {
  avgConsultationTime: 35, // minutes
  avgLOS: 3.5, // days
  admissionRate: 0.30, // 30% of OPD
  dischargeRate: 0.28, // 28% daily
  peakHoursFactor: 1.5,
  weekdayMultiplier: 1.2,
};

// Queue Prediction using AIIMS-tuned algorithms
export function predictQueueLength(
  patients: Patient[],
  patientHistory: PatientHistory[],
  timeHorizon: number = 60 // minutes
): QueuePrediction {
  const now = Date.now();
  const recentPatients = patients.filter(
    p => now - new Date(p.timestamp).getTime() < 4 * 60 * 60 * 1000 // Last 4 hours
  );

  if (recentPatients.length === 0) {
    return {
      timestamp: new Date().toISOString(),
      predictedQueue: 0,
      confidence: 0.5,
      algorithm: 'AIIMS-M/M/c',
    };
  }

  // Extract historical admission and discharge times
  const admissionDischargeRates: number[] = [];
  for (let i = 0; i < patientHistory.length - 1; i++) {
    const history = patientHistory[i];
    if (history.dischargeTime) {
      const admitTime = new Date(history.admissionTime).getTime();
      const dischargeTime = new Date(history.dischargeTime).getTime();
      const los = (dischargeTime - admitTime) / (1000 * 60 * 60 * 24); // LOS in days
      admissionDischargeRates.push(los);
    }
  }

  // AIIMS-calibrated arrival rate
  const arrivalRate = recentPatients.length / 240; // 240 minutes = 4 hours
  const isWeekday = new Date().getDay() !== 0 && new Date().getDay() !== 6;
  const adjustedArrivalRate = arrivalRate * (isWeekday ? AIIMS_PARAMS.weekdayMultiplier : 1);

  // AIIMS average LOS from historical data
  const avgLOS = admissionDischargeRates.length > 0
    ? admissionDischargeRates.reduce((a, b) => a + b) / admissionDischargeRates.length
    : AIIMS_PARAMS.avgLOS;

  // Convert LOS (days) to consultation time (minutes) for service rate calculation
  const avgConsultationTimeMinutes = AIIMS_PARAMS.avgConsultationTime;
  const serviceRate = 1 / (avgConsultationTimeMinutes / 60); // Per minute

  // Use M/M/c queuing for 8 servers (average doctors per department)
  const queueAnalysis = mmcQueueAnalysis(arrivalRate, serviceRate, 8);

  // Calculate EMA for trend
  const waitTimes = recentPatients.map(p => p.estimatedWaitTime || 0);
  const emaTrend = calculateEMA(waitTimes);

  // Poisson distribution for expected arrivals
  const expectedArrivals = poissonProbability(arrivalRate * timeHorizon, Math.round(arrivalRate * timeHorizon));

  // Combine predictions: 60% M/M/c, 30% EMA, 10% Poisson
  const basePrediction = Math.round(recentPatients.length * (1 + queueAnalysis.utilization * 0.5));
  const emaPrediction = Math.round(emaTrend / 5); // Normalize EMA
  const poissonPrediction = Math.round(arrivalRate * timeHorizon);

  const combinedPrediction = Math.round(
    basePrediction * 0.6 + emaPrediction * 0.3 + poissonPrediction * 0.1
  );

  const confidence = Math.min(0.95, 0.5 + Math.min(recentPatients.length / 100, 0.45));

  return {
    timestamp: new Date().toISOString(),
    predictedQueue: Math.max(0, combinedPrediction),
    confidence,
    peakTime: calculatePeakTime(recentPatients),
    algorithm: 'MMC-EMA-Poisson-Hybrid',
  };
}

function calculatePeakTime(patients: Patient[]): string {
  const hourCounts = new Map<number, number>();
  
  patients.forEach(p => {
    const hour = new Date(p.timestamp).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });

  let peakHour = 0;
  let maxCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  });

  return `${peakHour.toString().padStart(2, '0')}:00`;
}

// Export BST for other uses
export { PatientBST };
