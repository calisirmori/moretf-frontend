export type ClassStat = {
  count: number
  wins: number
  loss: number
  ties: number
  classTime?: number 
}

type Props = {
  stats: Record<string, ClassStat>
}

function secondsToMinutes(seconds: number): string {
  return `${Math.round(seconds / 60)} min`
}

export default function ProfileClassStats({ stats }: Props) {
  const entries = Object.entries(stats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  return (
    <div className="bg-dark p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Most Played Classes</h3>
      <ul className="space-y-1">
        {entries.map(([className, data]) => (
          <li key={className} className="flex justify-between text-sm">
            <span className="capitalize">{className}</span>
            <span>
              {data.count} games, {data.wins}W {data.loss}L {data.ties}T, {secondsToMinutes(data.classTime ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
