import { browser } from '$app/environment';

// Initialize the incident.io client when in browser
export function initializeIncidentIo() {
  if (browser) {
    // Dynamic import to avoid SSR issues
    import('./services/incidentio').then(({ initializeIncidentioClient }) => {
      initializeIncidentioClient();
    });
  }
}