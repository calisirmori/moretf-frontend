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
  
  const formatLength = (length: number) => {
    const minutes = Math.floor(length / 60);
    const seconds = length % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getRunningScore = (data: RoundData[]) => {
    let redScore = 0;
    let blueScore = 0;
    return data.map((round) => {
      if (round.winner === "Red") redScore += 1;
      if (round.winner === "Blue") blueScore += 1;
      return { red: redScore, blue: blueScore };
    });
  };

    const runningScores = getRunningScore(data);

  return (
    <div className="flex justify-center bg-light-100/50 dark:bg-warm-800/60 border-b max-md:text-xs border-light-300 dark:border-warm-600 py-6 px-4 w-full text-sm ">
      <table className="table-auto w-full max-w-3xl ">
        <thead>
          <tr className=" text-warm-800 dark:text-light-100 text-center">
            <th className="border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600">ROUNDS</th>
            <th className="border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600">LENGTH</th>
            <th className="border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600">SCORE</th>
            <th className="border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600 ">BLUE K</th>
            <th className="border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600 ">RED K</th>
            <th className="max-md:hidden border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600">BLUE DA</th>
            <th className="max-md:hidden border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600">RED DA</th>
            <th className="border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600">mids</th>
            <th className="max-md:hidden border max-md:px-1 md:px-2 py-1 border-light-300 dark:border-warm-600"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((round, index) => {
            const isOpen = expanded === index;
            const red = round.team["Red"] ?? { kills: 0, dmg: 0, ubers: 0, score: 0 };
            const blue = round.team["Blue"] ?? { kills: 0, dmg: 0, ubers: 0, score: 0 };
            const score = runningScores[index];
            return (
              <React.Fragment key={index}>
                <tr
                  className={`cursor-pointer hover:bg-brand-orange text-warm-800 dark:text-light-100`}
                  onClick={() => setExpanded(isOpen ? null : index)}
                >
                  <td className={`border text-light-100 px-2 py-1 border-light-300 dark:border-warm-600 ${round.winner == "Red" ? "bg-brand-red" : "bg-brand-blue"} text-center`}>Round {index + 1}</td>
                  <td className={`border px-2 py-1 border-light-300 dark:border-warm-600 text-center`}>{formatLength(round.length)}</td>
                  <td className={`border px-2 py-1 border-light-300 dark:border-warm-600 text-center`}>  
                     <span className="text-brand-blue font-semibold">{score.blue}</span> - {" "}
                     <span className="text-brand-red font-semibold">{score.red}</span>
                  </td>
                  <td className={`border px-2 py-1 border-light-300 dark:border-warm-600 text-center`}>{blue.kills}</td>
                  <td className={`border px-2 py-1 border-light-300 dark:border-warm-600 text-center`}>{red.kills}</td>
                  <td className={`max-md:hidden border px-2 py-1 border-light-300 dark:border-warm-600 text-center`}>{blue.dmg}</td>
                  <td className={`max-md:hidden border px-2 py-1 border-light-300 dark:border-warm-600 text-center`}>{red.dmg}</td>
                  <td className={`border text-light-100 px-2 py-1 border-light-300 dark:border-warm-600 ${round.firstcap == "Red" ? "bg-brand-red" : "bg-brand-blue"} text-center`}>{round.firstcap}</td>
                  <td className={`max-md:hidden border px-2 py-1 border-light-300 dark:border-warm-600  text-center`}>{isOpen ? "▲" : "▼"}</td>
                </tr>

                {isOpen && (
                  <tr className="bg-light-200/60 dark:bg-warm-800 border border-light-300 dark:border-warm-600 text-warm-800 dark:text-light-100">
                    <td colSpan={9} className="p-4">
                      <div className="mb-3">
                        <h4 className="text-md font-semibold mb-1">Team Summary</h4>
                        <table className="w-full text-sm text-center border dark:border-warm-600 mb-4">
                          <thead>
                            <tr>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600">Team</th>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600">Score</th>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600">Kills</th>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600">Damage</th>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600">Ubers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {["Red", "Blue"].map((team) => {
                              const t = round.team[team];
                              const isRed = team === "Red";
                              return (
                                <tr
                                  key={team}
                                  className={`${isRed ? "bg-brand-red" : "bg-brand-blue"} text-warm-800 dark:text-light-100`}
                                >
                                  <td className={`px-2 py-1 border ${team == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"} font-semibold`}>{team}</td>
                                  <td className={`px-2 py-1 border ${team == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"}`}>{t?.score ?? 0}</td>
                                  <td className={`px-2 py-1 border ${team == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"}`}>{t?.kills ?? 0}</td>
                                  <td className={`px-2 py-1 border ${team == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"}`}>{t?.dmg ?? 0}</td>
                                  <td className={`px-2 py-1 border ${team == "Red" ? "border-brand-red-dark/40" : "border-brand-blue-dark/40"}`}>{t?.ubers ?? 0}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold mb-1">Player Breakdown</h4>
                        <table className="w-full text-sm border border-light-300 ">
                          <thead className="bg-light-200/60 dark:bg-warm-800 text-warm-800 dark:text-light-100">
                            <tr>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600 text-left">Player</th>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600 text-left">Team</th>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600 text-left">Kills</th>
                              <th className="px-2 py-1 border border-light-300 dark:border-warm-600 text-left">Damage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(round.players).map(([steamId, stats]) => (
                              <tr key={steamId} className="border-t border-light-300 dark:border-warm-600">
                                <td className="px-2 py-1 border border-light-300 dark:border-warm-600">{steamId}</td>
                                <td className="px-2 py-1 border border-light-300 dark:border-warm-600">{stats.team}</td>
                                <td className="px-2 py-1 border border-light-300 dark:border-warm-600">{stats.kills}</td>
                                <td className="px-2 py-1 border border-light-300 dark:border-warm-600">{stats.dmg}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LogsRoundStatsTable;
