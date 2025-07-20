import { useEffect, useState } from "react"
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.more.tf";
interface Props {
  logId: string
}

export default function LogViewer({ logId }: Props) {
  const [data, setData] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${baseUrl}/log/${logId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch log")
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
  }, [logId])

  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!data) return <p>Loading log data...</p>

  return (
    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
