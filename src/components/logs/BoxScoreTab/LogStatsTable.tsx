import React, { useMemo, useState } from "react";

interface Props {
    data: PlayerStats[];
    gameLengthMinutes: number;
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

interface PlayerStats {
    name: string;
    character?: string;
    team: string;
    min: string;
    kills: number;
    deaths: number;
    assists: number;
    damage: number;
    kdr: number;
    kda: number;
    damageTaken: number;
    healing: number;
    ubers: number;
    drops: number;
    airShots: number;
    backStabs: number;
    headShots: number;
    captures: number;
    itemPickups: Record<string, number> | null;
    classStats: Record<string, { classType: string; totalTime: number }> | null;
}

interface Props {
    data: PlayerStats[];
}

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

const TableBody = ({ data, gameLengthMinutes }: { data: PlayerStats[], gameLengthMinutes: number }) => (
    <tbody>
        {data.map((p, i) => (
            <tr
                key={i}
                className={`border-b max-md:text-xs border-warm-500/20 dark:border-light-400/10 ${i % 2 === 0 ? "bg-light-200/40 dark:bg-warm-800/40 " : ""}`}
            >
                <td className={`w-8 text-xs text-center uppercase font-bold pr-2 text-light-50/80 border-b ${p.team == "Blue" ? " bg-brand-blue border-brand-blue-dark" : "bg-brand-red border-brand-red-dark"}`}>{p.team == "Red" ? "Red" : "Blu"}</td>
                <td className="py-1.5 ml-2 border-r border-light-500/20 dark:border-warm-500/80 pr-2 flex items-center gap-2 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    <span className="truncate">{p.name}</span>
                </td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">
                    {p.classStats
                        ? Object.values(p.classStats)
                            .filter((cls: any) => cls.totalTime > 30)
                            .sort((a: any, b: any) => b.totalTime - a.totalTime)
                            .map((cls: any, arr: any[]) => {
                                const opacity = (cls.totalTime / arr[0].totalTime).toFixed(2);
                                return (
                                    <img
                                        key={cls.classType}
                                        src={`/classIcons/${getClassIconFilename(cls.classType)}`}
                                        alt={cls.classType}
                                        className="inline-block w-5 h-5 mr-1"
                                        style={{ opacity }}
                                    />
                                );
                            })
                        : "-"}
                </td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.kills === "number" ? p.kills : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.deaths === "number" ? p.deaths : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.assists === "number" ? p.assists : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.damage === "number" ? p.damage.toFixed(0) : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.damage === "number" ? (p.damage / gameLengthMinutes).toFixed(0) : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">
                    {typeof p.kills === "number" && typeof p.assists === "number" && typeof p.deaths === "number" && p.deaths > 0
                        ? ((p.kills + p.assists) / p.deaths).toFixed(2)
                        : "-"}
                </td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">
                    {typeof p.kills === "number" && typeof p.deaths === "number" && p.deaths > 0
                        ? (p.kills / p.deaths).toFixed(2)
                        : "-"}
                </td>

                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.damageTaken === "number" ? p.damageTaken : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.damageTaken === "number" ? (p.damageTaken / gameLengthMinutes).toFixed(0) : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">
                  {p.itemPickups
                    ? ((p.itemPickups["medkit_small"] || 0) * 1 +
                       (p.itemPickups["medkit_medium"] || 0) * 2 +
                       (p.itemPickups["medkit_large"] || 0) * 4)
                    : 0}
                </td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.backStabs === "number" ? p.backStabs : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.headShots === "number" ? p.headShots : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.airShots === "number" ? p.airShots : "-"}</td>
                <td className="border-r border-light-500/20 dark:border-warm-500/20 text-center">{typeof p.captures === "number" ? p.captures : "-"}</td>
            </tr>
        ))}
    </tbody>
);

