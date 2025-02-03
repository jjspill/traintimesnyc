import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEW_DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stopIds } = body;

    if (!stopIds || !Array.isArray(stopIds) || stopIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid stopIds array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate stop IDs for both directions
    const directionStopIds = stopIds.flatMap((stopId: string) => [
      `${stopId}N`,
      `${stopId}S`,
    ]);

    // Ensure SQL array syntax is correct
    const query = 'SELECT * FROM departures WHERE stopId = ANY($1)';
    const params = [directionStopIds];

    const data = await sql(query, params);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching data', details: error }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
