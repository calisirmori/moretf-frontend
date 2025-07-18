import { useMemo, useState } from "react";
import PlayerSidebarRadio from "./PlayerSidebarRadio";
import KillDeathChart from "./KillDeathChart";
import DamageChart from "./DamageChart";

import type { PlayerStats } from "../../../types/PlayerStats";
import MapEvents from "./MapEvents";
import MapEventsHeatMapDeaths from "./MapEventsHeatMapDeaths";
import MapEventsHeatMapKills from "./MapEventsHeatMapKills";

export default function ChartsWrapper({ players, events, mapName }: { players: PlayerStats[], events: any[], mapName: string }) {
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const finalValues = useMemo(() => {
        const out: Record<string, number> = {};
        for (const p of players) {
            out[p.steamId] = p.kills;
        }
        return out;
    }, [players]);

    const lineColors = useMemo(() => {
        const colors: Record<string, string> = {};
        const palette = [
            "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899",
            "#14b8a6", "#f97316", "#6366f1", "#22d3ee", "#eab308", "#7c3aed"
        ];
        players.forEach((p, i) => {
            colors[p.steamId] = palette[i % palette.length];
        });
        return colors;
    }, [players]);

    const CLASS_ORDER = [
        "scout", "soldier", "pyro", "demoman", "heavyweapons",
        "engineer", "medic", "sniper", "spy",
    ];

    const getClassOrderIndex = (cls?: string) => {
        const lower = cls?.toLowerCase();
        return CLASS_ORDER.indexOf(lower || "") === -1 ? 999 : CLASS_ORDER.indexOf(lower || "");
    };

    const playersByTeam = useMemo(() => {
        const grouped: Record<"Blue" | "Red", { id: string; team: string }[]> = {
            Blue: [],
            Red: [],
        };

        for (const p of players) {
            if (p.team === "Blue" || p.team === "Red") {
                grouped[p.team].push({ id: p.steamId, team: p.team });
            }
        }

        for (const team in grouped) {
            grouped[team as "Blue" | "Red"].sort((a, b) => {
                const aClass = players.find((p) => p.steamId === a.id)?.character;
                const bClass = players.find((p) => p.steamId === b.id)?.character;
                return getClassOrderIndex(aClass) - getClassOrderIndex(bClass);
            });
        }

        return grouped;
    }, [players]);

    useMemo(() => {
        if (selectedPlayer === null && playersByTeam.Blue.length > 0) {
            setSelectedPlayer(playersByTeam.Blue[0].id);
        }
    }, [playersByTeam, selectedPlayer]);

    const selected = players.find((p) => p.steamId === selectedPlayer);

    return (
        <div className="flex flex-col gap-8 text-warm-800 dark:text-light-50 bg-light-100/50 dark:bg-warm-800/60 font-ttnorms p-10">
            <div className="lg:flex">
                <PlayerSidebarRadio
                    players={players}
                    playersByTeam={playersByTeam}
                    finalValues={finalValues}
                    selectedPlayer={selectedPlayer}
                    selectPlayer={setSelectedPlayer}
                    lineColors={lineColors}
                />

                <div className="lg:hidden bg-warm-800 mb-2 text-center py-1 rounded">{selectedPlayer}</div>

                <div className="flex-1 rounded-sm ">
                    {selected ? (
                        <div className="text-sm  space-y-2">
                            <div className="lg:flex gap-2 ">
                                <DamageChart
                                    players={players}
                                    localPlayerId={selectedPlayer ?? ""}
                                />
                                <KillDeathChart
                                    players={players}
                                    localPlayerId={selectedPlayer ?? ""}
                                />
                            </div>
                            <div className="lg:grid lg:grid-cols-3 w-full gap-2">
                                <MapEvents players={players} events={events} mapName={mapName} localPlayerId={selectedPlayer ?? ""} />
                                <MapEventsHeatMapKills events={events} mapName="product" localPlayerId={selectedPlayer ?? ""} />
                                <MapEventsHeatMapDeaths events={events} mapName="product" localPlayerId={selectedPlayer ?? ""} />
                            </div>



                        </div>
                    ) : (
                        <p className="text-light-600">Select a player to view stats.</p>
                    )}
                </div>
            </div>



        </div>
    );
}
