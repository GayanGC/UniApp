'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, Complaint, ComplaintStatus } from '@/types';
import BrandHeader from '@/components/BrandHeader';
import { apiService } from '@/services/api';
import { AlertCircle, ShieldAlert, CheckCircle2, Clock, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function StudentComplaintsContent() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Accommodation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMyComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newComplaint = await apiService.submitComplaint({
        title,
        description,
        category,
      });
      // Append optimistically
      setComplaints((prev) => [newComplaint, ...prev]);
      setTitle('');
      setDescription('');
      setCategory('Accommodation');
      toast.success('Complaint submitted successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.RESOLVED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case ComplaintStatus.IN_PROGRESS:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <BrandHeader subtitle="Complaints & Support" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Pane: Submission Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-1">
                  <ShieldAlert className="w-6 h-6 opacity-90" />
                  <h2 className="text-xl font-bold">Lodge a Complaint</h2>
                </div>
                <p className="text-red-100 text-sm">We're here to help. Report your issue below.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                  >
                    <option value="Accommodation">Accommodation</option>
                    <option value="Campus Facilities">Campus Facilities</option>
                    <option value="Academics">Academics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="Briefly describe the issue..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                    placeholder="Provide all relevant details..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Submit Complaint
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Pane: History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                My Complaint History
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 h-24 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-medium mb-1">No complaints found</h3>
                  <p className="text-gray-500 text-sm">You haven't lodged any complaints yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition bg-white">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                            {complaint.category}
                          </span>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {complaint.title}
                          </h3>
                        </div>
                        {getStatusBadge(complaint.status)}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {complaint.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                        <span>ID: {complaint.id.split('-')[0].toUpperCase()}</span>
                        <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function StudentComplaintsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <StudentComplaintsContent />
    </ProtectedRoute>
  );
}
