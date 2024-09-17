import { useState, useEffect, useCallback } from 'react';

import { Location, Station } from './TrainComponents';
import {
  filterStops,
  findClosestStations,
  fixArrivalTime,
  fixTime,
  processTrains,
  sortSubwayStops,
} from './trainHelper';
import { FutureStop } from '../newComponents/futureStations';

export interface Stop {
  stopId: string;
  stopName: string;
  distance: number;
  n_headsign: string;
  s_headsign: string;
}

const LOCATION_EXPIRY_TIME = 0.25 * 60 * 1000; // 15 seconds
export const GRAND_CENTRAL = { lat: 40.7527, lng: -73.9772 };

function getSavedLocation() {
  const saved = localStorage.getItem('userLocation');
  if (saved) {
    const parsed = JSON.parse(saved);
    const currentTime = new Date().getTime();
    const isRecent = currentTime - parsed.timestamp < LOCATION_EXPIRY_TIME;
    if (isRecent) {
      return parsed.location; // Ensure you are returning the location part correctly
    }
  }
  return null;
}

function saveLocation(location: any) {
  const data = {
    location,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem('userLocation', JSON.stringify(data));
}

export const useGeolocationWithCache = (
  setSearchRadius: React.Dispatch<React.SetStateAction<number | string>>
) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [status, setStatus] = useState('ACQUIRING');

  const getLocation = useCallback((bypassCache = false) => {
    if (!bypassCache) {
      const cachedLocation = getSavedLocation();
      if (cachedLocation) {
        setLocation(cachedLocation);
        setStatus('FOUND');
        return;
      }
    }

    setLocation(null);
    setSearchRadius(0.5);
    if ('geolocation' in navigator) {
      setStatus('ACQUIRING');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          saveLocation(newLocation);
          setLocation(newLocation);
          setStatus('FOUND');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setStatus('NOT_FOUND');
        }
      );
    } else {
      console.error('Geolocation is not available.');
      setStatus('NOT_FOUND');
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    location,
    locationStatus: status,
    refreshLocation: () => getLocation(true),
  };
};

export const useNearestStations = (
  location: Location | null,
  searchRadius: string | number,
  selectedFamily: string
) => {
  const [nearestStations, setNearestStations] = useState<Station[]>([]);

  if (searchRadius === 'Demo') {
    location = GRAND_CENTRAL;
    searchRadius = 0.25;
  }

  useEffect(() => {
    const findNearestStations = async () => {
      if (!location || !searchRadius) return;
      try {
        const closestStations = findClosestStations(
          location.lat,
          location.lng,
          searchRadius as number
        );
        const sortedStations = sortSubwayStops(closestStations);

        setNearestStations(sortedStations);
      } catch (error) {
        console.error('Error finding nearest stations: ', error);
      }
    };

    findNearestStations();
  }, [location, searchRadius]);

  return { nearestStations };
};

export const useStation = (station: Station, refreshCounter: number) => {
  const [stop, setStop] = useState<Station>();

  useEffect(() => {
    const fetchStop = async () => {
      if (!station || station === undefined) return;
      try {
        const response = await fetch(`https://www.traintimes.nyc/api`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stops: [station] }),
          next: {
            revalidate: 15,
          },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        fixArrivalTime(data);
        setStop(data);
      } catch (error) {
        console.error('Failed to fetch stop:', error);
        setStop(station);
      }
    };

    fetchStop();
  }, [station.stopName, refreshCounter]);

  return stop;
};

export const useContinuousCountdown = () => {
  const duration = 15;
  const [timer, setTimer] = useState(duration);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          setRefreshCounter((prevCounter) => prevCounter + 1);
          return duration;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { timer, refreshCounter };
};

export const useFutureStops = (routeId: string) => {
  const [futureStops, setFutureStops] = useState<FutureStop[]>([]);

  useEffect(() => {
    const fetchFutureStops = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/futureStops`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ routeId }),
          next: {
            revalidate: 15,
          },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const fixedData = fixTime(data);
        setFutureStops(fixedData);
      } catch (error) {
        console.error('Failed to fetch future stops:', error);
      }
    };

    fetchFutureStops();
  }, [routeId]);

  return futureStops;
};
