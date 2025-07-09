import type { IncidentioIncident, IncidentTimestamp } from './incidentio';

// Metrics calculation functions
export interface CalculatedMetrics {
  mtta: number; // Mean Time To Acknowledge (minutes)
  mttr: number; // Mean Time To Resolution (minutes)
  mttd: number; // Mean Time To Detect (minutes)
  incidentCount: number;
  severityBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  uptime: number; // percentage
  trends: {
    mtta: number; // percentage change
    mttr: number; // percentage change
    mttd: number; // percentage change
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

// Default timeframes - using past 3 months as primary dataset
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

// Your specific business requirements
export const BUSINESS_RULES = {
  P1_SEVERITY_ID: '01JCK46RNJXWNMAATAEGSDDB45',
  TARGET_PRODUCTS: ['Commerce', 'POS', 'Inventory & Labor', 'Coach'],
  DURATION_METRIC_IDS: {
    TIME_TO_ACKNOWLEDGE: '01JCP0MSY172KGDX0J6AGAHEDY',
    TIME_TO_DETECT: '01JCRT5C9DD7J0SH5B2BSRRQEF',
    INCIDENT_DURATION: '01JCK46RNJ3Y3HSDE6PTV4KKNM'
  },
  PRODUCT_FIELD_ID: '01JCKXJWGP9T6PJKSMMH6XKEGC'
};

// Filter incidents based on your business rules
export function filterIncidentsForMetrics(incidents: IncidentioIncident[]): IncidentioIncident[] {
  return incidents.filter(incident => {
    // Only P1 incidents
    if (incident.severity.id !== BUSINESS_RULES.P1_SEVERITY_ID) {
      return false;
    }

    // Only target products (Commerce, POS, Inventory & Labor, Coach)
    const productField = incident.custom_field_entries?.find(
      field => field.custom_field.id === BUSINESS_RULES.PRODUCT_FIELD_ID
    );
    
    if (!productField || !productField.values || productField.values.length === 0) {
      return false;
    }

    const hasTargetProduct = productField.values.some(value => 
      value.value_catalog_entry && 
      BUSINESS_RULES.TARGET_PRODUCTS.includes(value.value_catalog_entry.name)
    );

    return hasTargetProduct;
  });
}

export function calculateMTTA(incidents: IncidentioIncident[]): number {
  const filteredIncidents = filterIncidentsForMetrics(incidents);
  const acknowledgeTimes: number[] = [];

  filteredIncidents.forEach(incident => {
    // Look for "Time to acknowledge" duration metric
    const ttaMetric = incident.duration_metrics?.find(
      metric => metric.duration_metric.id === BUSINESS_RULES.DURATION_METRIC_IDS.TIME_TO_ACKNOWLEDGE
    );

    if (ttaMetric && ttaMetric.value_seconds) {
      const minutes = ttaMetric.value_seconds / 60;
      acknowledgeTimes.push(minutes);
    }
  });

  if (acknowledgeTimes.length === 0) return 0;
  
  const sum = acknowledgeTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / acknowledgeTimes.length * 100) / 100;
}

export function calculateMTTR(incidents: IncidentioIncident[]): number {
  const filteredIncidents = filterIncidentsForMetrics(incidents);
  const resolutionTimes: number[] = [];

  filteredIncidents.forEach(incident => {
    // Look for "Incident duration" duration metric (MTTR)
    const mttrMetric = incident.duration_metrics?.find(
      metric => metric.duration_metric.id === BUSINESS_RULES.DURATION_METRIC_IDS.INCIDENT_DURATION
    );

    if (mttrMetric && mttrMetric.value_seconds) {
      const minutes = mttrMetric.value_seconds / 60;
      resolutionTimes.push(minutes);
    }
  });

  if (resolutionTimes.length === 0) return 0;
  
  const sum = resolutionTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / resolutionTimes.length * 100) / 100;
}

export function calculateMTTD(incidents: IncidentioIncident[]): number {
  const filteredIncidents = filterIncidentsForMetrics(incidents);
  const detectionTimes: number[] = [];

  filteredIncidents.forEach(incident => {
    // Look for "Time to detect" duration metric
    const ttdMetric = incident.duration_metrics?.find(
      metric => metric.duration_metric.id === BUSINESS_RULES.DURATION_METRIC_IDS.TIME_TO_DETECT
    );

    if (ttdMetric && ttdMetric.value_seconds) {
      const minutes = ttdMetric.value_seconds / 60;
      detectionTimes.push(minutes);
    }
  });

  if (detectionTimes.length === 0) return 0;
  
  const sum = detectionTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / detectionTimes.length * 100) / 100;
}

export function calculateIncidentCount(incidents: IncidentioIncident[]): number {
  const filteredIncidents = filterIncidentsForMetrics(incidents);
  return filteredIncidents.length;
}

export function calculateSeverityBreakdown(incidents: IncidentioIncident[]): Record<string, number> {
  const filteredIncidents = filterIncidentsForMetrics(incidents);
  const breakdown: Record<string, number> = {};
  
  filteredIncidents.forEach(incident => {
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
  const mttd = calculateMTTD(incidents);
  const incidentCount = calculateIncidentCount(incidents);
  const severityBreakdown = calculateSeverityBreakdown(incidents);
  const statusBreakdown = calculateStatusBreakdown(incidents);
  const uptime = calculateUptime(incidents, timeframe);

  // Calculate trends if we have previous data
  const previousMTTA = calculateMTTA(previousIncidents);
  const previousMTTR = calculateMTTR(previousIncidents);
  const previousMTTD = calculateMTTD(previousIncidents);
  const previousIncidentCount = calculateIncidentCount(previousIncidents);

  const trends = {
    mtta: calculateTrends(mtta, previousMTTA),
    mttr: calculateTrends(mttr, previousMTTR),
    mttd: calculateTrends(mttd, previousMTTD),
    incidentCount: calculateTrends(incidentCount, previousIncidentCount),
  };

  return {
    mtta,
    mttr,
    mttd,
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