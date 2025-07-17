import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  CategoryScale,
  Filler,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useEffect, useMemo, useRef, useState } from "react";
import "chartjs-adapter-date-fns";
import PlayerSidebar from "./PlayerSidebar";

interface PlayerStats {
  name: string;
  character?: string;
  steamId: string;
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

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  CategoryScale,
  Filler
);

const tooltipLinePlugin = {
  id: "tooltipLine",
  afterDraw(chart: any) {
    if (!chart.tooltip || !chart.tooltip._active?.length) return;
    const ctx = chart.ctx;
    const x = chart.tooltip._active[0].element.x;
    const topY = chart.scales.y.top;
    const bottomY = chart.scales.y.bottom;

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#f08149";
    ctx.stroke();
    ctx.restore();
  },
};

const METRICS = ["kills", "deaths", "damage", "healing"] as const;

export default function TeamPerformancePage({
  timeline,
  players,
}: {
  timeline: any[];
  players: PlayerStats[];
}) {
  const [metric, setMetric] = useState<(typeof METRICS)[number]>("damage");
  const [highlightedPlayers, setHighlightedPlayers] = useState<string[]>([]);
  const chartRef = useRef<any>(null);
  const baseStart = timeline[0]?.intervalStart || 0;
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const { labels, datasets, allPlayersMap, finalValues, lineColors } =
    useMemo(() => {
      const labels: number[] = timeline.map(
        (entry) => entry.intervalStart - baseStart
      );

      const allPlayerIds = new Set<string>();
      const allPlayersMap: Record<string, any> = {};
      const finalValues: Record<string, number> = {};
      const lineColors: Record<string, string> = {};

      for (const frame of timeline) {
        for (const [id, data] of Object.entries<any>(frame.players)) {
          allPlayerIds.add(id);
          if (!allPlayersMap[id]) {
            allPlayersMap[id] = { ...data };
          }
        }
      }

      const colorPalette = [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
        "#ef4444",
        "#ec4899",
        "#14b8a6",
        "#f97316",
        "#6366f1",
        "#22d3ee",
        "#eab308",
        "#7c3aed",
        "#059669",
        "#f43f5e",
        "#a855f7",
        "#0ea5e9",
        "#84cc16",
        "#e11d48",
        "#db2777",
        "#c084fc",
      ];

      const datasets = Array.from(allPlayerIds).map((id, index) => {
        const perTick = timeline.map(
          (frame) => frame.players[id]?.[metric] || 0
        );
        const cumulative = perTick.reduce<number[]>((acc, cur, i) => {
          acc.push((acc[i - 1] || 0) + cur);
          return acc;
        }, []);

        finalValues[id] = cumulative[cumulative.length - 1] || 0;

        const isHighlighted =
          highlightedPlayers.length === 0 || highlightedPlayers.includes(id);
        const baseColor = colorPalette[index % colorPalette.length];
        const transparentColor = baseColor + "15";

        lineColors[id] = baseColor;

        return {
          label: id,
          data: cumulative,
          borderColor: isHighlighted ? baseColor : transparentColor,
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
        };
      });

      return { labels, datasets, allPlayersMap, finalValues, lineColors };
    }, [timeline, metric, highlightedPlayers]);

  const playersByTeam = useMemo(() => {
    const teams: any = { Blue: [], Red: [] };
    for (const [id, data] of Object.entries<any>(allPlayersMap)) {
      teams[data.team]?.push({ id, ...data });
    }

    for (const team in teams) {
      teams[team].sort(
        (a: any, b: any) => (finalValues[b.id] || 0) - (finalValues[a.id] || 0)
      );
    }

    return teams;
  }, [allPlayersMap, finalValues]);

  const toggleHighlight = (id: string) => {
    setHighlightedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-col max-w-7xl mx-auto mt-4 text-white">
      <div className="flex gap-1 mb-3">
        {METRICS.map((m) => (
          <button
            key={m}
            className={`flex-1 font-medium rounded-sm ${
              metric === m
                ? "border-b-2 bg-warm-800 py-2  border-orange-400 text-orange-400"
                : "text-light-800 bg-warm-800/60 hover:text-light-100 hover:bg-warm-800"
            }`}
            onClick={() => {
              setMetric(m);
              setHighlightedPlayers([]);
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-1 w-full">
        <PlayerSidebar
          players={players}
          playersByTeam={playersByTeam}
          finalValues={finalValues}
          highlightedPlayers={highlightedPlayers}
          toggleHighlight={toggleHighlight}
          lineColors={lineColors}
        />

        <div className="w-full flex justify-center items-center">
          <Chart
            ref={chartRef}
            type="line"
            data={{ labels, datasets }}
            options={{
              responsive: true,
              interaction: {
                mode: "index",
                intersect: false,
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    title: (items) => {
                      const x = items[0].parsed.x;
                      const min = Math.floor(x / 60000);
                      const sec = String(
                        Math.floor((x % 60000) / 1000)
                      ).padStart(2, "0");
                      return `${min}:${sec}`;
                    },
                    // label: (context) => {
                    //   const id = context.dataset.label;
                    //   const player = players.find((p) => p.steamId === id);
                    //   const name = player?.name || id;
                    //   const value = context.parsed.y;
                    //   return `${name}: ${value}`;
                    // },
                  },
                },
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  type: "linear",
                  ticks: {
                    color: isDark ? "#e5e3e0" : "#333",
                    callback: (value) => {
                      const raw = Number(value);
                      const minutes = Math.floor(raw / 60000);
                      const seconds = String(
                        Math.floor((raw % 60000) / 1000)
                      ).padStart(2, "0");
                      return `${minutes}:${seconds}`;
                    },
                  },
                  grid: {
                    color: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  },
                },
                y: {
                  type: "linear",
                  ticks: {
                    color: isDark ? "#e5e3e0" : "#333",
                  },
                  grid: {
                    color: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  },
                  title: {
                    display: true,
                    text: metric.charAt(0).toUpperCase() + metric.slice(1),
                    color: isDark ? "#e5e3e0" : "#333",
                  },
                },
              },
            }}
            plugins={[tooltipLinePlugin]}
          />
        </div>
      </div>
    </div>
  );
}
