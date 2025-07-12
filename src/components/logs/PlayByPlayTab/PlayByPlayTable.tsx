import React from "react";

interface PlayerLocation {
  x: number;
  y: number;
  z: number;
}

interface PlayEvent {
  timestamp: number;
  clock: string;
  eventType: string;
  team?: "Red" | "Blue";
  actingPlayerID?: string;
  targetPlayerID?: string;
  actingPlayerLocation?: PlayerLocation;
  targetPlayerLocation?: PlayerLocation;
  weapon?: string;
}

interface Props {
  events: PlayEvent[];
}

const PlayByPlayTable: React.FC<Props> = ({ events }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-6 text-sm text-white">
      <div className="grid grid-cols-3 font-bold text-lg mb-4">
        <div className="text-left flex items-center gap-2">
          <img src="/logos/red_team_logo.png" alt="Red" className="h-6 w-6" />
          <span>Red Team</span>
        </div>
        <div />
        <div className="text-right flex items-center gap-2 justify-end">
          <span>Blue Team</span>
          <img src="/logos/blue_team_logo.png" alt="Blue" className="h-6 w-6" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {events.map((e, i) => {
          const isRed = e.team === "Red";
          const isBlue = e.team === "Blue";

          const content = (
            <div className="flex items-center gap-2">
              {e.eventType === "kill" && (
                <div className="flex w-fit border border-[rgb(218,209,176)] px-4 py-1 rounded-md bg-[#f1eace]">
                  <div className={`font-semibold ${isRed ? "text-brand-red" : "text-brand-blue"}`}>{e.actingPlayerID}</div>
                  <img
                    src={`/killIcons/${
                      e.weapon?.toLowerCase() || "default"
                    }.png`}
                    alt={e.weapon}
                    className="h-5 mx-4"
                  />
                  <div className={`font-semibold ${isBlue ? "text-brand-red" : "text-brand-blue"}`}>{e.targetPlayerID}</div>
                </div>
              )}
            </div>
          );

          return (
            <div key={i} className="grid grid-cols-[1fr_100px_1fr] items-center text-sm text-warm-200 dark:text-light-500">
              <div className="flex justify-end items-center">
                {isRed ? content : null}
              </div>
              <div className="text-center ">{e.clock}</div>
              <div className="flex justify-start items-center">
                {isBlue ? content : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayByPlayTable;
