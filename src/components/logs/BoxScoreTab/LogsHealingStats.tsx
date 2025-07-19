import React from "react";
import type { PlayerStats } from "../../../types/PlayerStats"; // adjust import path as needed

interface LogsHealingStatsProps {
  data: PlayerStats[];
  minHealingThreshold?: number;
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
  return `/classIcons/${map[className.toLowerCase()] || "scout.png"}`;
};

const LogsHealingStats: React.FC<LogsHealingStatsProps> = ({
  data,
  minHealingThreshold = 5000,
}) => {
  const healers = data
    .filter(p => p.character.toLowerCase() === "medic" && p.healing > minHealingThreshold)
    .sort((a, b) => b.healing - a.healing);

  if (healers.length === 0) return <div>No medics above {minHealingThreshold} healing.</div>;

  return (
    <div className="flex flex-wrap justify-center gap-4 bg-light-200/60 dark:bg-warm-800/90 border-b max-md:text-xs border-light-300 dark:border-warm-600 py-6 px-4 w-full text-sm">
      {healers.map((medic) => {
        const totalMinutes = medic.totalTime / 60;
        const hpm = (medic.healing / totalMinutes).toFixed(0);
        const drops = medic.drops;
        const totalCharges =
            typeof medic.ubers === "object" && medic.ubers !== null
              ? Object.values(medic.ubers).reduce((a, b) => a + b, 0)
              : typeof medic.ubers === "number"
              ? medic.ubers
              : 0;
        const avgBuild = medic.totalTime > 0 ? Math.round(medic.totalTime / Math.max(totalCharges, 1)) : 0;
        const healSpread = Object.entries(medic.healingDoneSpread || {}).sort((a:any, b:any) => b[1] - a[1]).slice(0, 6);
        const totalHealed = healSpread.reduce((sum, [, amount]:any) => sum + amount, 0);
        return (
          <div key={medic.steamId} className="w-full md:w-[340px] pb-2 bg-warm-820/60 border-warm-700 rounded-sm">
            <h2 className={`font-semibold mb-2 rounded-t-sm text-center py-1 border-b-2 ${medic.team === "Red" ? "bg-brand-red border-brand-red-dark" : "bg-brand-blue border-brand-blue-dark"}`}>{medic.name}</h2>
            <div className="px-2">
                <table className="w-full text-left">
                    <tbody>
                      <tr><td className="">Healing</td><td className="text-right"> <span className="font-semibold">{medic.healing}</span> ({hpm}/m)</td></tr>
                      <tr> 
                            <td className="">Charges</td>
                            <td className="text-right">
                              {typeof medic.ubers === "object" && medic.ubers !== null
                                 ? Object.entries(medic.ubers as Record<string, number>).map(
                                      ([type, count]: [string, number]) => {
                                        const total = Object.values(medic.ubers as Record<string, number>).reduce(
                                          (a, b) => a + b,
                                          0
                                        );
                                        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                                      
                                        return (
                                          <div key={type} className="capitalize">
                                            {type}: {count} ({percent}%)
                                          </div>
                                        );
                                      }
                                    )
                                 : <div>Medigun: {medic.ubers} (100%)</div>}
                            </td>
                      </tr>
                      <tr><td>Drops</td><td className="text-right">{drops}</td></tr>
                      <tr><td>Avg time to build</td><td className="text-right">{avgBuild}s</td></tr>
                      <tr><td>Deaths near full charge</td><td className="text-right">{medic.nearChargeDeaths}</td></tr>
                      <tr><td>Avg uber length</td><td className="text-right">{(medic.totalUberLength / totalCharges).toFixed(1)}s</td></tr>
                      <tr><td>Deaths after charge</td><td className="text-right">{medic.deathsDuringUber}</td></tr>
                      <tr><td>Deaths before charge</td><td className="text-right">{medic.deathsBeforeUber}</td></tr>
                    </tbody>
                </table>
                <h3 className="font-bold mt-2 mb-1 text-center">Heal Targets</h3>
                <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left">Name</th>
                        <th>Class</th>
                        <th className="text-right">Heals</th>
                        <th className="text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healSpread.map(([targetId, amount]:any) => {
                        const target = data.find(p => p.steamId === targetId);
                        const percent = totalHealed > 0 ? ((amount / totalHealed) * 100).toFixed(1) : "0.0";
                        if (!target) return null;
                        
                        const mainClass = target.character;
                        
                        return (
                          <tr key={targetId}>
                            <td className="pr-2 truncate max-w-[100px]">{target.name}</td>
                            <td className="text-center">
                              <img
                                src={getClassIconFilename(mainClass)}
                                alt={mainClass}
                                className="inline-block w-4 h-4"
                              />
                            </td>
                            <td className="text-right">{amount}</td>
                            <td className="text-right">{percent}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LogsHealingStats;
