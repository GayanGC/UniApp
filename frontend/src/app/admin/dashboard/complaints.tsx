import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminComplaintsTable } from '@/components/complaints/AdminComplaintsTable';
import { AdminComplaintModal } from '@/components/complaints/AdminComplaintModal';

export default function AdminComplaintsDashboardPage() {
  const { user, token, loading } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user || user.role !== 'admin') {
    return <div className="text-center py-10 text-red-600">Access denied. Only administrators can view complaints.</div>;
  }
  if (!token) {
    return <div className="text-center py-10 text-red-600">Authentication token not available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Complaints Dashboard</h1>
      <AdminComplaintsTable token={token} onSelect={setSelectedComplaint} key={refreshKey} />
      {selectedComplaint && (
        <AdminComplaintModal
          complaint={selectedComplaint}
          token={token}
          onClose={() => setSelectedComplaint(null)}
          onUpdated={() => {
            setSelectedComplaint(null);
            setRefreshKey(k => k + 1);
          }}
        />
      )}
    </div>
  );
}