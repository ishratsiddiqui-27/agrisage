// Owner: Member 1 - Ishrat
export default function AgentFeed({ agents = [] }) {
  return (
    <div className="space-y-2">
      {agents.map((a, i) => (
        <div key={i} className="p-2 border rounded">
          <span className="font-bold">{a.agent}:</span> {a.prediction}
        </div>
      ))}
    </div>
  )
}