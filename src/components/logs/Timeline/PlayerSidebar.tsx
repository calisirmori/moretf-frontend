interface PlayerStats {
  name: string;
  character?: string;
  steamId: string;
  team: string;
  min: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  kdr: number;
  kda: number;
  damageTaken: number;
  healing: number;
  ubers: number;
  drops: number;
  airShots: number;
  backStabs: number;
  headShots: number;
  captures: number;
  itemPickups: Record<string, number> | null;
  classStats: Record<string, { classType: string; totalTime: number }> | null;
}

interface PlayerSidebarProps {
  playersByTeam: Record<"Blue" | "Red", { id: string; team: string }[]>;
  finalValues: Record<string, number>;
  highlightedPlayers: string[];
  toggleHighlight: (id: string) => void;
  players: PlayerStats[];
  lineColors: Record<string, string>;
}

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

  const key = className?.toLowerCase?.() || "scout";
  return map[key] || "scout.png";
};

import { useEffect, useRef, useState } from "react";

export default function PlayerSidebar({
  playersByTeam,
  finalValues,
  highlightedPlayers,
  toggleHighlight,
  players,
  lineColors,
}: PlayerSidebarProps) {
  
  const [expanded, setExpanded] = useState<Record<"Blue" | "Red", boolean>>({
    Blue: false,
    Red: false,
  });

  const blueRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);

  const toggleTeam = (team: "Blue" | "Red") => {
    setExpanded((prev) => ({ ...prev, [team]: !prev[team] }));
  };

  const getPlayerData = (id: string): PlayerStats | undefined =>
    players.find((p) => p.steamId === id);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !blueRef.current?.contains(target) &&
        !redRef.current?.contains(target)
      ) {
        setExpanded({ Blue: false, Red: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lg:w-64 max-lg:w-full max-lg:gap-2 max-lg:flex lg:pr-4">
      {(["Blue", "Red"] as const).map((team) => {
        const sectionRef = team === "Blue" ? blueRef : redRef;
        return (
          <div key={team} ref={sectionRef} className="mb-6 w-full relative">
            {/* Dropdown Header */}
            <button
              className={`flex justify-between items-center w-full font-bold border border-warm-700 px-1 py-1 rounded-sm text-sm lg:cursor-default ${
                team === "Blue" ? "bg-brand-blue" : "bg-brand-red"
              }`}
              onClick={() => toggleTeam(team)}
            >
              <span>{team} Team</span>
              <span className="lg:hidden">{expanded[team] ? "▸" : "▾"}</span>
            </button>

            {/* Player List */}
            <div
              className={`mt-1 max-lg:absolute transition-all duration-200 ease-in-out z-10 ${
                expanded[team] ? "block" : "hidden"
              } lg:block`}
            >
              {playersByTeam[team].map((player) => {
                const isActive =
                  highlightedPlayers.length === 0 ||
                  highlightedPlayers.includes(player.id);

                const playerData = getPlayerData(player.id);
                const icon = getClassIconFilename(playerData?.character || "");
                const name = playerData?.name || player.id;
                const borderColor = lineColors[player.id] || "#ffffff";

                return (
                  <button
                    key={player.id}
                    onClick={() => toggleHighlight(player.id)}
                    className={`flex items-center justify-between w-full px-2 py-0.5 border border-warm-700 rounded-sm transition ${
                      isActive
                        ? "text-white font-medium bg-warm-600"
                        : "text-white/30 bg-warm-800"
                    }`}
                    style={{ borderLeft: `4px solid ${borderColor}` }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`/classIcons/${icon}`}
                        alt={playerData?.character || "class"}
                        className="inline-block w-4 h-4"
                      />
                      <span className="text-xs truncate max-w-[100px] text-left">
                        {name}
                      </span>
                    </div>
                    <span className="text-sm">
                      {finalValues[player.id] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
