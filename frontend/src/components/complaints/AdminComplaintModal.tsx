import React, { useState } from 'react';

const statusOptions = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export function AdminComplaintModal({ complaint, token, onClose, onUpdated }: {
  complaint: any;
  token: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [status, setStatus] = useState(complaint.status);
  const [adminNotes, setAdminNotes] = useState(complaint.admin_notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`/api/v1/admin/complaints/${complaint.complaint_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });
      if (!res.ok) throw new Error('Update failed');
      setSuccess(true);
      onUpdated();
    } catch (err) {
      setError('Failed to update complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-2">Complaint #{complaint.complaint_id}</h2>
        <div className="mb-2"><strong>Subject:</strong> {complaint.subject}</div>
        <div className="mb-2"><strong>Category:</strong> {complaint.category}</div>
        <div className="mb-2"><strong>Submitted By:</strong> {complaint.is_anonymous ? 'Anonymous' : (complaint.submitted_by_user?.fullName || complaint.submitted_by_user?.user_id || 'Unknown')}</div>
        <div className="mb-4"><strong>Description:</strong><br /><span className="whitespace-pre-line">{complaint.description}</span></div>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Status</label>
            <select className="w-full border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)} required>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Admin Notes</label>
            <textarea className="w-full border rounded px-3 py-2" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3} />
          </div>
          {error && <div className="mb-2 text-red-600">{error}</div>}
          {success && <div className="mb-2 text-green-600">Update successful!</div>}
          <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded" disabled={loading}>
            {loading ? 'Updating...' : 'Update Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}