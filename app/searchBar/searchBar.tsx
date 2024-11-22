import React, { useState, useEffect, useRef } from 'react';
import stations from './../trainHelpers/stations.json';
import { Station } from '@/app/trainHelpers/TrainComponents';
import { haversineDistance } from '@/app/trainHelpers/trainHelper';
import { Location } from '@/app/trainHelpers/TrainComponents';
import { set } from 'date-fns';

const StationSearch = (props: {
  currentLocation: Location;
  searchBarOpen: boolean;
  setNearestStations: (stations: Station[]) => void;
  setSearchLocation: (location: Location | null) => void;
}) => {
  const [query, setQuery] = useState('');
  const [rankedStation, setRankedStations] = useState<any[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showList, setShowList] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // console.log('current location', props.currentLocation);

  useEffect(() => {
    setRankedStations(rankStations(stations, props.currentLocation));
  }, []);

  useEffect(() => {
    if (query === (selectedStation as any)?.stop_name) {
      setShowList(false);
    } else {
      const newFilteredStations = rankedStation
        .filter((station) =>
          station.stop_name.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a.distance - b.distance);
      setFilteredStations(newFilteredStations);
      setShowList(true);
    }
  }, [query]);

  useEffect(() => {
    if (props.searchBarOpen && inputRef.current && !selectedStation) {
      inputRef.current.focus();
    }
  }, [props.searchBarOpen]);

  useEffect(() => {
    if (!props.searchBarOpen) {
      clearSearch();
      props.setNearestStations([]);
    }
  }),
    [props.searchBarOpen];

  const clearSearch = () => {
    setFilteredStations([]);
    setSelectedStation(null);
    setShowList(true);
    // props.setSearchLocation(null);
    props.setNearestStations([]);
  };

  const handleOnFocus = () => {
    console.log('on focus');
    setShowList(true);
    setQuery('');
  };

  const selectStation = (station: any) => {
    // console.log('selected station', station);
    setSelectedStation(station);
    setFilteredStations([]);
    setQuery(station.stop_name);
    props.setSearchLocation({
      lat: (station as any).stop_lat,
      lng: (station as any).stop_lon,
    });
    props.setNearestStations([]);
    setShowList(false);
  };

  return (
    <div
      style={{
        maxHeight: props.searchBarOpen ? '600px' : '0px',
        opacity: props.searchBarOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
      }}
      className="relative w-full px-4 pb-2"
    >
      <input
        ref={inputRef}
        className="relative w-full px-4 py-2 text-lg border-2 border-gray-300 rounded-lg transition-all duration-300 ease-in-out !outline-none"
        type="text"
        placeholder="Search for a station..."
        value={query}
        onFocus={() => handleOnFocus()}
        onChange={(e) => {
          const newQuery = e.target.value;
          setQuery(newQuery);
        }}
      />
      {showList && query.length > 0 && filteredStations.length > 0 && (
        <div className="w-full text-black p-2 max-h-[600px] overflow-auto bg-white rounded-lg z-100">
          <ul>
            {filteredStations.map((station, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => selectStation(station)}
              >
                {(station as any).stop_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default React.memo(StationSearch);

const rankStations = (stations: any[], currentLocation: any) => {
  if (!currentLocation) {
    // console.log("current location doesn't exist", currentLocation);
    console.error('No location found');
    return stations.map((station) => ({ ...station, distance: Infinity }));
  }

  const uniqueStations = new Map();

  stations.forEach((station) => {
    const distance = haversineDistance(
      parseFloat(currentLocation.lat),
      parseFloat(currentLocation.lng),
      parseFloat(station.stop_lat),
      parseFloat(station.stop_lon)
    );
    if (!uniqueStations.has(station.stop_name)) {
      // Check if station_name already added
      uniqueStations.set(station.stop_name, { ...station, distance });
    }
  });

  return Array.from(uniqueStations.values()).sort(
    (a, b) => a.distance - b.distance
  );
};
