export type MapStat = {
  count: number
  wins: number
  loss: number
  ties: number
  mapTime?: number
}

export default function ProfileMapStats({ stats }: { stats: Record<string, MapStat> }) {
  const entries = Object.entries(stats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)

  return (
    <div className="bg-dark p-3 bg-light-100 dark:bg-warm-800 rounded-md text-warm-800 dark:text-light-100 font-semibold ">
      <h3 className="text-xl text-warm-800 dark:text-light-100 font-semibold mb-2">Most Played Maps</h3>
      <ul className="space-y-1">
        {entries.map(([map, data], i) => (
          <li key={map} className={`flex justify-between items-center text-sm h-10 ${i % 2 === 0 && "bg-light-300/30 dark:bg-warm-700/30"}`}>
            <div className="capitalize">{map} <span className="text-xs text-warm-100">({data.count})</span></div>
            <div className="flex-col text-end">
              <div>{((data.wins / data.count) * 100).toFixed(1)}%</div>
              <div className=" text-xs -mt-1">
                <span className="text-green-700">{data.wins}</span> - <span className="text-brand-red">{data.loss}</span> - <span className="text-warm-200">{data.ties}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