const LogStatsTable: React.FC<Props> = ({ data, gameLengthMinutes }) => {
    type SortableKeys = keyof PlayerStats | "teamClass" | "healthPickups" | "kda" | "kdr";
    const [sortKey, setSortKey] = useState<keyof PlayerStats | "teamClass" | "healthPickups">("teamClass");
    type SortDirection = "desc" | "asc" | "default";
    const [sortDirection, setSortDirection] = useState<SortDirection>("default");

    const sortedData = useMemo(() => {
        const sorted = [...data].sort((a, b) => {
            if (sortDirection === "default" || sortKey === "teamClass") {
                const teamCompare = (a.team || "").localeCompare(b.team || "");
                if (teamCompare !== 0) return teamCompare;
                return getClassOrderIndex(a.character || "") - getClassOrderIndex(b.character || "");
            }

            const getValue = (p: PlayerStats, key: keyof PlayerStats | "teamClass" | "healthPickups") => {
                if (key === "kda") {
                    const { kills, assists, deaths } = p;
                    if (typeof kills === "number" && typeof assists === "number" && typeof deaths === "number") {
                        return deaths > 0 ? (kills + assists) / deaths : Infinity;
                    }
                    return -1;
                }
                if (key === "kdr") {
                    const { kills, deaths } = p;
                    if (typeof kills === "number" && typeof deaths === "number") {
                        return deaths > 0 ? kills / deaths : Infinity;
                    }
                    return -1;
                }
                if (key === "teamClass" || key === "character") {
                    const classRank = getClassOrderIndex(p.character || "");
                    const teamRank = p.team === "Blue" ? 0 : 1; // blue first
                    return classRank * 10 + teamRank;
                } 
                if (key === "healthPickups") {
                  const small = p.itemPickups?.["medkit_small"] || 0;
                  const med = p.itemPickups?.["medkit_medium"] || 0;
                  const large = p.itemPickups?.["medkit_large"] || 0;
                  return small * 1 + med * 2 + large * 4;
                }
                return p[key as keyof PlayerStats];
            };

            const aVal = getValue(a, sortKey);
            const bVal = getValue(b, sortKey);

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
            }

            return 0;
        });
        return sorted;
    }, [data, sortKey, sortDirection]);



    const renderSortableHeader = (
      key: keyof PlayerStats | "teamClass" | "healthPickups",
      label: string,
      small: boolean
    ) => {
        const handleClick = () => {
            if (sortKey === key) {
                setSortDirection((prev) =>
                    prev === "default" ? "desc" : prev === "desc" ? "asc" : "default"
                );
                if (sortDirection === "asc") {
                    setSortKey("teamClass");
                }
            } else {
                setSortKey(key);
                setSortDirection("desc");
            }
        };

        const arrow =
            sortKey === key
                ? sortDirection === "asc"
                    ? "▲"
                    : sortDirection === "desc"
                        ? "▼"
                        : ""
                : "";

        return (
            <th
                className={`${small ? "w-8" : "w-12"} border-r border-warm-500/30 dark:border-light-400/20 text-warm-600 dark:text-light-100 text-center cursor-pointer select-none `}
                onClick={handleClick}
            >
                {label} {arrow}
            </th>
        );
    };


    return (
        <div className="text-warm-800 dark:text-light-50 bg-light-100/50 dark:bg-warm-800/60 p-4 font-ttnorms px-10 pt-10">
            <div
                className="relative overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing lg:hidden"
                onMouseDown={(e) => {
                    const container = e.currentTarget;
                    let startX = e.pageX;
                    let scrollLeft = container.scrollLeft;

                    const onMouseMove = (moveEvent: MouseEvent) => {
                        const walk = moveEvent.pageX - startX;
                        container.scrollLeft = scrollLeft - walk;
                    };

                    const onMouseUp = () => {
                        window.removeEventListener("mousemove", onMouseMove);
                        window.removeEventListener("mouseup", onMouseUp);
                    };

                    window.addEventListener("mousemove", onMouseMove);
                    window.addEventListener("mouseup", onMouseUp);
                }}
            >
                <table className="min-w-[1024px] table-fixed text-sm select-none">
                    <thead>
                        <tr className="text-left border-b border-warm-600/60 dark:border-light-400/20 text-warm-600 dark:text-light-400 text-xs uppercase">
                            <th className="w-8 pb-1">Team</th>
                            <th className="w-40 pb-2 border-r border-warm-500/80">Player</th>
                            {renderSortableHeader("character", "C", false)}
                            {renderSortableHeader("kills", "K", true)}
                            {renderSortableHeader("deaths", "D", true)}
                            {renderSortableHeader("assists", "A", true)}
                            {renderSortableHeader("damage", "DA", false)}
                            {renderSortableHeader("damage", "DPM", false)}
                            {renderSortableHeader("kda", "K+A/D", false)}
                            {renderSortableHeader("kdr", "K/D", false)}
                            {renderSortableHeader("damageTaken", "DT", false)}
                            {renderSortableHeader("damageTaken", "DTM", false)}
                            {renderSortableHeader("healthPickups", "HP", true)}
                            {renderSortableHeader("backStabs", "BS", true)}
                            {renderSortableHeader("headShots", "HS", true)}
                            {renderSortableHeader("airShots", "AS", true)}
                            {renderSortableHeader("captures", "CAP", true)}
                        </tr>
                    </thead>
                    <TableBody data={sortedData} gameLengthMinutes={gameLengthMinutes} />
                </table>
            </div>

            <table className="hidden lg:table w-full table-fixed text-sm">
                <thead>
                    <tr className="text-left border-b border-warm-500/30 dark:border-light-400/20 text-warm-600 dark:text-light-400 text-xs uppercase">
                        <th className="w-8 pb-1">Team</th>
                        <th className="w-40 pb-1 border-r border-warm-500/30">Player</th>
                        {renderSortableHeader("character", "C", false)}
                        {renderSortableHeader("kills", "K", true)}
                        {renderSortableHeader("deaths", "D", true)}
                        {renderSortableHeader("assists", "A", true)}
                        {renderSortableHeader("damage", "DA", false)}
                        {renderSortableHeader("damage", "DPM", false)}
                        {renderSortableHeader("kda", "K+A/D", false)}
                        {renderSortableHeader("kdr", "K/D", false)}
                        {renderSortableHeader("damageTaken", "DT", false)}
                        {renderSortableHeader("damageTaken", "DTM", false)}
                        {renderSortableHeader("healthPickups", "HP", true)}
                        {renderSortableHeader("backStabs", "BS", true)}
                        {renderSortableHeader("headShots", "HS", true)}
                        {renderSortableHeader("airShots", "AS", true)}
                        {renderSortableHeader("captures", "CAP", true)}
                    </tr>
                </thead>
                <TableBody data={sortedData} gameLengthMinutes={gameLengthMinutes} />
            </table>
        </div>
    );
};

export default LogStatsTable;