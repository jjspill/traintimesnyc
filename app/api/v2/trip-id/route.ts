import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEW_DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tripIds } = body;

    if (!tripIds || !Array.isArray(tripIds) || tripIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid stopIds array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure SQL array syntax is correct
    const query = 'SELECT * FROM departures WHERE tripId = ANY($1)';
    const params = [tripIds];

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
