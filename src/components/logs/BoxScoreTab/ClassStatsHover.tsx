import React from "react";

export interface ClassStat {
  classType: string;
  totalTime: number;
  kills?: number;
  deaths?: number;
  assists?: number;
  damage?: number;
  weaponStats?: Record<string, {
    kills: number;
    damage: number;
    shots?: number;
    hits?: number;
  }>;
}

interface Props {
  classStat: ClassStat;
  iconSrc: string;
  iconSize?: number;
  iconOpacity?: string;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const ClassStatsHover: React.FC<Props> = ({ classStat, iconSrc, iconSize = 20, iconOpacity = "1" }) => {
  const { classType, totalTime, kills, deaths, assists, damage, weaponStats } = classStat;
  const totalKills = Object.values(weaponStats || {}).reduce((sum, w) => sum + w.kills, 0);
  const totalDamage = Object.values(weaponStats || {}).reduce((sum, w) => sum + w.damage, 0);

  return (
    <div className="relative group inline-block">
      <img
        src={iconSrc}
        alt={classType}
        className="inline-block"
        style={{ width: iconSize, height: iconSize, opacity: iconOpacity }}
      />
      <div className="absolute z-50 w-64 text-sm text-white border border-warm-700 bg-warm-820 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none top-full mt-1 left-1/2 -translate-x-1/2">
        <div className="py-1 text-center font-bold capitalize bg-warm-800 border-b border-warm-700">{classType}</div>
        <table className="w-full mt-1 mb-2 border-separate border-spacing-x-2 text-xs text-left">
          <thead>
            <tr><th className="border-r border-warm-500">Played</th><th className="border-r border-warm-500">K</th><th className="border-r border-warm-500">A</th><th className="border-r border-warm-500">D</th><th className=" border-warm-500">DA</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-r border-warm-500">{formatTime(totalTime)}</td>
              <td className="border-r border-warm-500">{kills}</td>
              <td className="border-r border-warm-500">{assists}</td>
              <td className="border-r border-warm-500">{deaths}</td>
              <td>{damage}</td>
            </tr>
          </tbody>
        </table>
        {weaponStats && (
          <table className="w-full border-t py-2 border-separate border-spacing-x-2 text-xs text-left">
            <thead>
              <tr>
                <th className="border-r border-warm-500">Weapon</th>
                <th className="border-r border-warm-500">K</th>
                <th className="border-r border-warm-500">DA</th>
                <th className="">Acc</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(weaponStats).map(([weapon, stats]) => {
                const killPct = totalKills ? Math.round((stats.kills / totalKills) * 100) : 0;
                const dmgPct = totalDamage ? Math.round((stats.damage / totalDamage) * 100) : 0;
                const acc = stats.shots && stats.hits ? Math.round((stats.hits / stats.shots) * 100) : null;

                return (
                  <tr key={weapon} >
                    <td className="capitalize border-r border-warm-500">{weapon.replace(/_/g, " ")}</td>
                    <td className="border-r border-warm-500">
                      {stats.kills} {totalKills > 0 && <span className="text-warm-100 font-medium text-[10px]">({killPct}%)</span>}
                    </td>
                    <td className="border-r border-warm-500">
                      {stats.damage} {totalDamage > 0 && <span className="text-warm-100 font-medium text-[10px]">({dmgPct}%)</span>}
                    </td>
                    <td>{acc !== null ? `${acc}%` : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClassStatsHover;
