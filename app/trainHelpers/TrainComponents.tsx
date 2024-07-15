import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useStation } from './TrainHooks';
import { getLineFamily } from './trainHelper';

export interface Location {
  lat: number;
  lng: number;
}

export interface Train {
  arrival_time: string;
  route_id: string;
  trip_id: string;
  stop_id: string;
  destination: string;
}

export interface Station {
  stopName: string;
  n_headsign: string;
  s_headsign: string;
  stopId: string;
  distance: number;
  n_trains: Train[] | null;
  s_trains: Train[] | null;
}

export interface ApiResponse {
  message: string;
  stops: Station[];
}

// suspense for stations
export const StationLoadingPlaceholder = () => (
  <div className="md:grid grid-cols-2 gap-x-4">
    {Array.from({ length: 2 }, (_, index) => (
      <div
        key={index}
        className="mb-4 p-2 border rounded-md shadow bg-gray-200 animate-pulse"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-full bg-gray-300 rounded h-6"></div>{' '}
          <div className="w-2/3 bg-gray-300 rounded h-4"></div>{' '}
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="w-full flex justify-between items-center"
            >
              <div className="bg-gray-300 rounded-full h-8 w-8"></div>{' '}
              <div className="bg-gray-300 rounded h-4 w-1/4"></div>{' '}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const TrainsLoadingPlaceholder = () => (
  <div className="mb-4 p-2 border rounded-md shadow bg-gray-200 animate-pulse">
    <div className="flex flex-col items-center space-y-2">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className={`w-full flex flex-row justify-between items-center ${
            index === 3 ? '' : 'border-b border-gray-300 pb-2'
          }`}
        >
          <div className="bg-gray-300 rounded-full h-8 w-8"></div>
          <div className="bg-gray-300 rounded h-4 w-1/4"></div>
        </div>
      ))}
    </div>
  </div>
);

// conjoined station header, for desktop view when stations are grouped horizontally
export const ConjoinedStationDetails = ({ station }: { station: Station }) => {
  return (
    <div className="mb-2 w-full font-sans">
      <div className="flex flex-col text-center text-xl font-semibold bg-black text-white p-2 rounded-md">
        <div className="flex flex-col justify-center items-center space-x-2">
          <div className="h-[2px] w-full bg-white"></div>
          <span>{station.stopName} Station</span>
          <div className="grid grid-cols-2 gap-x-4 w-full">
            <div className="flex items-center justify-center space-x-2">
              <span>{station.n_headsign}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>{station.s_headsign}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// station header for mobile, north and southbound stations are isolated
const StationDetailsComponent = ({
  stopName,
  headsign,
  trainLength, // if 0, return nothing
}: {
  stopName: string;
  headsign: string;
  trainLength: number | undefined;
}) => {
  if (trainLength === 0) {
    return;
  }

  return (
    <div className="flex flex-col text-center text-xl font-semibold font-sans bg-black text-white p-2 mb-2 rounded-md">
      <div className="h-[2px] w-full bg-white"></div>
      <span>{stopName} Station</span>
      <div className="flex items-center justify-center space-x-2">
        <span>{headsign}</span>
      </div>
    </div>
  );
};

interface StationProps {
  stationIn: Station;
  refreshCounter: number;
  selectedFamily: string;
}

// async station component, fetches train data for a single station
export const AsyncStationComponent: React.FC<StationProps> = ({
  stationIn,
  refreshCounter,
  selectedFamily,
}) => {
  const station = useStation(stationIn, refreshCounter);

  if (
    getLineFamily(stationIn.stopId) !== selectedFamily &&
    selectedFamily !== ''
  ) {
    console.log('stationIn.stopId', stationIn.stopId);
    console.log('selectedFamily', selectedFamily);
    return <></>;
  }
  if (station === undefined) {
    return (
      <div>
        <div className="block md:hidden">
          <StationDetailsComponent
            stopName={stationIn.stopName}
            headsign={stationIn.n_headsign}
            trainLength={undefined}
          />
          <TrainsLoadingPlaceholder />
        </div>
        <div className="hidden md:block">
          <ConjoinedStationDetails station={stationIn} />
          <div className="grid grid-cols-2 gap-x-4">
            <TrainsLoadingPlaceholder />
            <TrainsLoadingPlaceholder />
          </div>
        </div>
      </div>
    );
  }

  if (station?.n_trains?.length === 0 && station?.s_trains?.length === 0) {
    return (
      <div className="flex flex-col text-center text-xl font-semibold bg-black text-white p-2 rounded-md mb-2">
        <div className="h-[2px] w-full bg-white"></div>
        <span>{stationIn.stopName}</span>
        <div className="flex items-center justify-center space-x-2">
          <span>No trains available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="block md:hidden">
        <div>
          <StationDetailsComponent
            stopName={station.stopName}
            headsign={station.n_headsign}
            trainLength={station?.n_trains?.length}
          />
          {station.n_trains === null ? (
            <TrainsLoadingPlaceholder />
          ) : (
            <TrainComponent trains={station.n_trains} />
          )}
        </div>
        <div>
          <StationDetailsComponent
            stopName={station.stopName}
            headsign={station.s_headsign}
            trainLength={station?.s_trains?.length}
          />
          {station.s_trains === null ? (
            <TrainsLoadingPlaceholder />
          ) : (
            <TrainComponent trains={station.s_trains} />
          )}
        </div>
      </div>
      <div className="hidden md:block">
        <ConjoinedStationDetails station={station} />
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            {station.n_trains === null ? (
              <TrainsLoadingPlaceholder />
            ) : (
              <TrainComponent trains={station.n_trains} />
            )}
          </div>
          <div>
            {station.s_trains === null ? (
              <TrainsLoadingPlaceholder />
            ) : (
              <TrainComponent trains={station.s_trains} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TrainComponentProps {
  trains: Train[];
  // trainSymbolMap: { [key: string]: React.FC };
}

// train component, displays train data for a single station
export const TrainComponent: React.FC<TrainComponentProps> = ({ trains }) => {
  return trains.slice(0, 4).map((train, index) => {
    const TrainComponent = trainSymbolMap[train.route_id] || null;

    const isLastTrain = index === trains.length - 1 || index === 3;
    return (
      <div
        key={index}
        className={`flex justify-between items-center ${!isLastTrain && 'border-b border-black'} ${isLastTrain && 'pb-4'} py-2`}
      >
        <div className="flex items-center pl-1">
          {TrainComponent && (
            <div className="font-semibold">
              <TrainComponent />
            </div>
          )}
          {!TrainComponent && (
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
    );
  });
};

interface TrainMenuBarProps {
  refreshLocation: () => void;
  setSelectedFamily: (family: string) => void;
}

export const TrainMenuBar: React.FC<TrainMenuBarProps> = ({
  refreshLocation,
  setSelectedFamily,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full backdrop-filter backdrop-blur-sm">
      <div className="w-full flex justify-center items-center bg-transparent p-2">
        <button
          className="font-semibold"
          onClick={refreshLocation}
          title="Refresh"
        >
          <RefreshSVG />
        </button>
        <FilterButton onSelectFamily={setSelectedFamily} />
        <InformationButton />
      </div>
    </div>
  );
};

export const NComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-yellow-400  transition-all rounded-full">
    <div className="text-white text-2xl">N</div>
  </div>
);

export const QComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-yellow-400  transition-all rounded-full">
    <div className="text-white text-2xl">Q</div>
  </div>
);

export const RComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-yellow-400  transition-all rounded-full">
    <div className="text-white text-2xl">R</div>
  </div>
);

export const WComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-yellow-400  transition-all rounded-full">
    <div className="text-white text-2xl">W</div>
  </div>
);

export const BComponent: React.FC = () => (
  <div className="flex items-center justify-center  w-8 h-8 bg-orange-400  transition-all rounded-full">
    <div className="text-white text-2xl">B</div>
  </div>
);

export const DComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-orange-400  transition-all rounded-full">
    <div className="text-white text-2xl">D</div>
  </div>
);

export const FComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-orange-400  transition-all rounded-full">
    <div className="text-white text-2xl">F</div>
  </div>
);

export const MComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-orange-400  transition-all rounded-full">
    <div className="text-white text-2xl">M</div>
  </div>
);

export const OneComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-red-500  transition-all rounded-full">
    <div className="text-white text-2xl">1</div>
  </div>
);

export const TwoComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-red-500  transition-all rounded-full">
    <div className="text-white text-2xl">2</div>
  </div>
);

export const ThreeComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-red-500  transition-all rounded-full">
    <div className="text-white text-2xl">3</div>
  </div>
);

