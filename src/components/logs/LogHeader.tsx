import React from "react";

interface LogHeaderProps {
  info: {
    id: number;
    title: string;
    map: string;
    matchStartTime: number;
    winner: "Red" | "Blue";
    scoreRed: number;
    scoreBlue: number;
    durationSeconds: number;
    combined: boolean;
    rounds: Record<string, { length: number; winner: string }>;
  };
}

const LogHeader: React.FC<{ info: LogHeaderProps["info"] }> = ({ info }) => {
  const formattedDate = new Date(info.matchStartTime).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const matchLength = formatDuration(info.durationSeconds);

  return (
    <div className="relative bg-light-200/60 dark:bg-warm-800/90 px-4 py-5 rounded-t-md text-light-50 overflow-hidden">
      <div className="relative z-10 text-center mb-4">
        <h2 className="text-brand-orange font-semibold text-sm">
          {info.title && info.title.toUpperCase()}
        </h2>
        <p className="text-sm font-bold text-warm-300 dark:text-light-500">
          {info.map && info.map.toLocaleUpperCase()} • {formattedDate} • {matchLength} mins
        </p>
      </div>

      <div className="relative z-10 grid max-md:grid-cols-[1fr_30px_40px_30px_1fr] md:grid-cols-[1fr_60px_80px_60px_1fr] w-full h-12 gap-1">
        <div className="w-full flex justify-end items-center bg-brand-blue border-b-4 border-brand-blue-dark rounded-sm px-4 py-2">
          <div className="md:text-2xl font-bold -mb-1">BLU</div>
          <img src="https://rgl.gg/Uploads/TeamLogos/12433-thumb-538b17a3-7219-4e74-a580-c017ca13f7e1..png" alt="" className="h-9 object-contain ml-4" />
        </div>
        <div className="font-ttnormsmono font-bold max-md:text-xl md:text-4xl flex justify-center items-center text-warm-820 dark:text-light-50 ">{info.scoreBlue}</div>
        <div className="max-md:text-xs  md:text-xl font-semibold flex justify-center items-center text-warm-200 dark:text-light-700">FINAL</div>
        <div className="font-ttnormsmono font-bold max-md:text-xl md:text-4xl flex justify-center items-center text-warm-820 dark:text-light-50">{info.scoreRed}</div>
        <div className="w-full flex justify-start items-center bg-brand-red border-b-4 border-brand-red-dark rounded-sm px-4 py-2 relative">
          <img src="https://rgl.gg/Uploads/TeamLogos/13655-thumb-cb591ec2-c084-483c-a49d-a2377a805955..png" alt="" className="h-9 object-contain mr-4" />
          <div className=" md:text-2xl font-bold -mb-1 text-light-50">RED</div>
        </div>
      </div>
    </div>

  );
};

export default LogHeader;
