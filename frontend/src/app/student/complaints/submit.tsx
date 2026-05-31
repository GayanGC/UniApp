import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ComplaintForm } from '@/components/complaints/ComplaintForm';

export default function StudentComplaintSubmitPage() {
  const { user, token, loading } = useAuth();

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user || user.role !== 'student') {
    return <div className="text-center py-10 text-red-600">Access denied. Only students can submit complaints.</div>;
  }
  if (!token) {
    return <div className="text-center py-10 text-red-600">Authentication token not available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <ComplaintForm token={token} onSuccess={() => {}} />
    </div>
  );
}