export const FourComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-green-600  transition-all rounded-full">
    <div className="text-white text-2xl">4</div>
  </div>
);

export const FiveComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-green-600  transition-all rounded-full">
    <div className="text-white text-2xl">5</div>
  </div>
);

export const SixComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-green-600  transition-all rounded-full">
    <div className="text-white text-2xl">6</div>
  </div>
);

export const AComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-cyan-400  transition-all rounded-full">
    <div className="text-white text-2xl">A</div>
  </div>
);

export const CComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-cyan-400  transition-all rounded-full">
    <div className="text-white text-2xl">C</div>
  </div>
);

export const EComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-cyan-400  transition-all rounded-full">
    <div className="text-white text-2xl">E</div>
  </div>
);

export const JComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-yellow-800  transition-all rounded-full">
    <div className="text-white text-2xl">J</div>
  </div>
);

export const ZComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-yellow-800  transition-all rounded-full">
    <div className="text-white text-2xl">Z</div>
  </div>
);

export const LComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-slate-400  transition-all rounded-full">
    <div className="text-white text-2xl">L</div>
  </div>
);

export const SComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-slate-400  transition-all rounded-full">
    <div className="text-white text-2xl">S</div>
  </div>
);

export const SevenComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-violet-400  transition-all rounded-full">
    <div className="text-white text-2xl">7</div>
  </div>
);

