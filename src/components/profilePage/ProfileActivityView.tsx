import { useMemo } from 'react';

export default function ProfileActivityView({ activity }: { activity: any[] }) {
  const byDate = useMemo(() => {
    const map = new Map();
    activity.forEach(a => {
      map.set(a.activityDate, a);
    });
    return map;
  }, [activity]);

  // Build last 90 days of data
  const last90Days = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (89 - i));
    const key = date.toISOString().split('T')[0];
    const a = byDate.get(key) || {};
    return {
      date: key,
      count: a.totalMatches || 0,
      wins: a.wins || 0,
      losses: a.losses || 0,
    };
  });

  // Convert to weeks (columns) of days (rows)
  const weeks = [];
  for (let i = 0; i < last90Days.length; i += 7) {
    weeks.push(last90Days.slice(i, i + 7));
  }

  // Weekday labels (optional)
  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-light-100 dark:bg-warm-800 p-3 rounded-md">
      <h3 className="text-lg font-semibold text-warm-800 dark:text-light-100 mb-2">Activity (last 90 days)</h3>

      <div className="flex justify-center items-center">
        {/* Weekday labels on the left */}
        <div className="flex flex-col justify-between mr-2 gap-1.5 text-xs text-warm-500 dark:text-light-500 ">
          {Array.from({ length: 7 }, (_, i) =>
            weekdayLabels.includes(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]) ? (
              <div key={i} className="h-3.5">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
            ) : (
              <div key={i} className="h-3.5" />
            )
          )}
        </div>

        {/* Activity squares */}
        <div className="grid grid-flow-col auto-cols-min gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dIdx) => {
                const day = week[dIdx];
                if (!day) return <div key={dIdx} className="w-4 h-4 bg-transparent" />;
                const { count, wins, losses, date } = day;

                return (
                  <div key={dIdx}
                    title={`${date}: ${wins}W - ${losses}L`}
                    className={`relative w-4 h-4 rounded-sm hover:scale-110 bg-opacity-70 group ${count === 0
                      ? 'bg-gray-300 dark:bg-warm-700 '
                      : wins > losses
                        ? 'bg-green-500'
                        : wins === losses
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
