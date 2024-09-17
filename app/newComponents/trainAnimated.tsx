import { useEffect, useRef, useState } from 'react';
import {
  TrainComponentProps,
  trainSymbolMap,
  UnknownTrainComponent,
} from '../trainHelpers/TrainComponents';
import './trainStyle.css';
import { FutureStations } from './futureStations';

// train component, displays train data for a single station
export const TrainStatusComponent: React.FC<TrainComponentProps> = ({
  trains,
}) => {
  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(trains.length).fill(false)
  );
  const trainRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    trainRefs.current = trainRefs.current.slice(0, trains.length);
  }, [trains]);

  // Toggle function for each train
  const toggleOpened = (index: number) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };

  return trains.slice(0, 4).map((train, index) => {
    const TrainSymbol = trainSymbolMap[train.route_id] || null;
    const isOpen = openStates[index];

    const isLastTrain = index === trains.length - 1 || index === 3;
    return (
      <button
        key={index}
        id={`train-button-${index}`}
        ref={(el) => {
          trainRefs.current[index] = el;
        }}
        className="train-button pulse-animation"
        onClick={() => toggleOpened(index)}
      >
        <div className={`train-detail ${isOpen ? 'open' : ''}`}>
          <div
            className={`flex justify-between items-center w-full ${
              !isLastTrain && 'border-b border-black'
            } ${isLastTrain && 'pb-4'} py-2`}
          >
            <div className="flex items-center pl-1">
              {TrainSymbol && (
                <div className="font-semibold">
                  <TrainSymbol />
                </div>
              )}
              {!TrainSymbol && (
                <UnknownTrainComponent routeId={train.route_id} />
              )}
              <div className="pl-2 text-sm">{train.destination}</div>
            </div>
            <div className="pr-1">
              <span
                className={`${
                  train.arrival_time === 'arriving'
                    ? 'text-black' // Deeper red with white text
                    : train.arrival_time.includes('minute') &&
                      parseInt(train.arrival_time.split(' ')[0], 10) < 5
                    ? 'text-black' // Changed to a darker orange for visibility
                    : 'text-black' // A dark teal for general cases
                } py-1 px-3 rounded-full text-sm`}
              >
                {train.arrival_time}
              </span>
            </div>
          </div>
          {isOpen && <FutureStations trip_id={train.trip_id} />}
        </div>
      </button>
    );
  });
};
