import React from 'react';
import { useFutureStops } from '../trainHelpers/TrainHooks';
import './futureStyle.css'; // Ensure any additional global styles are maintained here
import stops from './stops.json';

interface StopsJson {
  [key: string]: string;
}

const stopsJson: StopsJson = stops;

interface FutureStationsProps {
  trip_id: string;
  stop_id: string;
}

export interface FutureStop {
  arrival_id: number;
  arrival_time: string;
  destination: string;
  route_id: string;
  stop_id: string;
  timeDiffInSeconds: number;
  trip_id: string;
}

export const FutureStations: React.FC<FutureStationsProps> = ({
  trip_id,
  stop_id,
}) => {
  const stops = useFutureStops(trip_id);
  const currentStopIndex = stops.findIndex((stop) => stop.stop_id === stop_id);
  // console.log('currentStopIndex', currentStopIndex);
  console.log('stop id', stop_id);
  // console.log('current stop index', currentStopIndex);
  // const stopsToShow = stops.slice(currentStopIndex + 1);

  return (
    <div className="relative w-full h-full">
      {/* <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-400 z-0"></div> */}
      <div className="flex w-full h-full overflow-x-auto pl-10 pt-3 space-x-10">
        {stops.length > 0 ? (
          stops.map((stop, index) => (
            <FutureStationStop
              stop={stop}
              index={index}
              key={stop.arrival_id}
            />
          ))
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            No further stops.
          </div>
        )}
      </div>
    </div>
  );
};

const FutureStationStop: React.FC<{
  stop: FutureStop;
  index: number;
}> = ({ stop, index }) => {
  const stopName = (stopsJson[stop.stop_id] as string) || stop.stop_id;
  // const arrivalTime = new Date(stop.arrival_time).toLocaleTimeString('en-US', {
  //   hour: '2-digit',
  //   minute: '2-digit',
  // });

  // console.log('stop', stop);
  // console.log('stopName', stopName);

  return (
    <div className="flex flex-col min-w-[100px] w-full items-center">
      <div className="flex flex-col h-20 text-xs text-center font-semibold font-sans bg-black text-white p-2 mb-2 rounded-md">
        <span>{stopName} Station</span>
        <span className="text-gray-300 text-xs mt-1 pb-4">
          {stop.arrival_time}
        </span>
      </div>
    </div>
  );
};

export default FutureStations;
