// Owner: Member 1 - 
import { Link } from 'react-router-dom'
export default function CaseTable({ cases }) {
  return (
    <table className="w-full text-left">
      <thead><tr><th>Farmer</th><th>Crop</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {cases.map(c => (
          <tr key={c.id}>
            <td>{c.farmer}</td>
            <td>{c.crop}</td>
            <td>{c.status}</td>
            <td><Link to={`/expert/case/${c.id}`} className="text-blue-600">View</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
