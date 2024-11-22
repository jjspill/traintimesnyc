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
  setSearchBarStatus,
}) => {
  const [showBar, setShowBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      setIsStandalone(
        'standalone' in window.navigator && window.navigator.standalone === true
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
        className={`w-full flex justify-center items-center bg-transparent space-x-2 pb-2 ${
          isStandalone ? 'my-4' : 'my-1'
        }`}
      >
        <button
          className="font-semibold"
          onClick={refreshLocation}
          title="Refresh"
        >
          <RefreshSVG />
        </button>
        <SearchButton onClick={setSearchBarStatus} />
        {/* <FilterButton onSelectFamily={setSelectedFamily} /> */}
        <InformationButton />
      </div>
    </div>
  );
};

const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="font-semibold" onClick={onClick} title="Search">
      <SearchSVG />
    </button>
  );
};

const SearchSVG: React.FC = () => {
  return (
    <div className="h-[40px] w-[40px] bg-black text-white flex items-center justify-center rounded-md">
      <svg
        fill="none"
        height="28"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        width="28"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" x2="16.65" y1="21" y2="16.65" />
      </svg>
    </div>
  );
};
