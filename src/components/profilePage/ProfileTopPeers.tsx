type Peer = {
  peer_id64: string
  wins: number
  loss: number
  ties: number
}

type Props = {
  topPeers: Peer[]
  topEnemies: Peer[]
}

export default function ProfileTopPeers({ topPeers, topEnemies }: Props) {
  return (
    <div className="bg-dark p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Teammates</h3>
      <ul className="mb-4 space-y-1">
        {topPeers.map((p) => (
          <li key={p.peer_id64} className="flex justify-between text-sm">
            <span>{p.peer_id64}</span>
            <span>{p.wins}-{p.loss}-{p.ties}</span>
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold mb-2">Enemies</h3>
      <ul className="space-y-1">
        {topEnemies.map((p) => (
          <li key={p.peer_id64} className="flex justify-between text-sm">
            <span>{p.peer_id64}</span>
            <span>{p.wins}-{p.loss}-{p.ties}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
