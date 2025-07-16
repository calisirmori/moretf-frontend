export default function ProfileOverallStats({ overallStats }: { overallStats: any }) {
  const winrate = parseFloat((overallStats.wins / overallStats.count * 100).toFixed(1));
  return (
    <div className="grid max-md:grid-rows-2 md:grid-cols-2 gap-2 max-md:h-36 md:h-16 text-warm-800 dark:text-light-100">
      <div className="dark:bg-warm-800 bg-light-100 h-full rounded-md">
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex-col p-3 w-full">
            <div className="text-xl font-medium"><span className="text-brand-orange">{overallStats.count ?? 0}</span> Matches <span className="text-xs text-warm-300">{(overallStats.totalTime / 3600).toFixed(1)} hrs</span></div>
            <div className="bg-brand-orange h-2 rounded-sm mt-1"></div>
          </div>
        </div>
      </div>
      <div className="dark:bg-warm-800 bg-light-100 h-full rounded-md">
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex-col p-3 w-full">
            <div className="text-xl font-medium">
              <span className={winrate >= 50 ? "text-green-600" : "text-brand-red"}>
                {winrate}%
              </span> Winrate
            </div>
            <div className="w-full dark:bg-warm-700 bg-light-300/60 h-2 rounded-sm mt-1 overflow-hidden">
              <div
                className={`h-full transition-all rounded-sm duration-300 ${winrate >= 50 ? 'bg-green-600' : 'bg-brand-red-dark'}`}
                style={{ width: `${winrate}%` }}
              ></div>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
}
