import type { PlayerStats } from "../../../types/PlayerStats";
import { useState } from "react";

const CLASS_ORDER = [
  "scout",
  "soldier",
  "pyro",
  "demoman",
  "heavyweapons",
  "engineer",
  "medic",
  "sniper",
  "spy",
];

const getClassOrderIndex = (cls: string) => {
  const lower = cls?.toLowerCase();
  return CLASS_ORDER.indexOf(lower) === -1 ? 999 : CLASS_ORDER.indexOf(lower);
};

const getClassIconFilename = (className: string) => {
  const map: Record<string, string> = {
    scout: "scout.png",
    soldier: "soldier.png",
    pyro: "pyro.png",
    demo: "demoman.png",
    demoman: "demoman.png",
    heavy: "heavyweapons.png",
    heavyweapons: "heavyweapons.png",
    engineer: "engineer.png",
    medic: "medic.png",
    sniper: "sniper.png",
    spy: "spy.png",
  };

  const key = className.toLowerCase();
  return map[key] || "scout.png";
};

interface KillDeathChartProps {
  players: PlayerStats[];
  localPlayerId: string;
}

export default function KillDeathChart({
  players,
  localPlayerId,
}: KillDeathChartProps) {
  const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);
  const [tooltipText, setTooltipText] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [sortBy, setSortBy] = useState<"class" | "kills" | "deaths">("class");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const localPlayer = players.find((p) => p.steamId === localPlayerId);
  if (!localPlayer) return <div className="text-red-500">Error: Local player not found</div>;
  const enemyTeam = localPlayer.team === "Red" ? "Blue" : "Red";
  const enemyPlayers = players.filter((p) => p.team === enemyTeam);

  const sorted = [...enemyPlayers].sort((a, b) => {
    if (sortBy === "class") {
      return getClassOrderIndex(a.character) - getClassOrderIndex(b.character);
    }

    const aVal =
      sortBy === "kills"
        ? localPlayer.killSpread[a.steamId] ?? 0
        : localPlayer.deathSpread[a.steamId] ?? 0;

    const bVal =
      sortBy === "kills"
        ? localPlayer.killSpread[b.steamId] ?? 0
        : localPlayer.deathSpread[b.steamId] ?? 0;

    return sortAsc ? aVal - bVal : bVal - aVal;
  });


  const maxValue = Math.max(
    ...enemyPlayers.map((p) =>
      Math.max(
        localPlayer.killSpread[p.steamId] ?? 0,
        localPlayer.deathSpread[p.steamId] ?? 0
      )
    ),
    1
  );

  return (
    <div className="w-full p-3 bg-light-100 dark:bg-warm-800 text-warm-800 dark:text-light-100 font-semibold rounded-md">
      <h3 className="text-warm-800 dark:text-light-100 font-semibold mb-2 border-b pb-1 border-warm-500">Kill Spread</h3>
      <div className="flex items-center gap-1 text-light-200 font-semibold mb-1 select-none">
        <div
          className="flex-1 text-right cursor-pointer hover:text-brand-orange"
          onClick={() => {
            if (sortBy === "deaths") {
              if (sortAsc) setSortBy("class");
              else setSortAsc(true);
            } else {
              setSortBy("deaths");
              setSortAsc(false);
            }
          }}
        >
          Deaths <span className="text-xs">{sortBy === "deaths" ? (sortAsc ? "▲" : "▼") : ""}</span>
        </div>
        <div className="w-8" />
        <div
          className="flex-1 text-left cursor-pointer hover:text-brand-orange"
          onClick={() => {
            if (sortBy === "kills") {
              if (sortAsc) setSortBy("class");
              else setSortAsc(true);
            } else {
              setSortBy("kills");
              setSortAsc(false);
            }
          }}
        >
          Kills <span className="text-xs">{sortBy === "kills" ? (sortAsc ? "▲" : "▼") : ""}</span>
        </div>
      </div>

      <div className="gap-1 px-8">
        {sorted.map((player) => {
          const deathsFromPlayer = localPlayer.deathSpread[player.steamId] ?? 0;
          const killsByPlayer = localPlayer.killSpread[player.steamId] ?? 0;

          const killPct = (killsByPlayer / maxValue) * 100;
          const deathPct = (deathsFromPlayer / maxValue) * 100;

          const isHovered = hoveredPlayerId === null || hoveredPlayerId === player.steamId;

          return (
            <div
              key={player.steamId}
              className={`flex items-center gap-1 transition-opacity duration-150 ${isHovered ? "opacity-100" : "opacity-30"
                }`}
              onMouseEnter={(e) => {
                setHoveredPlayerId(player.steamId);
                setTooltipText(player.name);
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
              }}
              onMouseLeave={() => {
                setHoveredPlayerId(null);
                setTooltipText(null);
                setTooltipPos(null);
              }}
            >
              {/* Deaths (left) */}
              <div className="flex-1 flex justify-end items-center h-6 py-0.5 text-xs relative">
                <div
                  className={`border-2 rounded h-full transition-all relative duration-200 ease-in-out ${localPlayer.team === "Blue"
                    ? "bg-brand-red border-brand-red-dark"
                    : "bg-brand-blue border-brand-blue-dark"
                    }`}
                  style={{ width: `${deathPct}%` }}
                >
                  <div
                    className="absolute right-full mr-1.5 mt-0.5 font-bold text-white"
                    style={{ minWidth: "2rem", textAlign: "right" }}
                  >
                    {deathsFromPlayer}
                  </div>
                </div>
              </div>

              {/* Icon */}
              <div className="w-8 flex justify-center items-center">
                <img
                  key={player.character}
                  src={`/classIcons/${getClassIconFilename(player.character)}`}
                  alt={player.character}
                  className="w-5 h-5"
                />
              </div>

              {/* Kills (right) */}
              <div className="flex-1 flex justify-start items-center h-6 py-0.5 text-xs relative">
                <div
                  className={`border-2 rounded h-full transition-all relative duration-200 ease-in-out ${localPlayer.team === "Red"
                    ? "bg-brand-red border-brand-red-dark"
                    : "bg-brand-blue border-brand-blue-dark"
                    }`}
                  style={{ width: `${killPct}%` }}
                >
                  <div
                    className="absolute left-full ml-1.5 mt-0.5 font-bold text-white"
                    style={{ minWidth: "2rem", textAlign: "left" }}
                  >
                    {killsByPlayer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {tooltipText && tooltipPos && (
          <div
            className="fixed px-2 py-1 bg-zinc-900 text-white text-sm rounded shadow-lg z-50 pointer-events-none"
            style={{
              top: tooltipPos.y - 24,
              left: tooltipPos.x,
              transform: "translateX(-50%)",
            }}
          >
            {tooltipText}
          </div>
        )}
      </div>
    </div>
  );
}
