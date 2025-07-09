import { browser } from '$app/environment';

// incident.io API configuration
const API_BASE_URL = 'https://api.incident.io';
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
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = API_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`incident.io API error: ${response.status} - ${errorText}`);
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

    const endpoint = `${API_VERSION}/incidents?${searchParams}`;
    return this.makeRequest<{ incidents: IncidentioIncident[] }>(endpoint);
  }

  // Get incident timestamps for MTTA/MTTR calculations
  async getIncidentTimestamps(incidentId: string): Promise<{ timestamps: IncidentTimestamp[] }> {
    const endpoint = `${API_VERSION}/incidents/${incidentId}/timestamps`;
    return this.makeRequest<{ timestamps: IncidentTimestamp[] }>(endpoint);
  }

  // Get all severities
  async getSeverities(): Promise<{ severities: IncidentioSeverity[] }> {
    const endpoint = 'v1/severities';
    return this.makeRequest<{ severities: IncidentioSeverity[] }>(endpoint);
  }

  // Get all statuses
  async getStatuses(): Promise<{ statuses: IncidentioStatus[] }> {
    const endpoint = 'v1/incident_statuses';
    return this.makeRequest<{ statuses: IncidentioStatus[] }>(endpoint);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest('v1/severities');
      return true;
    } catch (error) {
      console.error('incident.io API health check failed:', error);
      return false;
    }
  }
}

// Singleton instance (will be initialized with API key)
let incidentioClient: IncidentioClient | null = null;

export function initializeIncidentioClient(apiKey: string): IncidentioClient {
  incidentioClient = new IncidentioClient(apiKey);
  return incidentioClient;
}

export function getIncidentioClient(): IncidentioClient {
  if (!incidentioClient) {
    throw new Error('incident.io client not initialized. Call initializeIncidentioClient first.');
  }
  return incidentioClient;
}

// Helper function to check if we're in browser and have API key
export function isIncidentioAvailable(): boolean {
  return browser && !!incidentioClient;
}