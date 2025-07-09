import { useEffect, useState } from "react";
import LogHeader from "../components/logs/LogHeader";
import LogStatsTable from "../components/logs/LogStatsTable";

interface Props {
  logId: string;
}

export default function LogPage({ logId }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/log/${logId}`)
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
    <div className=" bg-warm-700 min-h-screen p-6 text-white flex justify-center items-center">
      <div className="min-h-screen max-w-7xl w-full">
        <LogHeader info={data.info} />
        <LogStatsTable data={data.players} gameLengthMinutes={data.info.durationSeconds / 60} />
        {/* Future: pass other props to team/player components */}
        {/* <TeamStats red={data.red} blue={data.blue} /> */}
        {/* <PlayerTable players={data.players} /> */}

        {/* <div className="mt-6">
          <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
}
