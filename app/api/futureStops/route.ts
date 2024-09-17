import { Train } from '@/app/trainHelpers/TrainComponents';
import { buildTrainData } from '@/app/trainHelpers/trainHelper';
import { neon } from '@neondatabase/serverless';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

const sql = neon(process.env.DATABASE_URL!);

// Utility to perform retries
async function retry<T>(
  operation: () => Promise<T>,
  retries: number,
  delay: number
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 1) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retry(operation, retries - 1, delay);
    } else {
      throw error;
    }
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { routeId } = body;

  const TIMEOUT_MS = 500; // Maximum delay for primary before checking secondary
  const RETRY_TIMES = 3;
  const RETRY_DELAY = 200;

  const fetchPrimary = () =>
    sql('SELECT * FROM arrivals WHERE trip_id = $1 ORDER BY arrival_time ASC', [
      routeId,
    ]).then((data) => ({ source: 'primary', data }));

  const fetchSecondary = () =>
    sql(
      'SELECT * FROM arrivals_secondary WHERE trip_id = $1 ORDER BY arrival_time ASC',
      [routeId]
    ).then((data) => ({ source: 'secondary', data }));

  let primaryResolved = false;
  let fallbackTimer: NodeJS.Timeout;

  const primaryPromise = retry(
    () =>
      new Promise(async (resolve, reject) => {
        try {
          const data = await fetchPrimary();
          primaryResolved = true;
          clearTimeout(fallbackTimer);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }),
    RETRY_TIMES,
    RETRY_DELAY
  );

  const fallbackPromise = new Promise((resolve) => {
    fallbackTimer = setTimeout(() => {
      if (!primaryResolved) {
        retry(fetchSecondary, RETRY_TIMES, RETRY_DELAY).then(resolve);
      }
    }, TIMEOUT_MS);
  });

  try {
    const result = (await Promise.race([primaryPromise, fallbackPromise])) as {
      source: string;
      data: Train[];
    };
    console.log('result');
    // const newTrainData = buildTrainData(result.data, stops);
    const stringify = JSON.stringify(result.data, null, 2);
    return new Response(stringify, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });
  } catch (error) {
    console.error('Error fetching data from database sources:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch train data',
        details: error,
      }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
      }
    );
  }
}
