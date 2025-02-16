import { cleanAlertEntities, organizeAlertsByRoute } from './helpers';

const ALERT_JSON_FEED =
  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json';

export const revalidate = 60; // Cache at Next.js level for 60 seconds
export const dynamic = 'auto'; // Let Next.js decide (static or dynamic)

export async function GET(request: Request) {
  const response = await fetch(ALERT_JSON_FEED, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
    cache: 'force-cache', // Cache on Vercel’s edge
  });

  const data = await response.json();
  const cleanedAlerts = organizeAlertsByRoute(
    cleanAlertEntities(data.entity, data.header)
  );

  return new Response(JSON.stringify(cleanedAlerts, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
