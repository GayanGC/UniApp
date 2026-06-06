'use client';

import React, { useState } from 'react';
import BrandHeader from '@/components/BrandHeader';
import { apiService } from '@/services/api';
import { ShieldAlert, Send, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AnonymousComplaintDto } from '@/types';

export default function AntiRaggingPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AnonymousComplaintDto>({
    incidentDescription: '',
    location: '',
    dateOfIncident: new Date().toISOString().split('T')[0],
    isUrgent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.submitAnonymousComplaint(formData);
      setSubmitted(true);
      toast.success('Report dispatched securely and anonymously.');
    } catch (err) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-16 selection:bg-red-500/30">
      <BrandHeader subtitle="Safety & Ethics Portal" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Anti-Ragging Anonymous Portal</h1>
          <p className="text-slate-400 text-lg">We stand for a zero-tolerance policy against ragging and harassment.</p>
        </div>

        {submitted ? (
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-10 border border-emerald-500/30 text-center shadow-xl">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Report Submitted Safely</h2>
            <p className="text-slate-400">
              Your anonymous report has been instantly dispatched to the University Welfare division. Action will be taken immediately.
            </p>
            <button onClick={() => window.location.href = '/'} className="mt-8 text-emerald-400 hover:text-emerald-300 font-medium transition">
              Return to Safety
            </button>
          </div>
        ) : (
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden relative">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

            <div className="p-8 border-b border-slate-700/50 flex items-start gap-4 bg-slate-900/30">
              <EyeOff className="w-6 h-6 text-slate-400 mt-1 shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-slate-200">100% Identity Masked</h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  This submission does NOT log your IP address, browser footprint, or account token. It routes directly to the university welfare team with absolute anonymity.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Description of Incident</label>
                <textarea
                  required
                  rows={5}
                  value={formData.incidentDescription}
                  onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                  placeholder="Please describe exactly what happened..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location of Incident</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Campus Cafeteria, Hostel A"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date of Incident</label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.dateOfIncident}
                    onChange={(e) => setFormData({ ...formData, dateOfIncident: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-slate-600 rounded bg-slate-900 peer-checked:bg-red-500 peer-checked:border-red-500 transition"></div>
                    <AlertTriangle className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-200 group-hover:text-white transition">Mark as URGENT (Immediate Danger)</span>
                    <span className="block text-xs text-slate-500 mt-1">Check this if the situation requires immediate physical intervention.</span>
                  </div>
                </label>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-red-900/20 transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Dispatch Secure Report</>}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
