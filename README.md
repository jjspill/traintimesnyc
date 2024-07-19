# Train Times NYC Frontend

## Overview

Train Times NYC leverages user geolocation to fetch real-time train arrivals from a PostgreSQL database. See [trains_gtfs_puller](https://github.com/jjspill/trains_gtfs_puller) for more information regarding backend GTFS data processing.

## File Structure

```bash
app
├── about 
│   └── page.tsx – About page
├── api
│   └── route.ts – API route for fetching train arrival times given a list of stations
├── trainHelpers
│   ├── ClientComponents.tsx – Components that are rendered on the client side
│   ├── TrainContainer.tsx – Container for TrainComponents on the client side
│   ├── TrainComponents.tsx - Components that are rendered on the server side
│   ├── TrainHooks.ts – Custom hooks for geolocation, calculating nearest stations, and fetching train data
│   └── trainHelper.ts – Helper functions
│   ├── stations.json
└── page.tsx – Main page, renders TrainContainer
```

## Key Components

1. **Geolocation Handling:**

   - Users' current locations are acquired via the frontend and are passed to the `useNearestStations` hook in order to determine the nearest stations within a radius.

2. **Data Fetching from Neon:**
   - Once the nearest stations are identified, each station creates an `AsyncStationComponent` which uses the `useStation` hook to the `/api` endpoint.  
   - The `/api` endpoint is responsible for fetching real-time train arrival data from the Neon database. Because of Neon's free tier not having read-only database capabilities, the route uses two fetches and returns the faster response. See the backend database schema for more information.
   - Data is fetched every 15 seconds and arrival times are updated accordingly, the `useContinuousCountdown` hook is responsible for incrementing the `refreshCounter` which is included in the `useStation` dependency array.

**Technologies Used:**

- **Next.js and React.js** for frontend logic, routing and hosting.
- **Neon Free-Tier Serverless Database** for real-time data storage and retrieval.

### Setup and Installation

1. **Environment Setup:**
   - Ensure Node.js is installed.
   - Clone the repository and install dependencies using `npm install`.

2. **Running Locally:**
   - Use `npm run` to run the application locally.
   - Ensure environmental variables for Neon database connections are set, the `.env` file should contain the following:

   ```bash
   DATABASE_URL=
   ```

### API Reference

- **Get Train Arrivals:**
    - **Endpoint:** `/api`
    - **Method:** `POST`
    - **Body Parameters:** `{ stops: [stations]}` where `stations` is an array of station ID's.
