import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  CategoryScale,
  Filler,
} from "chart.js";

import type { ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";
import { useEffect, useMemo, useRef, useState } from "react";
import "chartjs-adapter-date-fns";

ChartJS.register(
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

export default function TeamPerformanceChart({
  timeline,
}: {
  timeline: any[];
}) {
  const [metric, setMetric] = useState<"damage" | "healing" | "kills">(
    "damage"
  );

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

  const { labels, datasets, maxAbs } = useMemo(() => {
    const labels: number[] = [];
    const values: number[] = [];
    let sum = 0;

    for (const { intervalStart, players } of timeline) {
      labels.push(intervalStart - baseStart);

      let blue = 0;
      let red = 0;
      for (const [_, stats] of Object.entries<any>(players)) {
        if (stats.team === "Blue") blue += stats[metric] || 0;
        if (stats.team === "Red") red += stats[metric] || 0;
      }

      sum += blue - red;
      values.push(sum);
    }

    const maxAbs = Math.max(...values.map((v) => Math.abs(v)));

    return {
      labels,
      datasets: [
        {
          label: "Advantage",
          data: values,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "transparent",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 2,
          borderWidth: 2,
          borderColor: (ctx: any) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return;
            const gradient = canvasCtx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, "rgba(57, 92, 120, 1)");
            gradient.addColorStop(0.5, "rgba(57, 92, 120, 1)");
            gradient.addColorStop(0.5, "rgba(189, 59, 59, 1)");
            gradient.addColorStop(1, "rgba(189, 59, 59, 1)");
            return gradient;
          },
          backgroundColor: (ctx: any) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return;
            const gradient = canvasCtx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, "rgba(57, 92, 120, 0.4)");
            gradient.addColorStop(0.5, "rgba(57, 92, 120, 0.4)");
            gradient.addColorStop(0.5, "rgba(189, 59, 59, 0.4)");
            gradient.addColorStop(1, "rgba(189, 59, 59, 0.4)");
            return gradient;
          },
        },
      ],
      maxAbs,
    };
  }, [timeline, metric]);

  const options: ChartOptions<"line"> = {
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
            const sec = String(Math.floor((x % 60000) / 1000)).padStart(2, "0");
            return `${min}:${sec}`;
          },
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        type: "linear",
        ticks: {
          color: isDark ? "#e5e3e0" : "#333",
          callback: (value) => {
            const raw = Number(value);
            const minutes = Math.floor(raw / 60000);
            const seconds = String(Math.floor((raw % 60000) / 1000)).padStart(
              2,
              "0"
            );
            return `${minutes}:${seconds}`;
          },
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        },
      },
      y: {
        type: "linear",
        suggestedMin: -maxAbs,
        suggestedMax: maxAbs,
        ticks: {
          color: isDark ? "#e5e3e0" : "#333",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        },
        title: {
          display: true,
          text: metric.charAt(0).toUpperCase() + metric.slice(1),
          color: isDark ? "#e5e3e0" : "#333",
        },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto text-white mt-10">
      <div className="flex justify-start items-center mb-4 gap-4">
        <label className="mr-2">Metric:</label>
        <select
          className="text-black px-2 py-1 rounded"
          value={metric}
          onChange={(e) => setMetric(e.target.value as any)}
        >
          <option value="damage">Damage</option>
          <option value="healing">Healing</option>
          <option value="kills">Kills</option>
        </select>
      </div>

      <Chart
        ref={chartRef}
        type="line"
        data={{ labels, datasets }}
        options={options}
        plugins={[tooltipLinePlugin]}
      />
    </div>
  );
}
