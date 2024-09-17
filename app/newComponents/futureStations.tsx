import React from 'react';
import {
  trainSymbolMap,
  UnknownTrainComponent,
} from '../trainHelpers/TrainComponents';
import { useFutureStops } from '../trainHelpers/TrainHooks';
import './futureStyle.css';
import stops from './stops.json';

interface StopsJson {
  [key: string]: string;
}

const stopsJson: StopsJson = stops;

interface FutureStationsProps {
  trip_id: string;
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

export const FutureStations: React.FC<FutureStationsProps> = ({ trip_id }) => {
  const stops = useFutureStops(trip_id);

  return (
    <div className="train-timeline-container">
      {stops.map((stop, index) => (
        <FutureStationStop
          stop={stop}
          index={index}
          key={stop.arrival_id}
          last={index === stops.length - 1}
        />
      ))}
    </div>
  );
};

const FutureStationStop: React.FC<{
  stop: FutureStop;
  index: number;
  last: boolean;
}> = ({ stop, index, last }) => {
  // Placeholder for JSON data or other mapping mechanism for stop details
  const stopName = (stopsJson[stop.stop_id] as string) || 'Unknown Stop';

  return (
    <div
      className="station-container"
      style={{ position: 'relative', width: '150px', height: '100px' }} // Fixed height for uniformity
    >
      {/* Stop information displayed centrally */}
      <div className="stop-info text-center">
        <div className="stop-details">
          <div className="stop-id">{stopName}</div>
          <div className="stop-arrival-time">{stop.arrival_time}</div>
        </div>
      </div>

      {/* Line connecting to the next stop, if not the last one */}
      {!last && (
        <div
          className="connector-line"
          style={{
            position: 'absolute',
            top: '50%',
            left: '100%', // Position the line to start right of the container
            width: '100px',
            height: '2px',
            backgroundColor: '#ccc',
          }}
        ></div>
      )}
    </div>
  );
};

export default FutureStationStop;
