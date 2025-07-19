import React, { useState, useRef, useEffect } from "react";
import { mapCordinates } from "./MapCalibrations";
import type { PlayerStats } from "../../../types/PlayerStats";


interface PlayerLocation {
    x: number;
    y: number;
    z: number;
}

interface Event {
    eventType: string;
    clock: string;
    weapon?: string;
    actingPlayerID: string;
    actingPlayerLocation: PlayerLocation;
    targetPlayerID: string;
    targetPlayerLocation: PlayerLocation;
}

interface MapEventsProps {
    players: PlayerStats[];
    events: Event[];
    mapName?: string;
    localPlayerId: string;
}


function transformCoordinates(x: number, y: number, mapName: string = "default") {
    const { scale, x: calibX, y: calibY } = mapCordinates[mapName] || mapCordinates.default;
    const xAdj = ((x - (calibX + 910 * scale)) / scale) * 0.097656 + 50;
    const yAdj = ((y - (calibY - 512 * scale)) / scale) * -0.097656 + 50;
    return {
        xPct: `${xAdj}%`,
        yPct: `${yAdj}%`,
    };
}

export const MapEvents: React.FC<MapEventsProps> = ({
    players,
    events,
    localPlayerId,
}) => {
    const [mode, setMode] = useState<"kills" | "deaths">("kills");
    const [selectedEnemy, setSelectedEnemy] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);
    const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const activeMapName = "product";
    const playerMap = Object.fromEntries(players.map((p) => [p.steamId, p]));

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setFocused(false);
            }
        };
        if (focused) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [focused]);

    const filteredEvents = events.filter((e) => {
        if (e.eventType !== "kill") return false;
        const isKill = e.actingPlayerID === localPlayerId;
        const isDeath = e.targetPlayerID === localPlayerId;

        if (mode === "kills" && !isKill) return false;
        if (mode === "deaths" && !isDeath) return false;
        if (selectedEnemy) {
            return (
                e.actingPlayerID === selectedEnemy || e.targetPlayerID === selectedEnemy
            );
        }
        return true;
    });

    return (
        <div className="w-full p-3 bg-light-100 dark:bg-warm-800 text-warm-800 dark:text-light-100 font-semibold rounded-md">
            <h3 className="text-sm text-warm-800 dark:text-light-100 font-semibold pb-1">Kill Map <span className="text-warm-300 text-xs font-medium ml-1"> click for extras</span></h3>
            {focused && <div className="fixed inset-0 bg-warm-800/70 backdrop-blur-sm z-40" />}
            <div
                ref={containerRef}
                onClick={() => setFocused(true)}
                className={`transition-all duration-300 ${focused
                    ? "fixed z-50 top-1/2 left-1/2 w-[90vh] h-[90vh] transform -translate-x-1/2 -translate-y-1/2"
                    : "relative  aspect-square"
                    } `}
            >
                {/* Controls */}
                {focused && (
                    <div className="absolute top-2 left-2 z-50 bg-black bg-opacity-60 p-2 rounded text-white space-y-2 text-sm">
                        <div>
                            <label className="mr-2">Mode:</label>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMode("kills");
                                }}
                                className={mode === "kills" ? "font-bold underline" : ""}
                            >
                                Kills
                            </button>
                            <span className="mx-1">|</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMode("deaths");
                                }}
                                className={mode === "deaths" ? "font-bold underline" : ""}
                            >
                                Deaths
                            </button>
                        </div>
                        <div>
                            <label className="mr-2">Enemy:</label>
                            <select
                                value={selectedEnemy ?? ""}
                                onChange={(e) => setSelectedEnemy(e.target.value || null)}
                                className="bg-zinc-800 text-white px-2 py-1 rounded"
                            >
                                <option value="">All</option>
                                {players
                                    .filter((p) => p.steamId !== localPlayerId && p.team !== playerMap[localPlayerId]?.team)
                                    .map((p) => (
                                        <option key={p.steamId} value={p.steamId} className="flex">
                                            {p.steamId}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                )}

                <img
                    src={`/mapImages/${activeMapName}.png`}
                    alt={`${activeMapName} map`}
                    className="absolute w-full h-full opac object-contain opacity-85"
                />

                <svg className="absolute top-0 left-0 w-full h-full">
                    {filteredEvents.map((event, i) => {
                        const killer = playerMap[event.actingPlayerID];
                        const victim = playerMap[event.targetPlayerID];
                        if (!killer || !victim) return null;

                        const killerPos = transformCoordinates(
                            event.actingPlayerLocation.x,
                            event.actingPlayerLocation.y,
                            activeMapName
                        );
                        const victimPos = transformCoordinates(
                            event.targetPlayerLocation.x,
                            event.targetPlayerLocation.y,
                            activeMapName
                        );

                        return (
                            <g
                                key={i}
                                onMouseEnter={() => setHoveredEvent(event)}
                                onMouseLeave={() => setHoveredEvent(null)}
                            >
                                <line
                                    x1={killerPos.xPct}
                                    y1={killerPos.yPct}
                                    x2={victimPos.xPct}
                                    y2={victimPos.yPct}
                                    className="stroke-yellow-300"
                                    strokeWidth={1.5}
                                    strokeDasharray="2,2"
                                />
                                <text
                                    x={killerPos.xPct}
                                    y={killerPos.yPct}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fontWeight="900"
                                    fontSize="10"
                                    className="fill-green-600"
                                >
                                    O
                                </text>
                                <text
                                    x={victimPos.xPct}
                                    y={victimPos.yPct}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fontWeight="900"
                                    fontSize="10"
                                    className="fill-brand-red"
                                >
                                    X
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Tooltip at bottom */}
                {focused && hoveredEvent && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-50 px-4 py-1 bg-zinc-800 text-white text-sm rounded">
                        {hoveredEvent.actingPlayerID} killed {hoveredEvent.targetPlayerID}
                        {hoveredEvent.weapon && ` with ${hoveredEvent.weapon}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapEvents;
