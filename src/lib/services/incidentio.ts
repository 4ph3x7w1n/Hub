import { browser } from '$app/environment';

// Local API routes configuration
const API_BASE_URL = '/api';
const API_VERSION = 'v2';

// Types for incident.io API responses
export interface IncidentioIncident {
  id: string;
  name: string;
  severity: {
    id: string;
    name: string;
    rank: number;
  };
  status: {
    id: string;
    name: string;
    category: string;
  };
  created_at: string;
  summary: string;
  timestamps: IncidentTimestamp[];
}

export interface IncidentTimestamp {
  id: string;
  incident_id: string;
  name: string;
  occurred_at: string;
}

export interface IncidentioSeverity {
  id: string;
  name: string;
  rank: number;
  description: string;
}

export interface IncidentioStatus {
  id: string;
  name: string;
  category: string;
  description: string;
}

// API client class
export class IncidentioClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Get all incidents
  async getIncidents(params: {
    status?: string;
    severity?: string;
    after?: string;
    before?: string;
    limit?: number;
  } = {}): Promise<{ incidents: IncidentioIncident[] }> {
    const searchParams = new URLSearchParams();
    
    if (params.status) searchParams.append('status', params.status);
    if (params.severity) searchParams.append('severity', params.severity);
    if (params.after) searchParams.append('after', params.after);
    if (params.before) searchParams.append('before', params.before);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `incidents?${searchParams}`;
    return this.makeRequest<{ incidents: IncidentioIncident[] }>(endpoint);
  }

  // Get incident timestamps for MTTA/MTTR calculations
  async getIncidentTimestamps(incidentId: string): Promise<{ timestamps: IncidentTimestamp[] }> {
    const endpoint = `incidents/${incidentId}/timestamps`;
    return this.makeRequest<{ timestamps: IncidentTimestamp[] }>(endpoint);
  }

  // Get all severities
  async getSeverities(): Promise<{ severities: IncidentioSeverity[] }> {
    const endpoint = 'severities';
    return this.makeRequest<{ severities: IncidentioSeverity[] }>(endpoint);
  }

  // Get all statuses
  async getStatuses(): Promise<{ statuses: IncidentioStatus[] }> {
    const endpoint = 'statuses';
    return this.makeRequest<{ statuses: IncidentioStatus[] }>(endpoint);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest('severities');
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
let incidentioClient: IncidentioClient | null = null;

export function initializeIncidentioClient(): IncidentioClient {
  incidentioClient = new IncidentioClient();
  return incidentioClient;
}

export function getIncidentioClient(): IncidentioClient {
  if (!incidentioClient) {
    throw new Error('incident.io client not initialized. Call initializeIncidentioClient first.');
  }
  return incidentioClient;
}

// Helper function to check if we're in browser and have client
export function isIncidentioAvailable(): boolean {
  return browser && !!incidentioClient;
}