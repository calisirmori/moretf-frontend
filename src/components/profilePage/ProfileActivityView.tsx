import { useMemo } from 'react';

export default function ProfileActivityView({ activity }: { activity: any[] }) {
  const byDate = useMemo(() => {
    const map = new Map();
    activity.forEach(a => {
      map.set(a.activityDate, a);
    });
    return map;
  }, [activity]);

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

  return (
    <div className="bg-dark p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Activity</h3>
      <div className="grid grid-cols-13 gap-1">
        {last90Days.map((d, i) => (
          <div
            key={i}
            title={`${d.date}: ${d.count} matches`}
            className={`w-3 h-3 rounded-sm ${
              d.count === 0 ? 'bg-gray-700' :
              d.wins > d.losses ? 'bg-green-500' :
              d.wins === d.losses ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
