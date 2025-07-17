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

export default function PlayerSidebar({
  playersByTeam,
  finalValues,
  highlightedPlayers,
  toggleHighlight,
  players,
  lineColors,
}: PlayerSidebarProps) {
  const getPlayerData = (id: string): PlayerStats | undefined =>
    players.find((p) => p.steamId === id);

  return (
    <div className="w-64 pr-4">
      {(["Blue", "Red"] as const).map((team) => (
        <div key={team} className="mb-6">
          <div
            className={`font-bold border border-warm-700 px-1 py-1 rounded-t-sm text-sm ${
              team === "Blue" ? "bg-brand-blue" : "bg-brand-red"
            }`}
          >
            {team} Team
          </div>
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
                className={`flex items-center justify-between w-full px-2 py-0.5 border border-warm-700 bg-warm-800 rounded-sm hover:bg-white/10 transition ${
                  isActive ? "text-white font-medium bg-warm-600" : "text-white/30"
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
                <span className="text-sm">{finalValues[player.id] ?? 0}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
