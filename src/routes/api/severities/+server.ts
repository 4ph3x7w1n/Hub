import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_KEY = 'inc_c8a03b882cc3f155cf6d452f094ea07297692b0f604ba443e571b11be51a8a63';
const BASE_URL = 'https://api.incident.io';

export const GET: RequestHandler = async () => {
  try {
    // Make request to incident.io API
    const response = await fetch(`${BASE_URL}/v1/severities`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('incident.io API error:', response.status, response.statusText);
      return json(
        { error: 'Failed to fetch severities', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the data with proper headers
    return json(data, {
      headers: {
        'Cache-Control': 'max-age=3600', // Cache for 1 hour (severities don't change often)
      },
    });
  } catch (error) {
    console.error('Error fetching severities:', error);
    return json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};