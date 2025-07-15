export default function ProfileRecentMatches({ matches }: { matches: any[] }) {
  return (
    <div className="bg-dark p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Recent Matches</h3>
      <ul className="space-y-2">
        {matches.map((match, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{match.title}</span>
            <span>{match.match_result}</span>
            <span>{new Date(match.log_date * 1000).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
