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

export default function ProfileClassStats({ stats }: Props) {
  const entries = Object.entries(stats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  const maxGames = Math.max(...entries.map(([_, data]) => data.count))

  return (
    <div className="bg-dark p-3 bg-light-100 dark:bg-warm-800 text-warm-800 dark:text-light-100 font-semibold rounded-md">
      <h3 className="text-lg text-warm-800 dark:text-light-100 font-semibold mb-2">Most Played Classes</h3>
      <ul>
        {entries.map(([classPlayed, data], i) => {
          const winrate = data.count > 0
            ? parseFloat(((data.wins / data.count) * 100).toFixed(1))
            : 0
          const gameBarWidth = (data.count / maxGames) * 100
          return (
            <li
              key={classPlayed}
              className={`px-3 gap-4 flex items-center relative h-[54px] ${i % 2 === 0 ? "bg-light-300/30 dark:bg-warm-700/30" : ""
                } border-b border-transparent`}
            >
              {/* Class icon */}
              <div className="ml-1 w-9 flex justify-center items-center">
                <img
                  src={`/classIcons/${classPlayed}.png`}
                  alt="class icon"
                  className="h-6 w-6"
                />
              </div>

              {/* Class name */}
              <span className="capitalize w-28 max-sm:truncate max-sm:w-24">
                {classPlayed}
              </span>

              {/* Game count bar */}
              <div className="flex-1 flex items-center w-full">
                <div className="w-12 text-end mr-2 text-warm-300 dark:text-light-300">
                  {data.count}
                </div>
                <div className="relative bg-light-300/30 dark:bg-warm-700 h-2 rounded-sm w-full overflow-hidden">
                  <div
                    className="bg-brand-orange h-full rounded-sm transition-all duration-300"
                    style={{ width: `${gameBarWidth}%` }}
                  />
                </div>
              </div>


              {/* Win/Loss/Tie + winrate bar */}
              <div className="flex-1 text-warm-300 dark:text-light-300 flex ">
                <div className="w-16 text-right">
                  {winrate}%
                </div>
                <div className="w-full dark:bg-warm-700 bg-light-300/60 h-2 rounded-sm mt-2 overflow-hidden ml-2">
                  <div
                    className={`h-2 rounded-sm transition-all duration-300 ${winrate >= 50 ? "bg-green-600" : "bg-brand-red-dark"
                      }`}
                    style={{ width: `${winrate}%` }}
                  />
                </div>
              </div>

              {/* Playtime in hours */}
              <div className="text-end text-warm-300 dark:text-light-300 font-semibold max-md:text-xs md:text-sm w-20">
                {((data.classTime ?? 0) / 3600).toFixed(0)} hrs
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
