import { useEffect, useState } from "react";
import LogHeader from "../components/logs/LogHeader";
import LogStatsTable from "../components/logs/BoxScoreTab/LogStatsTable";
import LogsTeamStatsTable from "../components/logs/BoxScoreTab/LogsTeamStatsTable";
import LogsRoundStatsTable from "../components/logs/BoxScoreTab/LogsRoundStatsTable";
import LogKillsByClass from "../components/logs/BoxScoreTab/LogKillsByClass";
import LogsTabs from "../components/logs/LogsTabs";
import PlayByPlayTable from "../components/logs/PlayByPlayTab/PlayByPlayTable";
import TeamPerformanceChart from "../components/logs/Timeline/TimelineChart";
import ChartsWrapper from "../components/logs/Charts/ChartsWrapper";
import LogsHealingStats from "../components/logs/BoxScoreTab/LogsHealingStats";

interface Props {
  logId: string;
}

export default function LogPage({ logId }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("BOX SCORE");

  useEffect(() => {
    fetch(`https://api.more.tf/log/${logId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch log");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [logId]);

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!data) return <p className="text-white">Loading log data...</p>;

  return (
    <div className="bg-light-50 dark:bg-warm-700 min-h-screen p-6 text-white flex justify-center items-center">
      <div className="min-h-screen max-w-7xl w-full">
        <LogHeader info={data.info} />
        <LogsTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        {selectedTab === "BOX SCORE" && (
          <>
            <LogStatsTable
              data={data.players}
              gameLengthMinutes={data.info.durationSeconds / 60}
            />
            <LogsTeamStatsTable data={data.teams} />
            <LogsRoundStatsTable data={data.rounds} />
            <LogsHealingStats data={data.players} minHealingThreshold={1000} />
            <LogKillsByClass data={data.players} />
          </>
        )}

        {selectedTab === "CHARTS" && (
          <ChartsWrapper players={data.players} events={data.playByPlay} mapName={data.info.map}/>
        )}

        {selectedTab === "TIMELINE" && (
          <TeamPerformanceChart timeline={data.timeline} players={data.players} />
        )}

        {selectedTab === "PLAY-BY-PLAY" && (
          <PlayByPlayTable events={data.playByPlay} />
        )}

        {/* <div className="mt-6">
          <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
}