export const GComponent: React.FC = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-emerald-400  transition-all rounded-full">
    <div className="text-white text-2xl">G</div>
  </div>
);

export const UnknownTrainComponent: React.FC<{ routeId: string }> = ({
  routeId,
}) => (
  <div className="bg-slate-400 w-8 h-8 text-white rounded-full shadow-2xl flex justify-center items-center font-semibold">
    {routeId}
  </div>
);

// map of train symbols to components
export const trainSymbolMap: { [key: string]: React.FC } = {
  N: NComponent,
  Q: QComponent,
  R: RComponent,
  W: WComponent,
  B: BComponent,
  D: DComponent,
  F: FComponent,
  M: MComponent,
  '1': OneComponent,
  '2': TwoComponent,
  '3': ThreeComponent,
  '4': FourComponent,
  '5': FiveComponent,
  '6': SixComponent,
  A: AComponent,
  C: CComponent,
  E: EComponent,
  J: JComponent,
  Z: ZComponent,
  L: LComponent,
  S: SComponent,
  '7': SevenComponent,
  G: GComponent,
};

export const TrainSymbolsDisplay = ({
  side,
}: {
  side?: string | undefined;
}) => {
  const keys = Object.keys(trainSymbolMap);
  const middleIndex = Math.ceil(keys.length / 2);

  const LeftLogos = keys.slice(0, middleIndex).map((key) => {
    const TrainLogo = trainSymbolMap[key];
    return <TrainLogo key={key} />;
  });

  const RightLogos = keys.slice(middleIndex).map((key) => {
    const TrainLogo = trainSymbolMap[key];
    return <TrainLogo key={key} />;
  });

  if (side === 'left') {
    return <div className="flex items-center">{LeftLogos}</div>;
  } else if (side === 'right') {
    return <div className="flex items-center">{RightLogos}</div>;
  } else {
    return (
      <div className="flex space-x-1">
        <div className="flex items-center space-x-1">{LeftLogos}</div>
        <div className="flex items-center space-x-1">{RightLogos}</div>
      </div>
    );
  }
};

