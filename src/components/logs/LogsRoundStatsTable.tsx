import React, { useState } from "react";

interface TeamSummary {
  score: number;
  kills: number;
  dmg: number;
  ubers: number;
}

interface PlayerStats {
  team: string;
  kills: number;
  dmg: number;
}

interface RoundData {
  startTime: number;
  winner: string;
  firstcap: string;
  length: number;
  team: Record<string, TeamSummary>;
  players: Record<string, PlayerStats>;
}

interface Props {
  data: RoundData[];
}

const LogsRoundStatsTable: React.FC<Props> = ({ data }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {data.map((round, index) => {
        const red = round.team["Red"] ?? { kills: 0, dmg: 0, ubers: 0, score: 0 };
        const blue = round.team["Blue"] ?? { kills: 0, dmg: 0, ubers: 0, score: 0 };
        const isOpen = expanded === index;

        return (
          <div
            key={index}
            className="border border-zinc-600 rounded-lg overflow-hidden"
          >
            <div
              className="bg-zinc-800 px-4 py-3 cursor-pointer hover:bg-zinc-700"
              onClick={() => setExpanded(isOpen ? null : index)}
            >
              <div className="flex justify-between items-center">
                <div className="text-white font-bold">
                  Round {index + 1} - Winner: {round.winner} - First Cap: {round.firstcap}
                </div>
                <div className="text-sm text-zinc-400">
                  Length: {round.length}s | Red Kills: {red.kills}, Blue Kills: {blue.kills}
                </div>
              </div>
            </div>

            {isOpen && (
              <div className="bg-zinc-900 px-4 py-4 text-white">
                <h4 className="text-lg font-semibold mb-2">Player Breakdown</h4>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left py-1">Player</th>
                      <th className="text-left py-1">Team</th>
                      <th className="text-left py-1">Kills</th>
                      <th className="text-left py-1">Damage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(round.players).map(([steamId, stats]) => (
                      <tr key={steamId} className="border-b border-zinc-800">
                        <td className="py-1">{steamId}</td>
                        <td className="py-1">{stats.team}</td>
                        <td className="py-1">{stats.kills}</td>
                        <td className="py-1">{stats.dmg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LogsRoundStatsTable;
