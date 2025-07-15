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

  const formatMinutes = (seconds: number) => `${Math.round(seconds / 60)} min`

  return (
    <div className="bg-dark p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Most Played Maps</h3>
      <ul className="space-y-1">
        {entries.map(([map, data]) => (
          <li key={map} className="flex justify-between text-sm">
            <span className="capitalize">{map}</span>
            <span>
              {data.wins}-{data.loss}-{data.ties} | {data.count} games, {formatMinutes(data.mapTime ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
