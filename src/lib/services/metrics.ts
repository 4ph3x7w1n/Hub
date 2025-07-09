import type { IncidentioIncident, IncidentTimestamp } from './incidentio';

// Metrics calculation functions
export interface CalculatedMetrics {
  mtta: number; // Mean Time To Acknowledge (minutes)
  mttr: number; // Mean Time To Resolution (minutes)
  incidentCount: number;
  severityBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  uptime: number; // percentage
  trends: {
    mtta: number; // percentage change
    mttr: number; // percentage change
    incidentCount: number; // percentage change
  };
}

export interface MetricsTimeframe {
  start: Date;
  end: Date;
  previous?: {
    start: Date;
    end: Date;
  };
}

// Default timeframes
export const TIMEFRAMES = {
  '7d': {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
    previous: {
      start: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    }
  },
  '30d': {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
    previous: {
      start: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    }
  },
  '90d': {
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    end: new Date(),
    previous: {
      start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    }
  }
};

export function calculateMTTA(incidents: IncidentioIncident[]): number {
  const acknowledgeTimes: number[] = [];

  incidents.forEach(incident => {
    const createdTime = new Date(incident.created_at).getTime();
    const acknowledgeTimestamp = incident.timestamps.find(t => 
      t.name === 'acknowledged' || t.name === 'investigating'
    );

    if (acknowledgeTimestamp) {
      const acknowledgeTime = new Date(acknowledgeTimestamp.occurred_at).getTime();
      const diffMinutes = (acknowledgeTime - createdTime) / (1000 * 60);
      acknowledgeTimes.push(diffMinutes);
    }
  });

  if (acknowledgeTimes.length === 0) return 0;
  
  const sum = acknowledgeTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / acknowledgeTimes.length * 100) / 100;
}

export function calculateMTTR(incidents: IncidentioIncident[]): number {
  const resolutionTimes: number[] = [];

  incidents.forEach(incident => {
    const createdTime = new Date(incident.created_at).getTime();
    const resolvedTimestamp = incident.timestamps.find(t => 
      t.name === 'resolved' || t.name === 'closed'
    );

    if (resolvedTimestamp) {
      const resolvedTime = new Date(resolvedTimestamp.occurred_at).getTime();
      const diffMinutes = (resolvedTime - createdTime) / (1000 * 60);
      resolutionTimes.push(diffMinutes);
    }
  });

  if (resolutionTimes.length === 0) return 0;
  
  const sum = resolutionTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / resolutionTimes.length * 100) / 100;
}

export function calculateSeverityBreakdown(incidents: IncidentioIncident[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  
  incidents.forEach(incident => {
    const severity = incident.severity.name;
    breakdown[severity] = (breakdown[severity] || 0) + 1;
  });
  
  return breakdown;
}

export function calculateStatusBreakdown(incidents: IncidentioIncident[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  
  incidents.forEach(incident => {
    const status = incident.status.name;
    breakdown[status] = (breakdown[status] || 0) + 1;
  });
  
  return breakdown;
}

export function calculateUptime(incidents: IncidentioIncident[], timeframe: MetricsTimeframe): number {
  const totalTimeMs = timeframe.end.getTime() - timeframe.start.getTime();
  let downTimeMs = 0;

  incidents.forEach(incident => {
    const createdTime = new Date(incident.created_at).getTime();
    const resolvedTimestamp = incident.timestamps.find(t => 
      t.name === 'resolved' || t.name === 'closed'
    );

    if (resolvedTimestamp) {
      const resolvedTime = new Date(resolvedTimestamp.occurred_at).getTime();
      downTimeMs += (resolvedTime - createdTime);
    }
  });

  const uptime = ((totalTimeMs - downTimeMs) / totalTimeMs) * 100;
  return Math.round(uptime * 100) / 100;
}

export function calculateTrends(current: number, previous: number): number {
  if (previous === 0) return 0;
  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 100) / 100;
}

export function calculateMetrics(
  incidents: IncidentioIncident[],
  previousIncidents: IncidentioIncident[] = [],
  timeframe: MetricsTimeframe
): CalculatedMetrics {
  const mtta = calculateMTTA(incidents);
  const mttr = calculateMTTR(incidents);
  const incidentCount = incidents.length;
  const severityBreakdown = calculateSeverityBreakdown(incidents);
  const statusBreakdown = calculateStatusBreakdown(incidents);
  const uptime = calculateUptime(incidents, timeframe);

  // Calculate trends if we have previous data
  const previousMTTA = calculateMTTA(previousIncidents);
  const previousMTTR = calculateMTTR(previousIncidents);
  const previousIncidentCount = previousIncidents.length;

  const trends = {
    mtta: calculateTrends(mtta, previousMTTA),
    mttr: calculateTrends(mttr, previousMTTR),
    incidentCount: calculateTrends(incidentCount, previousIncidentCount),
  };

  return {
    mtta,
    mttr,
    incidentCount,
    severityBreakdown,
    statusBreakdown,
    uptime,
    trends,
  };
}

// Format metrics for display
export function formatMetric(value: number, type: 'time' | 'count' | 'percentage' | 'trend'): string {
  switch (type) {
    case 'time':
      if (value < 60) return `${value} min`;
      const hours = Math.floor(value / 60);
      const minutes = Math.round(value % 60);
      return `${hours}h ${minutes}m`;
    
    case 'count':
      return value.toLocaleString();
    
    case 'percentage':
      return `${value.toFixed(2)}%`;
    
    case 'trend':
      const sign = value > 0 ? '+' : '';
      return `${sign}${value.toFixed(1)}%`;
    
    default:
      return value.toString();
  }
}

// Get trend direction
export function getTrendDirection(value: number): 'up' | 'down' | 'stable' {
  if (Math.abs(value) < 0.1) return 'stable';
  return value > 0 ? 'up' : 'down';
}