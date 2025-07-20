import { useState } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.more.tf";
interface Props {
  players: any[];
  logId: string;
  loggedInSteamId: string | null;
  isPlayerInThisMatch: boolean;
  commendCounts: Record<string, number>;
  commendStatus: Record<string, boolean>;
}

export default function CommendSection({
  players,
  logId,
  loggedInSteamId,
  isPlayerInThisMatch,
  commendCounts,
  commendStatus,
}: Props) {
  // local state to show instant UI updates for self
  const [localCommendStatus, setLocalCommendStatus] = useState<Record<string, boolean>>({});
  const [localCommendCounts, setLocalCommendCounts] = useState<Record<string, number>>({});

  const handleCommend = async (commendedId: string) => {
    if (!loggedInSteamId || commendStatus[commendedId] || localCommendStatus[commendedId]) return;

    const event = {
      logId,
      commenderId: loggedInSteamId,
      commendedId,
    };

    // update UI immediately
    setLocalCommendStatus((prev) => ({ ...prev, [commendedId]: true }));
    setLocalCommendCounts((prev) => ({
      ...prev,
      [commendedId]: (commendCounts[commendedId] ?? 0) + 1,
    }));

    try {
      const res = await fetch(`${baseUrl}/log/${logId}/commend/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": loggedInSteamId,
        },
        credentials: "include",
        body: JSON.stringify([event]),
      });

      if (!res.ok) {
        console.error("Commend failed");
        // rollback optimistic UI on error
        setLocalCommendStatus((prev) => ({ ...prev, [commendedId]: false }));
        setLocalCommendCounts((prev) => ({ ...prev, [commendedId]: commendCounts[commendedId] ?? 0 }));
      }
    } catch (err) {
      console.error("Commend error:", err);
      setLocalCommendStatus((prev) => ({ ...prev, [commendedId]: false }));
      setLocalCommendCounts((prev) => ({ ...prev, [commendedId]: commendCounts[commendedId] ?? 0 }));
    }
  };

  return (
    <div className="mt-4 p-4 bg-neutral-800 rounded-xl text-white shadow">
      <h2 className="text-xl font-bold mb-3">Commend a Teammate</h2>
      {!isPlayerInThisMatch && (
        <p className="text-sm text-gray-400 mb-2">
          You must be a player in this match to commend.
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {players.map((player) => {
          const isSelf = loggedInSteamId === player.steamId64;
          const alreadyCommended =
            commendStatus[player.steamId64] || localCommendStatus[player.steamId64];
          const commendCount =
            localCommendCounts[player.steamId64] ?? commendCounts[player.steamId64] ?? 0;

          return (
            <div
              key={player.steamId64}
              className="border border-gray-700 rounded-md p-3 bg-neutral-900 flex flex-col items-center"
            >
              <div className="font-medium">{player.name}</div>
              <div className="text-xs text-gray-400 mb-2">{player.team}</div>
              <div className="mb-2 text-sm">
                Commends: <span className="font-semibold">{commendCount}</span>
              </div>
              <button
                className={`px-3 py-1 rounded text-sm font-semibold transition ${
                  isSelf || alreadyCommended || !isPlayerInThisMatch
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isSelf || alreadyCommended || !isPlayerInThisMatch}
                onClick={() => handleCommend(player.steamId64)}
              >
                {isSelf ? "You" : alreadyCommended ? "Commended" : "Commend"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
