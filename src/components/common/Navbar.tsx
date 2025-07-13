import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useMatchesWindow } from "../../hooks/useMatchesWindow";
import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { data, isLoading } = useMatchesWindow();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.toISOString().slice(0, 10);
  });

  const scrollByCard = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 144 + 8; // w-36 + gap
    container.scrollBy({
      left: direction === "right" ? cardWidth * 2 : -cardWidth * 2,
      behavior: "smooth",
    });
  };

  const formatLocalTime = (timestamp: number): string => {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: undefined, // auto-detect 12/24 based on user's locale
    }).format(new Date(timestamp * 1000));
  };

  const selectedStart = new Date(selectedDate);
  const selectedEnd = new Date(selectedStart);
  selectedEnd.setDate(selectedEnd.getDate() + 1);
  const selectedStartTs = Math.floor(selectedStart.getTime() / 1000);
  const selectedEndTs = Math.floor(selectedEnd.getTime() / 1000);
  const nowTs = Math.floor(Date.now() / 1000);

  const filteredMatches = data
    ?.filter((match: any) => {
      return (
        match.date_played >= selectedStartTs &&
        match.date_played < selectedEndTs
      );
    })
    .sort((a: any, b: any) => {
      if (a.isforfeit && !b.isforfeit) return 1;
      if (!a.isforfeit && b.isforfeit) return -1;
      return a.date_played - b.date_played;
    });

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Sample Log", path: "/log/3885556" },
  ];

  return (
    <nav className="bg-light-200 dark:bg-warm-800 text-black dark:text-white shadow-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🧠 LogsApp</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-xs px-2 py-1 bg-zinc-700 rounded hover:bg-zinc-600 transition"
          >
            {isDark ? "🌙 Dark" : "☀️ Light"}
          </button>
          <ul className="flex space-x-4 items-center">
            {navItems.map(({ name, path }) => (
              <li key={name}>
                <Link
                  to={path}
                  className={`hover:text-amber-500 dark:hover:text-amber-400 transition ${
                    pathname === path
                      ? "text-amber-500 dark:text-amber-400 font-semibold"
                      : ""
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Match Ticker */}
      <div className="bg-light-300 dark:bg-warm-900 text-white border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto flex items-center px-6 py-2 relative">
          {/* Date Picker */}
          <div className="mr-4 shrink-0">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-light-300 dark:bg-warm-800 text-warm-500 dark:text-light-100 text-xs px-2 py-1 rounded border border-light-600 dark:border-warm-600 focus:outline-none"
            />
          </div>

          {/* Left Arrow */}
          <button
            className="group mr-3 p-1 bg-light-300 dark:bg-warm-700 rounded-full hover:bg-light-200 border-2 border-light-700 dark:border-warm-600 hover:border-light-800 dark:hover:border-brand-orange transition"
            onClick={() => scrollByCard("left")}
          >
            <ChevronLeftIcon className="h-4 w-4 text-light-700 group-hover:text-light-800 dark:group-hover:text-brand-orange" />
          </button>

          {/* Match Cards */}
          <div
            className="flex-1 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
            ref={scrollRef}
          >
            <div className="flex gap-2 w-max px-8">
              {isLoading ? (
                <span className="text-sm">Loading matches...</span>
              ) : filteredMatches?.length === 0 ? (
                <span className="text-sm text-gray-300">No matches</span>
              ) : (
                filteredMatches.map((match: any) => {
                  const isLive = Math.abs(nowTs - match.date_played) < 1800; // within 30 mins
                  const matchUrl = `/match/${match.matchid}`;

                  return (
                    <Link
                      to={matchUrl}
                      key={match.matchid}
                      className="snap-start shrink-0 w-44 bg-light-200 dark:bg-warm-500 rounded px-2 py-1 text-xs hover:opacity-90 transition group relative border border-light-300 dark:border-warm-600 hover:border-brand-orange dark:hover:border-brand-orange"
                    >
                      {isLive && (
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 py-px rounded-full font-bold">
                          LIVE
                        </div>
                      )}

                      <div
                        className="font-semibold text-warm-500 dark:text-light-100 truncate"
                        title={`${match.team1_teamname} vs ${match.team2_teamname}`}
                      >
                        {match.team1_tag} vs {match.team2_tag}
                      </div>

                      <div className="absolute text-xs top-1 right-1 text-warm-300 dark:text-light-200 ">
                        {formatLocalTime(match.date_played)}
                      </div>

                      <div className="absolute text-xs bottom-1 right-1 text-warm-300 dark:text-light-200 flex items-center gap-1">
                        {match.league.toLowerCase() === "etf2l" ? (
                          <img
                            src={
                              isDark
                                ? "/websiteLogos/etf2l-white.png"
                                : "/websiteLogos/etf2l-dark.png"
                            }
                            alt="ETF2L"
                            className="w-3 h-3"
                          />
                        ) : (
                          <img
                            src={`/websiteLogos/${match.league.toLowerCase()}.png`}
                            alt={match.league}
                            className="w-3 h-3"
                          />
                        )}

                      </div>

                      <div
                        className="text-warm-400 dark:text-light-300 truncate"
                        title={match.match_name}
                      >
                        {match.match_name}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            className="group ml-3 p-1 bg-light-300 dark:bg-warm-700 rounded-full hover:bg-light-200 border-2 border-light-700 dark:border-warm-600 hover:border-light-800 dark:hover:border-brand-orange transition"
            onClick={() => scrollByCard("right")}
          >
            <ChevronRightIcon className="h-4 w-4 text-light-700 group-hover:text-light-800 dark:group-hover:text-brand-orange" />
          </button>
        </div>
      </div>
    </nav>
  );
}
