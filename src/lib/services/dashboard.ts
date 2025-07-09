import { getIncidentioClient, isIncidentioAvailable } from './incidentio';
import { calculateMetrics, formatMetric, getTrendDirection, TIMEFRAMES } from './metrics';
import type { CalculatedMetrics, MetricsTimeframe } from './metrics';

// Dashboard data structure matching our existing KPI format
export interface DashboardData {
  kpiData: {
    mtta: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      trendValue: string;
      subtitle: string;
    };
    mttr: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      trendValue: string;
      subtitle: string;
    };
    mttd: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      trendValue: string;
      subtitle: string;
    };
    incidentCount: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      trendValue: string;
      subtitle: string;
    };
    uptime: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      trendValue: string;
      subtitle: string;
    };
  };
  lastUpdated: string;
  isLive: boolean;
  apiStatus: 'healthy' | 'error' | 'checking';
}

// Cache for API responses
let cachedData: DashboardData | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchDashboardData(
  timeframe: keyof typeof TIMEFRAMES = '90d',
  forceRefresh: boolean = false
): Promise<DashboardData> {
  // Return cached data if available and not expired
  if (!forceRefresh && cachedData && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedData;
  }

  // Check if incident.io is available
  if (!isIncidentioAvailable()) {
    return getFallbackData();
  }

  try {
    const client = getIncidentioClient();
    const timeframeConfig = TIMEFRAMES[timeframe];
    
    // Fetch current period incidents (past 3 months)
    const currentIncidents = await client.getIncidents({
      after: timeframeConfig.start.toISOString(),
      before: timeframeConfig.end.toISOString(),
      limit: 1000 // Adjust based on your needs
    });

    // Fetch previous period incidents for trend calculation
    let previousIncidents = { incidents: [] };
    if (timeframeConfig.previous) {
      previousIncidents = await client.getIncidents({
        after: timeframeConfig.previous.start.toISOString(),
        before: timeframeConfig.previous.end.toISOString(),
        limit: 1000
      });
    }

    // Fetch timestamps for all incidents to calculate MTTA/MTTR
    const enrichedIncidents = await Promise.all(
      currentIncidents.incidents.map(async (incident) => {
        try {
          const timestamps = await client.getIncidentTimestamps(incident.id);
          return { ...incident, timestamps: timestamps.timestamps };
        } catch (error) {
          console.warn(`Failed to fetch timestamps for incident ${incident.id}:`, error);
          return { ...incident, timestamps: [] };
        }
      })
    );

    const enrichedPreviousIncidents = await Promise.all(
      previousIncidents.incidents.map(async (incident) => {
        try {
          const timestamps = await client.getIncidentTimestamps(incident.id);
          return { ...incident, timestamps: timestamps.timestamps };
        } catch (error) {
          console.warn(`Failed to fetch timestamps for incident ${incident.id}:`, error);
          return { ...incident, timestamps: [] };
        }
      })
    );

    // Calculate metrics
    const metrics = calculateMetrics(
      enrichedIncidents,
      enrichedPreviousIncidents,
      timeframeConfig
    );

    // Convert to dashboard format
    const dashboardData: DashboardData = {
      kpiData: {
        mtta: {
          value: formatMetric(metrics.mtta, 'time'),
          trend: getTrendDirection(metrics.trends.mtta),
          trendValue: formatMetric(Math.abs(metrics.trends.mtta), 'trend'),
          subtitle: 'Mean Time To Acknowledge (P1 Only)'
        },
        mttr: {
          value: formatMetric(metrics.mttr, 'time'),
          trend: getTrendDirection(metrics.trends.mttr),
          trendValue: formatMetric(Math.abs(metrics.trends.mttr), 'trend'),
          subtitle: 'Mean Time To Resolution (P1 Only)'
        },
        mttd: {
          value: formatMetric(metrics.mttd, 'time'),
          trend: getTrendDirection(metrics.trends.mttd),
          trendValue: formatMetric(Math.abs(metrics.trends.mttd), 'trend'),
          subtitle: 'Mean Time To Detect (P1 Only)'
        },
        incidentCount: {
          value: formatMetric(metrics.incidentCount, 'count'),
          trend: getTrendDirection(metrics.trends.incidentCount),
          trendValue: formatMetric(Math.abs(metrics.trends.incidentCount), 'trend'),
          subtitle: `P1 Incidents (${timeframe.toUpperCase()})`
        },
        uptime: {
          value: formatMetric(metrics.uptime, 'percentage'),
          trend: metrics.uptime > 99.5 ? 'up' : 'down',
          trendValue: '0.1%',
          subtitle: 'System Uptime'
        }
      },
      lastUpdated: new Date().toISOString(),
      isLive: true,
      apiStatus: 'healthy'
    };

    // Cache the data
    cachedData = dashboardData;
    lastFetchTime = Date.now();
    
    return dashboardData;

  } catch (error) {
    console.error('Failed to fetch incident.io data:', error);
    
    // Return fallback data with error status
    const fallbackData = getFallbackData();
    fallbackData.apiStatus = 'error';
    fallbackData.isLive = false;
    
    return fallbackData;
  }
}

// Fallback data when API is unavailable
function getFallbackData(): DashboardData {
  return {
    kpiData: {
      mtta: {
        value: '4.2 min',
        trend: 'down',
        trendValue: '12%',
        subtitle: 'Mean Time To Acknowledge (P1 Only)'
      },
      mttr: {
        value: '18.7 min',
        trend: 'down',
        trendValue: '8%',
        subtitle: 'Mean Time To Resolution (P1 Only)'
      },
      mttd: {
        value: '2.1 min',
        trend: 'up',
        trendValue: '5%',
        subtitle: 'Mean Time To Detect (P1 Only)'
      },
      incidentCount: {
        value: '12',
        trend: 'down',
        trendValue: '15%',
        subtitle: 'P1 Incidents (3 Months)'
      },
      uptime: {
        value: '99.97%',
        trend: 'stable',
        trendValue: '0.0%',
        subtitle: 'System Uptime'
      }
    },
    lastUpdated: new Date().toISOString(),
    isLive: false,
    apiStatus: 'checking'
  };
}

// Manual refresh function
export function refreshDashboard(timeframe: keyof typeof TIMEFRAMES = '90d'): Promise<DashboardData> {
  return fetchDashboardData(timeframe, true);
}

// Check API health
export async function checkApiHealth(): Promise<boolean> {
  if (!isIncidentioAvailable()) {
    return false;
  }

  try {
    const client = getIncidentioClient();
    return await client.healthCheck();
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}