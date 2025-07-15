export default function ProfileOverallStats({ overallStats }: { overallStats: any }) {
  return (
    <div className="bg-dark p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Overall Stats</h3>
      <p>Total Matches: {overallStats.count}</p>
      <p>Win Rate: {(overallStats.win_rate * 100).toFixed(1)}%</p>
      <p>Time Played: {Math.round(overallStats.time_played / 60)} hrs</p>
    </div>
  );
}
