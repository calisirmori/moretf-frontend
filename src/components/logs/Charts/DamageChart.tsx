import type { PlayerStats } from "../../../types/PlayerStats";
import { useState } from "react";

interface DamageChartProps {
    players: PlayerStats[];
    localPlayerId: string;
}

const CLASS_ORDER = [
    "scout",
    "soldier",
    "pyro",
    "demoman",
    "heavyweapons",
    "engineer",
    "medic",
    "sniper",
    "spy",
];

const getClassOrderIndex = (cls: string) => {
    const lower = cls?.toLowerCase();
    return CLASS_ORDER.indexOf(lower) === -1 ? 999 : CLASS_ORDER.indexOf(lower);
};

const getClassIconFilename = (className: string) => {
    const map: Record<string, string> = {
        scout: "scout.png",
        soldier: "soldier.png",
        pyro: "pyro.png",
        demo: "demoman.png",
        demoman: "demoman.png",
        heavy: "heavyweapons.png",
        heavyweapons: "heavyweapons.png",
        engineer: "engineer.png",
        medic: "medic.png",
        sniper: "sniper.png",
        spy: "spy.png",
    };

    const key = className.toLowerCase();
    return map[key] || "scout.png"; // fallback icon
};

export default function DamageChart({
    players,
    localPlayerId,
}: DamageChartProps) {
    const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);
    const [tooltipText, setTooltipText] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

    const [sortBy, setSortBy] = useState<"class" | "dealt" | "taken">("class");
    const [sortAsc, setSortAsc] = useState<boolean>(false);

    const localPlayer = players.find((p) => p.steamId === localPlayerId);
    if (!localPlayer) return <div className="text-red-500">Error: Local player not found</div>;

    const enemyTeam = localPlayer.team === "Red" ? "Blue" : "Red";
    const enemyPlayers = players.filter((p) => p.team === enemyTeam);

    const enriched = enemyPlayers.map((p) => ({
        ...p,
        damageTaken: localPlayer.damageTakenSpread?.[p.steamId] ?? 0,
        damageDealt: localPlayer.damageDealtSpread?.[p.steamId] ?? 0,
    }));

    const sorted = [...enriched].sort((a, b) => {
        if (sortBy === "class") {
            return getClassOrderIndex(a.character) - getClassOrderIndex(b.character);
        }
        const aVal = sortBy === "dealt" ? a.damageDealt : a.damageTaken;
        const bVal = sortBy === "dealt" ? b.damageDealt : b.damageTaken;
        return sortAsc ? aVal - bVal : bVal - aVal;
    });

    const maxDamage = Math.max(
        ...sorted.map((p) => Math.max(p.damageTaken, p.damageDealt)),
        1
    );

    return (
        <div className="w-full p-3 bg-light-100 dark:bg-warm-800 text-warm-800 dark:text-light-100 font-semibold rounded-md">
            <h3 className="text-sm text-warm-800 dark:text-light-100 font-semibold mb-2 border-b pb-1 border-warm-500">Damage Spread</h3>
            {/* Headers */}
            <div className="flex items-center gap-1  text-light-200 font-semibold mb-1 select-none ">
                <div
                    className="flex-1 text-right cursor-pointer hover:text-brand-orange"
                    onClick={() => {
                        if (sortBy === "taken") {
                            if (sortAsc) {
                                setSortBy("class");
                            } else {
                                setSortAsc(true);
                            }
                        } else {
                            setSortBy("taken");
                            setSortAsc(false);
                        }
                    }}
                >
                    Damage Taken <span className="text-xs">{sortBy === "taken" ? (sortAsc ? "▲" : "▼") : ""} </span>
                </div>
                <div className="w-8" />
                <div
                    className="flex-1 text-left cursor-pointer hover:text-brand-orange"
                    onClick={() => {
                        if (sortBy === "dealt") {
                            if (sortAsc) {
                                setSortBy("class");
                            } else {
                                setSortAsc(true);
                            }
                        } else {
                            setSortBy("dealt");
                            setSortAsc(false);
                        }
                    }}
                >
                    Damage Dealt <span className="text-xs">{sortBy === "dealt" ? (sortAsc ? "▲" : "▼") : ""}</span>
                </div>
            </div>

            <div className="gap-1 px-8">
                {sorted.map((player) => {
                    const takenPct = (player.damageTaken / maxDamage) * 100;
                    const dealtPct = (player.damageDealt / maxDamage) * 100;
                    const isHovered = hoveredPlayerId === null || hoveredPlayerId === player.steamId;

                    return (
                        <div
                            key={player.steamId}
                            className={`flex items-center gap-1 transition-opacity duration-150 ${isHovered ? "opacity-100" : "opacity-30"
                                }`}
                            onMouseEnter={(e) => {
                                setHoveredPlayerId(player.steamId);
                                setTooltipText(player.name);
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                            }}
                            onMouseLeave={() => {
                                setHoveredPlayerId(null);
                                setTooltipText(null);
                                setTooltipPos(null);
                            }}
                        >
                            {/* Left (Taken) */}
                            <div className="flex-1 flex justify-end items-center h-6 py-0.5 text-xs relative">
                                <div
                                    className={`border-2 rounded h-full transition-all relative duration-200 ease-in-out ${localPlayer.team === "Blue"
                                        ? "bg-brand-red border-brand-red-dark"
                                        : "bg-brand-blue border-brand-blue-dark"
                                        }`}
                                    style={{ width: `${takenPct}%` }}
                                >
                                    <div
                                        className="absolute right-full mr-1.5 mt-0.5 font-bold text-white"
                                        style={{ minWidth: "2rem", textAlign: "right" }}
                                    >
                                        {player.damageTaken}
                                    </div>
                                </div>
                            </div>

                            {/* Icon */}
                            <div className="w-8 flex justify-center items-center">
                                <img
                                    key={player.character}
                                    src={`/classIcons/${getClassIconFilename(player.character)}`}
                                    alt={player.character}
                                    className="w-5 h-5"
                                />
                            </div>

                            {/* Right (Dealt) */}
                            <div className="flex-1 flex justify-start items-center h-6 py-0.5 text-xs relative">
                                <div
                                    className={`border-2 rounded h-full transition-all relative duration-200 ease-in-out ${localPlayer.team === "Red"
                                        ? "bg-brand-red border-brand-red-dark"
                                        : "bg-brand-blue border-brand-blue-dark"
                                        }`}
                                    style={{ width: `${dealtPct}%` }}
                                >
                                    <div
                                        className="absolute left-full ml-1.5 mt-0.5 font-bold text-white"
                                        style={{ minWidth: "2rem", textAlign: "left" }}
                                    >
                                        {player.damageDealt}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {tooltipText && tooltipPos && (
                    <div
                        className="fixed px-2 py-1 bg-zinc-900 text-white text-sm rounded shadow-lg z-50 pointer-events-none"
                        style={{
                            top: tooltipPos.y - 24,
                            left: tooltipPos.x,
                            transform: "translateX(-50%)",
                        }}
                    >
                        {tooltipText}
                    </div>
                )}
            </div>
        </div>
    );
}