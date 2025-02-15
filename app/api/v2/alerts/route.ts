import { cleanAlertEntities } from './helpers';

const ALERT_JSON_FEED =
  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json';

export const revalidate = 60; // Cache for 60 seconds (1 minute)

export async function GET(request: Request) {
  try {
    console.log('Fetching MTA alerts...');
    const response = await fetch(ALERT_JSON_FEED);
    console.log('Response:', response.status);

    if (!response.ok) {
      throw new Error(`MTA API error: ${response.status}`);
    }

    const data = await response.json();
    const cleanedAlerts = cleanAlertEntities(data.entity, data.header);

    return new Response(JSON.stringify(cleanedAlerts, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching MTA alerts:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch and process MTA alerts' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
