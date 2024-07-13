// components/LocationPrompt.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  TrainMenuBar,
  Location,
  TrainSymbolsDisplay,
  TrainCarousel,
  AsyncStationComponent,
  InformationButton,
} from './TrainComponents';
import {
  useContinuousCountdown,
  useGeolocationWithCache,
  useNearestStations,
} from './TrainHooks';

const TrainsContainer: React.FC = () => {
  const [searchRadius, setSearchRadius] = useState<string | number>(0.5);

  // hooks
  const { timer, refreshCounter } = useContinuousCountdown();
  const { location, locationStatus, refreshLocation } =
    useGeolocationWithCache(setSearchRadius);
  const { nearestStations } = useNearestStations(location, searchRadius);

  console.log('nearestStations', nearestStations);

  return (
    <div className="flex justify-center items-start md:py-4 md:px-4">
      <div className="min-h-[100vh] md:min-h-[90vh] bg-white shadow-xl md:rounded-3xl overflow-hidden w-full max-w-4xl">
        <div className="relative flex flex-col justify-center items-center w-full min-h-20 h-fit bg-black text-center font-semibold text-white py-2 font-sans">
          <div className="min-h-[2px] w-[90%] md:w-[80%] bg-white"></div>
          <div className="flex">
            <div className="text-4xl px-4">Subway</div>
          </div>
          <div className="block md:hidden">
            <TrainCarousel />
          </div>
          <div className="hidden md:block">
            <TrainSymbolsDisplay />
          </div>
        </div>
        <TrainMenuBar refreshLocation={refreshLocation} />
        <div className="w-full p-4 py-0">
          {searchRadius === 'Demo' && (
            <div className="text-center text-gray-500 pb-4">
              Using demo location, Grand Central Terminal with a 0.25 mile
              radius.
            </div>
          )}
          {locationStatus === 'ACQUIRING' && (
            <div className="text-center text-gray-500">
              Acquiring location, please hold on...
            </div>
          )}
          {locationStatus === 'NOT_FOUND' && searchRadius !== 'Demo' && (
            <div className="flex flex-col items-center justify-center">
              <div className="text-center text-gray-500">
                Location not found. Please enable location services.
              </div>
              <button
                type="button"
                title="Try Demo Location"
                onClick={() => setSearchRadius('Demo')}
                className="p-2 m-4 bg-black text-white rounded-md my-2 w-fit"
              >
                Try Demo Location
              </button>
            </div>
          )}
          {(locationStatus === 'FOUND' || searchRadius === 'Demo') &&
            nearestStations.length > 0 && (
              <>
                {nearestStations.map((station, index) => (
                  <AsyncStationComponent
                    key={index}
                    stationIn={station}
                    refreshCounter={refreshCounter}
                  />
                ))}
                <div className="flex flex items-center justify-center">
                  <button
                    type="button"
                    title="Search within 1 mile radius"
                    onClick={() => setSearchRadius(1)}
                    className="p-2 bg-black text-white rounded-md my-2 w-fit"
                    style={{
                      visibility: searchRadius === 0.5 ? 'visible' : 'hidden',
                    }}
                  >
                    Expand Search Radius to 1 Mile
                  </button>
                </div>
              </>
            )}
          {locationStatus === 'FOUND' && nearestStations.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <div className="text-center text-gray-500">
                No nearby stations found.
              </div>
              <button
                type="button"
                title="Try Demo Location"
                onClick={() => setSearchRadius('Demo')}
                className="p-2 m-4 bg-black text-white rounded-md my-2 w-fit"
              >
                Try Demo Location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainsContainer;
