import React from "react";

export interface SimpleTeamStats {
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  drops: number;
  healing: number;
  charges: number;
  caps: number;
  midFights: number;
}

interface Props {
  data: {
    Red: SimpleTeamStats;
    Blue: SimpleTeamStats;
  };
}

const SimpleTeamStatsTable: React.FC<Props> = ({ data }) => {
  const teams = ["Red", "Blue"] as const;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-zinc-700">
        <thead className="bg-zinc-800 text-white">
          <tr>
            <th className="px-4 py-2 border border-zinc-700">Team</th>
            <th className="px-4 py-2 border border-zinc-700">Kills</th>
            <th className="px-4 py-2 border border-zinc-700">Deaths</th>
            <th className="px-4 py-2 border border-zinc-700">Assists</th>
            <th className="px-4 py-2 border border-zinc-700">Damage</th>
            <th className="px-4 py-2 border border-zinc-700">Healing</th>
            <th className="px-4 py-2 border border-zinc-700">Charges</th>
            <th className="px-4 py-2 border border-zinc-700">Drops</th>
            <th className="px-4 py-2 border border-zinc-700">Caps</th>
            <th className="px-4 py-2 border border-zinc-700">Midfights</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((teamName) => {
            const team = data[teamName];
            return (
              <tr key={teamName} className="bg-zinc-900 text-white">
                <td className="px-4 py-2 border border-zinc-700 font-semibold">{teamName}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.kills}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.deaths}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.assists}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.damage}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.healing}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.charges}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.drops}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.caps}</td>
                <td className="px-4 py-2 border border-zinc-700">{team.midFights}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTeamStatsTable;
