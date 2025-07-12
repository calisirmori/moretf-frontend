interface LogsTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const LogsTabs: React.FC<LogsTabsProps> = ({ selectedTab, setSelectedTab }) => {
  const tabs = ["BOX SCORE", "CHARTS", "PLAY-BY-PLAY"];

  return (
    <div className="w-full">
      {/* Mobile dropdown */}
      <div className="block md:hidden mb-4">
        <select
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-warm-600 bg-light-200/60 dark:bg-warm-800/90 text-warm-800 dark:text-light-100"
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop tab buttons */}
      <div className="hidden md:grid grid-cols-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`py-2 text-center font-semibold transition border-b-2  
              ${
                selectedTab === tab
                  ? " text-warm-800 bg-light-200/60 dark:bg-warm-800/90 border-brand-orange dark:text-white  "
                  : "bg-light-200/60 dark:bg-warm-800/90 text-zinc-700 border-b-light-400 dark:text-light-200 dark:hover:text-light-50  dark:border-warm-600 hover:border-brand-orange dark:hover:border-brand-orange"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LogsTabs;
