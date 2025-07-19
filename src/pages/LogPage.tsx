import { useEffect, useMemo, useState } from "react";
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
import CommendSection from "../components/logs/CommendSection";
import { useCommendSocket } from "../hooks/useCommendSocket";

interface Props {
  logId: string;
}

export default function LogPage({ logId }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("BOX SCORE");
  const [loggedInSteamId, setLoggedInSteamId] = useState<string | null>(null);
  const [commendCounts, setCommendCounts] = useState<Record<string, number>>({});
  const [commendStatus, setCommendStatus] = useState<Record<string, boolean>>({});
  useCommendSocket(logId, (event) => {
    const { commendedId, commenderId } = event;
  
    setCommendCounts((prev) => ({
      ...prev,
      [commendedId]: (prev[commendedId] || 0) + 1,
    }));
  
    if (loggedInSteamId === commenderId) {
      setCommendStatus((prev) => ({
        ...prev,
        [commendedId]: true,
      }));
    }
  });
  useEffect(() => {
    fetch(`https://api.more.tf/log/${logId}`, {
  credentials: "include"
})
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch log");
        return res.json();
      })
      .then((response) => {
        setData(response.data);
        // If needed later:
        setCommendCounts(response.commendCounts || {});
        setCommendStatus(response.commendStatus || {});
      })
      .catch((err) => setError(err.message));
  }, [logId]);


  useEffect(() => {
    fetch("https://api.more.tf/auth/status", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn && typeof data.steamId === "string") {
          setLoggedInSteamId(data.steamId);
        }
      });
  }, []);


  const isPlayerInThisMatch = useMemo(() => {
    if (!data?.players || !loggedInSteamId) return false;
    return data.players.some((p: any) => p.steamId64 === loggedInSteamId);
  }, [data, loggedInSteamId]);

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!data) return <p className="text-white">Loading log data...</p>;
  
  return (
    <div className="bg-light-50 dark:bg-warm-700 min-h-screen p-6 text-white flex justify-center items-center">
      <div className="min-h-screen max-w-7xl w-full">
        <LogHeader info={data.info} />
        <CommendSection
          players={data.players}
          commendCounts={commendCounts}
          commendStatus={commendStatus}
          // setCommendStatus={setCommendStatus}
          logId={logId}
          loggedInSteamId={loggedInSteamId}
          isPlayerInThisMatch={isPlayerInThisMatch}
        />
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
