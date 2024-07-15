'use client';

import { useEffect, useState } from 'react';
import {
  InformationButton,
  RefreshSVG,
  TrainMenuBarProps,
} from './TrainComponents';

export const TrainMenuBarMobile: React.FC<TrainMenuBarProps> = ({
  refreshLocation,
  setSelectedFamily,
}) => {
  const [showBar, setShowBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      setIsStandalone(
        'standalone' in window.navigator &&
          window.navigator.standalone === true,
      );
    }
  }, []);

  const controlNavbar = () => {
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (
      (scrollY > lastScrollY && scrollY > 100) ||
      scrollY + innerHeight >= scrollHeight - 40
    ) {
      setShowBar(false);
    } else {
      setShowBar(true);
    }
    setLastScrollY(scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 w-full transition-transform duration-300 ${
        showBar ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div
        className={`w-full flex justify-center items-center bg-transparent ${
          isStandalone ? 'my-4' : 'my-1'
        } p-2`}
      >
        <button
          className="font-semibold"
          onClick={refreshLocation}
          title="Refresh"
        >
          <RefreshSVG />
        </button>
        {/* <FilterButton onSelectFamily={setSelectedFamily} /> */}
        <InformationButton />
      </div>
    </div>
  );
};
