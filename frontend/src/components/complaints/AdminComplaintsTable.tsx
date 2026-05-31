import React, { useEffect, useState } from 'react';

export function AdminComplaintsTable({ token, onSelect }: { token: string; onSelect: (complaint: any) => void }) {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchComplaints() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/v1/admin/complaints', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch complaints');
        const [data] = await res.json();
        setComplaints(data);
      } catch (err) {
        setError('Error loading complaints.');
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, [token]);

  if (loading) return <div className="text-center py-10">Loading complaints...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Subject</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Submitter</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.complaint_id} className="hover:bg-blue-50 cursor-pointer" onClick={() => onSelect(c)}>
              <td className="border px-4 py-2">{c.complaint_id}</td>
              <td className="border px-4 py-2">{c.subject}</td>
              <td className="border px-4 py-2">{c.category}</td>
              <td className="border px-4 py-2">{c.status}</td>
              <td className="border px-4 py-2">{c.is_anonymous ? 'Anonymous' : (c.submitted_by_user?.fullName || c.submitted_by_user?.user_id || 'Unknown')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}