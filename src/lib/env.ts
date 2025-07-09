import { browser } from '$app/environment';

// Environment variables for incident.io integration
export const INCIDENT_IO_API_KEY = 'inc_c8a03b882cc3f155cf6d452f094ea07297692b0f604ba443e571b11be51a8a63';
export const INCIDENT_IO_BASE_URL = 'https://api.incident.io';

// Initialize the incident.io client when in browser
export function initializeIncidentIo() {
  if (browser) {
    // Dynamic import to avoid SSR issues
    import('./services/incidentio').then(({ initializeIncidentioClient }) => {
      initializeIncidentioClient(INCIDENT_IO_API_KEY);
    });
  }
}