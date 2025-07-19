import React, { useState, useMemo } from "react";
import { QuoteIcon } from "./QuoteIcon";
import { DisconnectIcon } from "./DisconnectIcon";
import ChargeIcon from "./ChargeUsedIcon";
import Tooltip from '../../common/Tooltip';

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
  message?: string;
  scoreBlue?: string;
  scoreRed?: string;
}

interface Props {
  events: PlayEvent[];
}

const eventTypes = ["kill", "say", "say_team", "disconnected", "round_start", "chargedeployed", "chargeready", "chargeended", "round_win", "game_over"];

const PlayByPlayTable: React.FC<Props> = ({ events }) => {
  const allPlayers = useMemo(() => {
    const ids = new Set<string>();
    events.forEach(e => {
      if (e.actingPlayerID) ids.add(e.actingPlayerID);
      if (e.targetPlayerID) ids.add(e.targetPlayerID);
    });
    return Array.from(ids);
  }, [events]);

  const [enabledPlayers, setEnabledPlayers] = useState<Record<string, boolean>>(
    Object.fromEntries(allPlayers.map(id => [id, true]))
  );
  const [enabledEvents, setEnabledEvents] = useState<Record<string, boolean>>(
    Object.fromEntries(eventTypes.map(type => [type, true]))
  );

  const togglePlayer = (id: string) => {
    setEnabledPlayers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleEvent = (type: string) => {
    setEnabledEvents(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Track hasCharge across the timeline
  const processedEvents: (PlayEvent & {
  targetHadCharge?: boolean;
  targetDiedDuringActiveCharge?: boolean;
  targetDroppedCharge?: boolean; // new flag for drops
})[] = [];

let hasCharge = { Red: false, Blue: false };
let activeCharge = { Red: false, Blue: false };

// Track which player currently has Uber ready, per team
let chargedPlayer: { [team in "Red" | "Blue"]?: string } = {};

for (const e of events) {
  const isKill = e.eventType === "kill";
  const targetTeam = e.team === "Red" ? "Blue" : e.team === "Blue" ? "Red" : undefined;

  // Handle charge state changes
  if (e.eventType === "chargeready" && e.team && e.actingPlayerID) {
    hasCharge[e.team] = true;
    chargedPlayer[e.team] = e.actingPlayerID;
  } else if (e.eventType === "chargedeployed" && e.team) {
    hasCharge[e.team] = false;
    activeCharge[e.team] = true;
    chargedPlayer[e.team] = undefined; // they used it
  } else if (e.eventType === "chargeended" && e.team) {
    activeCharge[e.team] = false;
  }

  let targetDroppedCharge = false;

  // Detect drop (death while holding charge, before using it)
  if (
    isKill &&
    targetTeam &&
    hasCharge[targetTeam] &&
    chargedPlayer[targetTeam] &&
    e.targetPlayerID === chargedPlayer[targetTeam]
  ) {
    targetDroppedCharge = true;
    hasCharge[targetTeam] = false;
    chargedPlayer[targetTeam] = undefined;
  }

  processedEvents.push({
    ...e,
    targetHadCharge: isKill && targetTeam && hasCharge[targetTeam],
    targetDiedDuringActiveCharge: isKill && targetTeam && activeCharge[targetTeam],
    targetDroppedCharge,
  });
}

  
  const filteredEvents = processedEvents
    .filter(e =>
      enabledEvents[e.eventType] &&
      (!e.actingPlayerID || enabledPlayers[e.actingPlayerID]) &&
      (!e.targetPlayerID || enabledPlayers[e.targetPlayerID])
    )
    .filter((e, i, arr) => {
      if (e.eventType === "round_start" && arr[i - 1]?.eventType === "round_start") {
        return false;
      }
      return true;
    });

  return (
    <div className="flex flex-col gap-8 text-warm-800 dark:text-light-50 bg-light-100/50 dark:bg-warm-800/60 font-ttnorms p-10">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-6 border-b border-gray-600 pb-4">
        <div>
          <div className="font-bold mb-2">Players</div>
          <div className="flex flex-wrap gap-2">
            {allPlayers.map(id => (
              <label key={id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={enabledPlayers[id]}
                  onChange={() => togglePlayer(id)}
                />
                <span>{id}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="font-bold mb-2">Events</div>
          <div className="flex gap-4">
            {eventTypes.map(type => (
              <label key={type} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={enabledEvents[type]}
                  onChange={() => toggleEvent(type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-2 ">
        {filteredEvents.map((e, i) => {
          const isRed = e.team === "Red";
          const isBlue = e.team === "Blue";


          const content = (
            <div className="flex items-center gap-2">
              {e.eventType === "kill" && (
                <div className="flex w-fit  px-4 py-1 rounded-md bg-warm-800 border border-warm-600 relative">
                  {e.targetHadCharge && (
                    <div className={`absolute ${e.team === "Blue" ? "-top-2 -right-1" : "-top-2 -left-1"} select-none text-yellow-400 text-sm font-bold`}>
                      <Tooltip text="enemy team has uber">★</Tooltip>
                    </div>
                  )}
                  {e.targetDiedDuringActiveCharge && (
                    <div className={`absolute ${e.team === "Blue" ? "-top-2 -right-1" : "-top-2 -left-1"} select-none text-blue-400 text-sm font-bold`}>
                      <Tooltip text="killed during uber">✦</Tooltip>
                    </div>
                  )}
                  {e.targetDroppedCharge && (
                    <div className={`absolute ${e.team === "Blue" ? "-top-2 -right-1" : "-top-2 -left-1"} select-none text-red-400 text-sm font-bold`}>
                      <Tooltip text="uber drop">✶</Tooltip>
                    </div>
                  )}
                  <div className={`font-semibold ${isRed ? "text-brand-red" : "text-brand-blue"}`}>{e.actingPlayerID}</div>
                  {/* <img
                    src={`/killIcons/${e.weapon?.toLowerCase() || "default"}.png`}
                    alt={e.weapon}
                    className="h-5 mx-4"
                  /> */}
                  <div className="mx-2 font-medium">killed</div>
                  <div className={`font-semibold ${isBlue ? "text-brand-red" : "text-brand-blue"}`}>{e.targetPlayerID}</div>
                </div>
              )}

              {(e.eventType === "say" || e.eventType === "say_team") && (
                <div className="flex w-fit  px-4 py-1 rounded-md bg-warm-800 border border-warm-600 items-center gap-2 relative">
                  <div className={`font-semibold ${isRed ? "text-brand-red" : "text-brand-blue"}`}>
                    {e.actingPlayerID}
                  </div>
                  <div className="">{e.message}</div>
                  <div className={`absolute ${e.team === "Blue" ? "-top-2 -right-1" : "-top-2 -left-1"}`}><QuoteIcon /></div>
                </div>
              )}
              {e.eventType === "disconnected" && (
                <div className="flex w-fit  px-4 py-1 rounded-md bg-warm-800 border border-warm-600 items-center gap-2 relative">
                  <div className={`font-semibold ${isRed ? "text-brand-red" : "text-brand-blue"}`}>
                    {e.actingPlayerID}
                  </div>
                  <div className="">{e.message}</div>
                  <div className={`absolute ${e.team === "Blue" ? "-top-2 -right-1" : "-top-2 -left-1"}`}><DisconnectIcon /></div>
                </div>
              )}
              {e.eventType === "round_start" && (
                <div className="flex w-fit px-4 py-1 rounded-md bg-warm-800 border border-warm-600 items-center gap-2">
                  <div className="bg-brand-blue px-2 rounded">{e.scoreBlue}</div>
                  <div className="">Round Start</div>
                  <div className="bg-brand-red px-2 rounded">{e.scoreRed}</div>
                </div>
              )}
              {e.eventType === "chargedeployed" && (
                <div className="flex w-fit  px-4 py-1 rounded-md bg-warm-800 border border-warm-600 items-center gap-2 relative">
                  <div className={`font-semibold ${isRed ? "text-brand-red" : "text-brand-blue"}`}>
                    {e.actingPlayerID}
                  </div>
                  <div className="capitalize ">{e.weapon?.toLowerCase()} charge used</div>
                  <div className={`absolute ${e.team === "Blue" ? "-top-2 -right-1" : "-top-2 -left-1"}`}><ChargeIcon /></div>
                </div>
              )}
              {e.eventType === "chargeready" && (
                <div className="flex w-fit  px-4 py-1 rounded-md bg-warm-800 border border-warm-600 items-center gap-2 relative">
                  <div className={`font-semibold ${isRed ? "text-brand-red" : "text-brand-blue"}`}>
                    {e.actingPlayerID}
                  </div>
                  <div className="capitalize ">{e.weapon?.toLowerCase()} charge ready</div>
                  <div className={`absolute ${e.team === "Blue" ? "-top-2 -right-1" : "-top-2 -left-1"}`}><ChargeIcon /></div>
                </div>
              )}
              {e.eventType === "chargeended" && (
                <div className="flex w-fit  px-4 py-1 rounded-md bg-warm-800 border border-warm-600 items-center gap-2 relative">
                  <div className={`font-semibold ${isRed ? "text-brand-red" : "text-brand-blue"}`}>
                    {e.actingPlayerID}
                  </div>
                  <div className="capitalize ">{e.weapon?.toLowerCase()} charge ended</div>
                  <div className={`absolute ${e.team === "Blue" ? "-top-2 -right-1" : "-top-2 -left-1"}`}><ChargeIcon /></div>
                </div>
              )}
              {e.eventType === "round_win" && (
                <div className="flex w-fit px-4 py-1 rounded-md bg-warm-800 border border-warm-600 items-center gap-2">
                  <div className="">Team {e.team} won the round</div>
                </div>
              )}
              {e.eventType === "game_over" && (
                <div className="flex w-fit px-4 py-1 rounded-md bg-warm-800 border border-warm-600 items-center gap-2">
                  <div className="">Game Over</div>
                </div>
              )}
            </div>
          );

          return (
            <div className="w-full">
              {(e.eventType === "round_start" || e.eventType === "round_win" || e.eventType === "game_over") && <div className="w-full flex justify-center items-center">
                <div className="flex-1 bg-warm-600 h-0.5"></div>
                <div className="mx-4">{content}</div>
                <div className="flex-1 bg-warm-600 h-0.5"></div>
              </div>}
              {(e.eventType !== "round_start" && e.eventType !== "round_win" && e.eventType !== "game_over") && <div key={i} className="grid grid-cols-[1fr_100px_1fr] items-center text-sm text-warm-200 dark:text-light-500">
                <div className="flex justify-end items-center">{isRed ? content : null}</div>
                <div className="text-center">{e.clock}</div>
                <div className="flex justify-start items-center">{isBlue ? content : null}</div>
              </div>}
            </div>

          );
        })}
      </div>
    </div>
  );
};

export default PlayByPlayTable;
