import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Define content structure
export interface TeamStats {
  size: string;
  coverage: string;
  regions: string[];
  specialties: string[];
}

export interface KPIData {
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
  incidentCount: {
    value: string;
    trend: 'up' | 'down' | 'stable';
    trendValue: string;
    subtitle: string;
  };
  coverage: {
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
}

export interface ContentData {
  teamStats: TeamStats;
  kpiData: KPIData;
  lastUpdated: string;
  updatedBy: string;
}

// Default content data
const defaultContent: ContentData = {
  teamStats: {
    size: 'Medium',
    coverage: '24/7',
    regions: ['US East', 'US West', 'Europe', 'Asia Pacific'],
    specialties: ['Infrastructure', 'Applications', 'Security', 'Performance']
  },
  kpiData: {
    mtta: {
      value: '4.2 min',
      trend: 'down',
      trendValue: '12%',
      subtitle: 'Mean Time To Acknowledge'
    },
    mttr: {
      value: '18.7 min',
      trend: 'down',
      trendValue: '8%',
      subtitle: 'Mean Time To Resolution'
    },
    incidentCount: {
      value: '247',
      trend: 'down',
      trendValue: '15%',
      subtitle: 'Total Incidents This Month'
    },
    coverage: {
      value: '99.8%',
      trend: 'up',
      trendValue: '0.2%',
      subtitle: 'Global Infrastructure Coverage'
    },
    uptime: {
      value: '99.97%',
      trend: 'stable',
      trendValue: '0.0%',
      subtitle: 'System Uptime'
    }
  },
  lastUpdated: new Date().toISOString(),
  updatedBy: 'System'
};

// Create store with localStorage persistence
function createContentStore() {
  const { subscribe, set, update } = writable<ContentData>(defaultContent);

  return {
    subscribe,
    set,
    update,
    // Load from localStorage
    load: () => {
      if (browser) {
        const stored = localStorage.getItem('byte-content-data');
        if (stored) {
          try {
            const data = JSON.parse(stored);
            set(data);
          } catch (e) {
            console.error('Failed to parse stored content data:', e);
          }
        }
      }
    },
    // Save to localStorage
    save: (data: ContentData) => {
      if (browser) {
        localStorage.setItem('byte-content-data', JSON.stringify(data));
      }
      set(data);
    },
    // Update KPI data
    updateKPI: (key: keyof KPIData, value: Partial<KPIData[keyof KPIData]>) => {
      update(content => ({
        ...content,
        kpiData: {
          ...content.kpiData,
          [key]: { ...content.kpiData[key], ...value }
        },
        lastUpdated: new Date().toISOString()
      }));
    },
    // Update team stats
    updateTeamStats: (stats: Partial<TeamStats>) => {
      update(content => ({
        ...content,
        teamStats: { ...content.teamStats, ...stats },
        lastUpdated: new Date().toISOString()
      }));
    },
    // Reset to defaults
    reset: () => {
      set(defaultContent);
      if (browser) {
        localStorage.removeItem('byte-content-data');
      }
    }
  };
}

export const contentStore = createContentStore();