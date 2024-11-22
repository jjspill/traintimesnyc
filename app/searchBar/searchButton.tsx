export const SearchButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
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
