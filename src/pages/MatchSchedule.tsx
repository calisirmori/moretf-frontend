import { useMatchesWindow } from "../hooks/useMatchesWindow";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  subMonths,
  addMonths,
} from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import type { Match } from "../types/Match";

export default function MatchSchedule() {
  const { data, isLoading } = useMatchesWindow();
  const today = new Date();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [leagueFilters, setLeagueFilters] = useState<string[]>([
    "etf2l",
    "rgl",
    "ozf",
  ]);
  const [formatFilters, setFormatFilters] = useState<string[]>(["HL", "6s"]);
  const [showOnlyTopDivs, setShowOnlyTopDivs] = useState(false);

  const topDivisions = ["prem", "invite", "advanced"]; // lowercase compare

  const calendarRef = useRef<HTMLDivElement | null>(null);
  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isCalendarOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  const selectedStart = new Date(selectedDate);
  selectedStart.setHours(0, 0, 0, 0);
  const selectedEnd = addDays(selectedStart, 1);

  const selectedStartTs = Math.floor(selectedStart.getTime() / 1000);
  const selectedEndTs = Math.floor(selectedEnd.getTime() / 1000);
  const nowTs = Math.floor(Date.now() / 1000);

  const matches = data as Match[];

  const filteredMatches = matches
    ?.filter((match: Match) => {
      const matchDate = match.date_played;
      const inSelectedDay =
        matchDate >= selectedStartTs && matchDate < selectedEndTs;

      const leagueOk = leagueFilters.includes(match.league.toLowerCase());
      const formatOk =
        formatFilters.includes(match.format) || match.format === null;
      const divisionOk =
        !showOnlyTopDivs ||
        topDivisions.includes(match.division?.toLowerCase());

      return inSelectedDay && leagueOk && formatOk && divisionOk;
    })
    .sort((a, b) => {
      if (a.isforfeit && !b.isforfeit) return 1;
      if (!a.isforfeit && b.isforfeit) return -1;
      return a.date_played - b.date_played;
    });

  const formatLocalTime = (timestamp: number): string =>
    new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(timestamp * 1000));

  const gameCountsByDate: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {};
    matches?.forEach((match) => {
      const dayStr = new Date(match.date_played * 1000)
        .toISOString()
        .slice(0, 10);
      counts[dayStr] = (counts[dayStr] || 0) + 1;
    });
    return counts;
  }, [matches]);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let current = gridStart;
  while (current <= gridEnd) {
    days.push(current);
    current = addDays(current, 1);
  }
  console.log(filteredMatches);
  return (
    <div className="w-full min-h-screen bg-light-50 dark:bg-warm-700 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-light-200 dark:bg-warm-800 w-full flex items-center justify-center relative">
          <button
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className="absolute left-0 font-bold ml-10 text-warm-600 dark:text-light-300 w-fit text-center flex justify-center items-center gap-1"
          >
            {format(selectedDate, "MMMM yyyy")}
            <CalendarIcon className="w-4 h-4 ml-5" />
            {isCalendarOpen ? (
              <ChevronUpIcon className="w-2 h-2" />
            ) : (
              <ChevronDownIcon className="w-2 h-2" />
            )}
          </button>
          {isCalendarOpen && (
            <div
              ref={calendarRef}
              className="absolute border border-warm-400/50 z-10 top-14 left-0 p-2 bg-light-200 dark:bg-warm-800 rounded-sm flex-col justify-center items-center w-fit"
            >
              <div className="flex justify-center items-center gap-2 w-full mb-2">
                <button
                  onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                  className="p-2 dark:hover:bg-warm-400 hover:bg-light-800 rounded"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-warm-600 dark:text-light-300" />
                </button>
                <h2 className="font-bold text-warm-600 dark:text-light-300 w-32 text-center">
                  {format(selectedDate, "MMMM yyyy")}
                </h2>
                <button
                  onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                  className="p-2 dark:hover:bg-warm-400 hover:bg-light-800 rounded"
                >
                  <ChevronRightIcon className="w-4 h-4 text-warm-600 dark:text-light-300" />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="absolute right-3 top-3 text-xs px-3 py-1 rounded bg-light-500 dark:bg-warm-500 hover:bg-light-300 dark:hover:bg-warm-600 border border-warm-500 hover:border-brand-orange text-warm-700 dark:text-light-200"
                >
                  Today
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-xs text-warm-600 dark:text-light-200 mb-1 w-fit">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="py-1 font-semibold w-[50px]">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-light-600/40 dark:bg-warm-500 rounded overflow-hidden w-fit text-sm">
                {days.map((day) => {
                  const dayStr = day.toISOString().slice(0, 10);
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isToday = isSameDay(day, today);
                  const isSelected = isSameDay(day, selectedDate);
                  const count = gameCountsByDate[dayStr] || 0;

                  return (
                    <button
                      key={dayStr}
                      onClick={() => setSelectedDate(day)}
                      className={`flex flex-col items-center relative justify-start p-2 h-[50px] w-[50px] ${
                        isSelected
                          ? "bg-warm-500 dark:bg-light-300 text-light-300 dark:text-warm-800"
                          : isCurrentMonth
                          ? "bg-light-200 dark:bg-warm-800 text-warm-700 dark:text-light-200"
                          : "bg-light-400 dark:bg-warm-900 text-light-800 dark:text-warm-200"
                      }`}
                    >
                      <div
                        className={`text-xs absolute left-1 top-1 ${
                          isToday ? "text-brand-orange" : ""
                        }`}
                      >
                        {day.getDate()}
                      </div>
                      {count > 0 && (
                        <div
                          className={`text-xs mt-1 ${
                            isSelected
                              ? "text-light-200 dark:text-warm-800"
                              : "dark:text-light-600 text-light-900"
                          }`}
                        >
                          {count} GAMES
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="font-bold text-warm-600 dark:text-light-300 w-fit text-center flex justify-center items-center">
            <ChevronLeftIcon
              className="h-5 w-5 cursor-pointer dark:hover:text-brand-orange hover:text-brand-orange"
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            />
            <div className="flex">
              {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                const day = addDays(selectedDate, offset);
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(day, selectedDate);

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`w-10 pt-3 pb-2 px-2 border-b-2 cursor-pointer select-none  
                        ${
                          isSelected
                            ? "border-brand-orange"
                            : "border-transparent"
                        }
                        hover:border-brand-orange`}
                  >
                    <div
                      className={`text-xs font-light text-center ${
                        isToday ? "text-brand-orange" : ""
                      }`}
                    >
                      {format(day, "EEE")}
                    </div>
                    <div
                      className={`text-xl -mt-1 text-center ${
                        isToday ? "text-brand-orange" : ""
                      }`}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
            <ChevronRightIcon
              className="h-5 w-5 cursor-pointer dark:hover:text-brand-orange hover:text-brand-orange"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            />
          </div>

          <div className="absolute right-4 top-0 h-full flex justify-center items-center gap-2 text-xs text-warm-700 dark:text-light-200">
            <div className="flex-col items-center">
              <div className="flex justify-center items-center  gap-5 text-warm-700 dark:text-warm-300">
                {/* Website Checkboxes */}
                <div className="flex gap-3 items-center">
                  {["etf2l", "rgl", "ozf"].map((site) => (
                    <label
                      key={site}
                      className="relative cursor-pointer flex items-center gap-1"
                    >
                      <input
                        type="checkbox"
                        className="peer hidden"
                        checked={leagueFilters.includes(site)}
                        onChange={() =>
                          setLeagueFilters((prev) =>
                            prev.includes(site)
                              ? prev.filter((s) => s !== site)
                              : [...prev, site]
                          )
                        }
                      />
                      <div className="w-4 h-4 border-2 border-light-400 dark:border-warm-600 rounded-sm peer-checked:bg-brand-orange flex items-center justify-center">
                        <div className="w-2 h-2 bg-white hidden peer-checked:block"></div>
                      </div>
                      <img
                        src={`/websiteLogos/${site}.png`}
                        alt={site}
                        className="w-5 h-5 object-contain shadow p-0.5 bg-warm-800/90"
                      />
                    </label>
                  ))}
                </div>
                |{/* HL / 6s Checkboxes */}
                <div className="flex gap-3 items-center text-warm-700 dark:text-light-300 font-semibold">
                  {["HL", "6s"].map((label) => (
                    <label
                      key={label}
                      className="relative cursor-pointer flex items-center gap-1"
                    >
                      <input
                        type="checkbox"
                        className="peer hidden"
                        checked={formatFilters.includes(label)}
                        onChange={() =>
                          setFormatFilters((prev) =>
                            prev.includes(label)
                              ? prev.filter((f) => f !== label)
                              : [...prev, label]
                          )
                        }
                      />
                      <div className="w-4 h-4 border-2 border-light-400 dark:border-warm-600 rounded-sm peer-checked:bg-brand-orange flex items-center justify-center">
                        <div className="w-2 h-2 bg-white hidden peer-checked:block"></div>
                      </div>
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Division Radios */}
              <div className="flex gap-6 items-center justify-end mt-1.5">
                {["All Divs", "Top Divs"].map((label) => {
                  const isTop = label === "Top Divs";
                  return (
                    <label
                      key={label}
                      className="relative cursor-pointer flex items-center gap-1"
                    >
                      <input
                        type="radio"
                        name="division"
                        className="peer hidden"
                        checked={showOnlyTopDivs === isTop}
                        onChange={() => setShowOnlyTopDivs(isTop)}
                      />
                      <div className="w-4 h-4 border-2 border-light-400 dark:border-warm-600 rounded-full flex items-center justify-center peer-checked:border-brand-orange">
                        <div className="w-2 h-2 bg-brand-orange rounded-full hidden peer-checked:block"></div>
                      </div>
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : filteredMatches?.length === 0 ? (
            <p className="text-gray-400">No matches scheduled for this day.</p>
          ) : (
            <div className="space-y-2">
              {filteredMatches.map((match: Match) => {
                const isLive = Math.abs(nowTs - match.date_played) < 1800;
                const timeLabel = match.isforfeit
                  ? "Forfeit"
                  : isLive
                  ? "LIVE"
                  : formatLocalTime(match.date_played);

                const league = match.league.toLowerCase();
                const leagueLogo =
                  league === "etf2l"
                    ? `/websiteLogos/etf2l-${
                        window.matchMedia("(prefers-color-scheme: dark)")
                          .matches
                          ? "white"
                          : "dark"
                      }.png`
                    : `/websiteLogos/${league}.png`;

                return (
                  <a
                    key={match.matchid}
                    href={`/match/${match.matchid}`}
                    className="bg-light-200 relative border border-transparent hover:border-brand-orange cursor-pointer dark:bg-warm-800 shadow rounded p-4 flex flex-col md:flex-row justify-between"
                  >
                    <div className="space-y-1  flex justify-center items-center w-full text-warm-800 dark:text-light-200">
                      <div className="absolute top-1.5 left-1.5 flex text-light-700 gap-2 text-xs justify-center items-center font-semibold">
                        <div className="">{timeLabel}</div>
                      </div>
                      <div className="grid grid-cols-[1fr_30px_30px_30px_1fr]">
                        <div className="text-end mr-2 pt-1">
                          {match.team1_teamname}
                        </div>
                        <div className="text-center text-light-50 bg-brand-red  border-b-2 border-brand-red-dark px-1.5 pt-1 rounded font-bold text-lg">
                          0
                        </div>
                        <div className="text-xl text-center font-bold ml-0.5 pt-0.5">
                          vs
                        </div>
                        <div className="text-center text-light-50 bg-brand-blue border-b-2 border-brand-blue-dark px-1.5 pt-1 rounded font-bold text-lg">
                          0
                        </div>
                        <div className="text-start ml-2 pt-1">
                          {match.team2_teamname}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-1.5 right-1.5 flex text-light-700 gap-2 text-xs justify-center items-center font-semibold">
                      <div className="pt-0.5">{match.format === null ? "NA" : match.format}</div>
                      <div>|</div>
                      <div className="pt-0.5">{match.division}</div>
                      <div>|</div>
                      <img
                        src={leagueLogo}
                        alt={match.league}
                        className="w-5 h-5"
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
