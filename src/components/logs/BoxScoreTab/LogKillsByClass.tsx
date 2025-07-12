import React, { useState, useMemo } from "react";

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
] as const;

const getClassOrderIndex = (cls: string) => {
  const lower = cls?.toLowerCase();
  return CLASS_ORDER.indexOf(lower as typeof CLASS_ORDER[number]) === -1
  ? 999
  : CLASS_ORDER.indexOf(lower as typeof CLASS_ORDER[number]);
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

  return map[className.toLowerCase()] ?? "scout.png";
};

interface Player {
  team: string;
  name: string;
  character?: string;
  killsByClass: Record<string, number>;
  assistByClass: Record<string, number>;
  deathsByClass: Record<string, number>;
  kills: number;
}

interface Props {
  data: Player[];
}

type Mode = "kills" | "assists" | "deaths";
type SortKey =
  | "teamClass"
  | "character"
  | "name"
  | "kills"
  | (typeof CLASS_ORDER)[number];
type SortDirection = "asc" | "desc" | "default";

const LogKillsByClass: React.FC<Props> = ({ data }) => {
  const [mode, setMode] = useState<Mode>("kills");
  const [sortKey, setSortKey] = useState<SortKey>("teamClass");
  const [sortDirection, setSortDirection] = useState<SortDirection>("default");

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (sortDirection === "default" || sortKey === "teamClass") {
        const teamCompare = a.team.localeCompare(b.team);
        if (teamCompare !== 0) return teamCompare;
        return (
          getClassOrderIndex(a.character || "") -
          getClassOrderIndex(b.character || "")
        );
      }

      const getValue = (p: Player): number | string => {
        if (CLASS_ORDER.includes(sortKey as any)) {
          const val =
            mode === "kills"
              ? p.killsByClass[sortKey]
              : mode === "assists"
              ? p.assistByClass[sortKey]
              : p.deathsByClass[sortKey];
          return val ?? 0;
        }
        if (sortKey === "character")
          return getClassOrderIndex(p.character || "");
        if (sortKey === "name") return p.name.toLowerCase();
        if (sortKey === "kills") return p.kills;
        return "";
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });

    return sorted;
  }, [data, mode, sortKey, sortDirection]);

  const renderSortableHeader = (key: SortKey, label: string) => {
    const handleClick = () => {
      if (sortKey === key) {
        setSortDirection((prev) =>
          prev === "default" ? "desc" : prev === "desc" ? "asc" : "default"
        );
        if (sortDirection === "asc") setSortKey("teamClass");
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
        className="cursor-pointer w-8 border-r border-warm-500/30 dark:border-light-400/20 text-warm-600 dark:text-light-100 text-center text-xs uppercase"
        onClick={handleClick}
        title={label}
      >
        {label} {arrow}
      </th>
    );
  };

  const renderTable = (isDesktop: boolean) => (
    <table
      className={`${
        isDesktop ? "hidden lg:table" : "lg:hidden min-w-[1024px]"
      } w-full table-fixed text-sm`}
    >
      <thead>
        <tr className="border-b border-warm-500/30 dark:border-light-400/20 text-warm-600 dark:text-light-400 text-xs uppercase">
          <th className="w-8">Team</th>
          <th className="w-40 border-r border-warm-500/30">Player</th>
          {renderSortableHeader("character", "C")}
          {CLASS_ORDER.map((cls) =>
            renderSortableHeader(
              cls,
              (
                <img
                  src={`/classIcons/${getClassIconFilename(cls)}`}
                  alt={cls}
                  className="w-5 h-5 mx-auto"
                />
              ) as any
            )
          )}
          {renderSortableHeader("kills", "K")}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((p, i) => {
          const stats =
            mode === "kills"
              ? p.killsByClass
              : mode === "assists"
              ? p.assistByClass
              : p.deathsByClass;

          return (
            <tr
              key={i}
              className={`border-b border-warm-500/20 dark:border-light-400/10 ${
                i % 2 === 0 ? "bg-light-200/40 dark:bg-warm-800/40" : ""
              }`}
            >
              <td
                className={`w-8 text-xs text-center uppercase font-bold text-light-50/80 ${
                  p.team === "Blue"
                    ? "bg-brand-blue border-brand-blue-dark"
                    : "bg-brand-red border-brand-red-dark"
                }`}
              >
                {p.team === "Red" ? "Red" : "Blu"}
              </td>
              <td className="md:py-1.5 border-r border-light-500/20 dark:border-warm-500/80 px-2 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                {p.name}
              </td>
              <td className="text-center border-r border-light-500/20 dark:border-warm-500/20">
                <img
                  src={`/classIcons/${getClassIconFilename(
                    p.character || "scout"
                  )}`}
                  alt={p.character ?? "unknown"}
                  className="w-5 h-5 mx-auto"
                />
              </td>
              {CLASS_ORDER.map((cls) => (
                <td
                  key={cls}
                  className="text-center border-r border-light-500/20 dark:border-warm-500/20"
                >
                  {stats?.[cls] ?? 0}
                </td>
              ))}
              <td className="text-center border-r border-light-500/20 dark:border-warm-500/20">
                {p.kills}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="text-warm-800 dark:text-light-50 bg-light-200/60 dark:bg-warm-800/90 p-4 font-ttnorms px-10">
      <div className="flex justify-center gap-2 mb-4">
        {(["kills", "assists", "deaths"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 text-sm rounded border transition ${
              mode === m
                ? "bg-light-800 dark:bg-warm-600 text-white border-light-800 dark:border-warm-600"
                : "bg-light-100 dark:bg-warm-900 text-zinc-700 dark:text-light-300 border-zinc-400 dark:border-warm-700 hover:border-brand-orange hover:text-brand-orange dark:hover:text-brand-orange dark:hover:border-brand-orange"
            }`}
          >
            {m[0].toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <div className="md:flex justify-center items-center">
        <div className="max-w-4xl">
          <div
            className="relative overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing lg:hidden "
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
            {renderTable(false)}
          </div>
          {renderTable(true)}
        </div>
      </div>
    </div>
  );
};

export default LogKillsByClass;