export const TrainCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Load and set the scroll position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('carouselScrollPosition');

    if (carouselRef.current && savedPosition) {
      const position = parseFloat(savedPosition);
      carouselRef.current.style.transform = `translateX(${position}px)`;
    }

    const saveCarouselState = () => {
      if (carouselRef.current) {
        const transformMatrix = window.getComputedStyle(
          carouselRef.current,
        ).transform;
        const matrixValues = transformMatrix.match(/matrix.*\((.+)\)/);
        const xPosition = matrixValues
          ? parseFloat(matrixValues[1].split(', ')[4])
          : 0;
        localStorage.setItem('carouselScrollPosition', xPosition.toString());
      }
    };

    window.addEventListener('beforeunload', saveCarouselState);
    return () => {
      window.removeEventListener('beforeunload', saveCarouselState);
    };
  }, []);

  const TrainComponents = [
    NComponent,
    QComponent,
    RComponent,
    WComponent,
    BComponent,
    DComponent,
    FComponent,
    MComponent,
    OneComponent,
    TwoComponent,
    ThreeComponent,
    FourComponent,
    FiveComponent,
    SixComponent,
    AComponent,
    CComponent,
    EComponent,
    JComponent,
    ZComponent,
    LComponent,
    SComponent,
    SevenComponent,
  ];

  return (
    <>
      <style>
        {`
          @keyframes scroll {
            from { transform: translateX(80%); }
            to { transform: translateX(-80%); }
          }
        `}
      </style>
      <div className="overflow-hidden pt-1">
        <div
          ref={carouselRef}
          className="flex space-x-4 whitespace-nowrap right-0"
          style={{ animation: 'scroll 30s linear infinite' }}
        >
          {TrainComponents.map((Component, index) => (
            <Component key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export const InformationButton: React.FC = () => {
  return (
    <Link
      href="/about"
      className="bg-black text-white font-bold rounded-md h-[40px] w-[40px] flex items-center justify-center ml-2"
    >
      <svg
        data-slot="icon"
        fill="none"
        strokeWidth="1.5"
        stroke="white"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width="28"
        height="28"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        ></path>
      </svg>
    </Link>
  );
};

const trainFamilyComponents: Record<string, React.FC[]> = {
  '7 Avenue': [OneComponent, TwoComponent, ThreeComponent],
  'Lexington Avenue': [FourComponent, FiveComponent, SixComponent],
  '8 Avenue': [AComponent, CComponent, EComponent],
  '6 Avenue': [BComponent, DComponent, FComponent, MComponent],
  Broadway: [NComponent, QComponent, RComponent, WComponent],
  Shuttle: [SComponent],
  '14 Street': [LComponent],
  'Nassau Street': [JComponent, ZComponent],
  Crosstown: [GComponent],
  Flushing: [SevenComponent],
};

const FilterSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="white"
      width="28"
      height="28"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
      />
    </svg>
  );
};

type FilterButtonProps = {
  onSelectFamily: (family: string) => void;
};

export const FilterButton: React.FC<FilterButtonProps> = ({
  onSelectFamily,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<string>('');

  const handleSelectFamily = (family: string) => {
    if (family === selectedFamily) {
      setSelectedFamily('');
      onSelectFamily('');
    } else {
      onSelectFamily(family);
      setSelectedFamily(family);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        title="Filter"
        className="bg-black text-white font-bold rounded-md h-[40px] w-[40px] flex items-center justify-center ml-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FilterSVG />
      </button>
      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded-lg w-48 z-10 border-4 border-black">
          {Object.keys(trainFamilyComponents).map((family, index, array) => (
            <div
              key={family}
              className={`flex flex-wrap justify-center items-center p-2 cursor-pointer ${index < array.length - 1 ? 'border-b border-gray-300' : ''} ${family === selectedFamily ? 'bg-gray-300' : ''}`}
              onClick={() => handleSelectFamily(family)}
            >
              {trainFamilyComponents[family].map((Component, idx) => (
                <Component key={idx} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RefreshSVG = () => {
  return (
    <div className="h-[40px] w-[40px] bg-black text-white flex items-center justify-center rounded-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        width="28"
        height="28"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </div>
  );
};
