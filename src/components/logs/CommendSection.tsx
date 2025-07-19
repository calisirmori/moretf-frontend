interface Props {
  players: any[];
  logId: string;
  loggedInSteamId: string | null;
  isPlayerInThisMatch: boolean;
  commendCounts: Record<string, number>;
  commendStatus: Record<string, boolean>;
//   setCommendStatus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function CommendSection({
  players,
  logId,
  loggedInSteamId,
  isPlayerInThisMatch,
  commendCounts,
  commendStatus,
//   setCommendStatus,
}: Props) {
  const handleCommend = async (commendedId: string) => {
    if (!loggedInSteamId || commendStatus[commendedId]) return;

    const event = {
      logId,
      commenderId: loggedInSteamId,
      commendedId,
    };

    try {
      const res = await fetch(`https://api.more.tf/log/${logId}/commend/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": loggedInSteamId,
        },
        credentials: "include",
        body: JSON.stringify([event]),
      });

      if (!res.ok) console.error("Commend failed");
    } catch (err) {
      console.error("Commend error:", err);
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
          const alreadyCommended = commendStatus[player.steamId64];
          const commendCount = commendCounts[player.steamId64] || 0;

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
