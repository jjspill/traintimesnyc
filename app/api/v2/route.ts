import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL2!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stopIds } = body;

    const directionStopIds = stopIds.flatMap((stopId: string) => [
      `'${stopId}N'`,
      `'${stopId}S'`,
    ]);

    const data = await sql('SELECT * FROM arrivals WHERE stop_id = ANY($1)', [
      directionStopIds,
    ]);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response('Error fetching data', { status: 500 });
  }
}
