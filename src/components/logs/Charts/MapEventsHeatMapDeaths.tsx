import React, { useEffect, useRef } from "react";
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

interface MapEventsHeatMapProps {
    events: Event[];
    mapName?: string;
    localPlayerId: string;
}

function transformCoordinates(x: number, y: number, mapName: string = "default") {
    const { scale, x: calibX, y: calibY } = mapCordinates[mapName] || mapCordinates.default;
    const xAdj = ((x - (calibX + 910 * scale)) / scale) * 0.097656 + 50;
    const yAdj = ((y - (calibY - 512 * scale)) / scale) * -0.097656 + 50;
    return { x: xAdj, y: yAdj };
}

function getColorFromValue(value: number): [number, number, number, number] {
    const clamped = Math.min(Math.max(value, 0), 1);
    if (clamped === 0) return [0, 0, 0, 0];

    if (clamped < 0.2) return [0, 0, 255, clamped * 200];      // blue
    if (clamped < 0.4) return [0, 255, 0, clamped * 200];      // green
    if (clamped < 0.7) return [255, 255, 0, clamped * 200];    // yellow
    return [255, 0, 0, clamped * 220];                         // red
}

const MapEventsHeatMapDeaths: React.FC<MapEventsHeatMapProps> = ({
    events,
    mapName = "default",
    localPlayerId,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        const killEvents = events.filter(
            (e) => e.eventType === "kill" && e.targetPlayerID === localPlayerId
        );

        const density = new Float32Array(width * height);
        const radius = 25;

        // Accumulate heat using radial falloff
        for (const event of killEvents) {
            const pos = transformCoordinates(
                event.targetPlayerLocation.x,
                event.targetPlayerLocation.y,
                mapName
            );
            const cx = Math.floor((pos.x / 100) * width);
            const cy = Math.floor((pos.y / 100) * height);

            for (let dx = -radius; dx <= radius; dx++) {
                for (let dy = -radius; dy <= radius; dy++) {
                    const x = cx + dx;
                    const y = cy + dy;
                    if (x < 0 || y < 0 || x >= width || y >= height) continue;

                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > radius) continue;

                    const falloff = Math.exp(-dist * dist / (radius * 3)); // smoother
                    density[y * width + x] += falloff;
                }
            }
        }

        let maxVal = 0;
        for (let i = 0; i < density.length; i++) {
            if (density[i] > maxVal) maxVal = density[i];
        }

        const imageData = ctx.createImageData(width, height);
        for (let i = 0; i < density.length; i++) {
            const value = density[i] / maxVal;
            const [r, g, b, a] = getColorFromValue(value);
            const index = i * 4;
            imageData.data[index] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = a;
        }

        ctx.putImageData(imageData, 0, 0);
    }, [events, mapName, localPlayerId]);

    return (
        <div className="w-full p-3 bg-light-100 dark:bg-warm-800 text-warm-800 dark:text-light-100 font-semibold rounded-md">
            <h3 className="text-sm text-warm-800 dark:text-light-100 font-semibold pb-1">Deaths Heatmap</h3>
            <div className="relative aspect-square overflow-hidden rounded">
                <img
                    src={`/mapImages/${mapName}.png`}
                    alt={`${mapName} map`}
                    className="absolute w-full h-full object-contain"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-90"
                />
            </div>
        </div>
    );
};

export default MapEventsHeatMapDeaths;
