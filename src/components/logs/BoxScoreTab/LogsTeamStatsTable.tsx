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
    <div className="overflow-x-auto flex justify-center items-center bg-light-200/60 dark:bg-warm-800/90 border-y border-light-300 dark:border-warm-600 py-6 font-ttnorms">
      <table className=" max-md:text-xs md:text-sm text-left border border-light-500/20 dark:border-warm-500/80">
        <thead className="dark:text-light-50 text-warm-600 text-center">
          <tr>
            <th className="max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">Team</th>
            <th className="max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">K</th>
            <th className="max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">D</th>
            <th className="max-md:hidden max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">A</th>
            <th className="max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">DMG</th>
            <th className="max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">HL</th>
            <th className="max-md:hidden max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">UBERS</th>
            <th className="max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">DROPS</th>
            <th className="max-md:hidden max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">CAP</th>
            <th className="max-md:px-1 md:px-4 py-1 border border-light-300 dark:border-warm-500/60">MIDS</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((teamName) => {
            const team = data[teamName];
            return (
              <tr key={teamName} className={`${teamName == "Red" ? "bg-brand-red" : "bg-brand-blue"} text-white text-center`}>
                <td className={`max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"}  font-semibold`}>{teamName}</td>
                <td className={`max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.kills}</td>
                <td className={`max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.deaths}</td>
                <td className={`max-md:hidden max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.assists}</td>
                <td className={`max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.damage}</td>
                <td className={`max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.healing}</td>
                <td className={`max-md:hidden max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.charges}</td>
                <td className={`max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.drops}</td>
                <td className={`max-md:hidden max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.caps}</td>
                <td className={`max-md:px-1 md:px-4 py-1 border ${teamName == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} `}>{team.midFights}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTeamStatsTable;
