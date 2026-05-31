'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, type StudentProfile, type UpdateStudentProfileRequest } from '@/types';
import BrandHeader from '@/components/BrandHeader';

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────── */
function FieldDisplay({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-1">{label}</p>
      <p className="text-white font-medium">{value || <span className="text-white/40 italic">Not set</span>}</p>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  name: keyof UpdateStudentProfileRequest;
  value: string;
  placeholder: string;
  onChange: (name: keyof UpdateStudentProfileRequest, val: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                   text-white placeholder-white/30 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                   transition backdrop-blur-sm"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────────── */
function StudentProfileContent() {
  const { user } = useAuth();

  /* ── State ── */
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [form, setForm] = useState<UpdateStudentProfileRequest>({
    university: '',
    faculty: '',
    academicYear: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /* ── Load profile on mount ── */
  useEffect(() => {
    apiService
      .getStudentProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          university: data.university ?? '',
          faculty: data.faculty ?? '',
          academicYear: data.academicYear ?? '',
        });
        setLoadingProfile(false);
      })
      .catch((err) => {
        // 404 = profile not created yet — that's fine, show empty form
        if (err?.response?.status === 404) {
          setLoadingProfile(false);
          return;
        }
        setProfileError(
          err?.response?.data?.message ?? err?.message ?? 'Could not load your profile.',
        );
        setLoadingProfile(false);
      });
  }, []);

  /* ── Handle form change ── */
  const handleChange = (name: keyof UpdateStudentProfileRequest, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const updated = await apiService.updateStudentProfile(form);
      setProfile(updated);
      setSaveSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setSaveError(Array.isArray(msg) ? msg.join(' · ') : msg ?? 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <BrandHeader subtitle="Student Portal" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page heading ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-indigo-300 text-sm mt-1">
            View and update your university details
          </p>
        </div>

        {/* ── User identity card ── */}
        <div className="relative rounded-2xl p-6 mb-8 overflow-hidden
                        bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
          {/* Decorative orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
                            flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{user?.fullName}</h2>
              <p className="text-indigo-300 text-sm">{user?.email}</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30
                               text-indigo-300 text-xs font-medium">
                Student
              </span>
            </div>
          </div>

          {/* Current academic info */}
          {loadingProfile ? (
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-white/10 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : profileError ? (
            <p className="mt-4 text-red-400 text-sm">{profileError}</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-white/10">
              <FieldDisplay label="University" value={profile?.university ?? null} />
              <FieldDisplay label="Faculty" value={profile?.faculty ?? null} />
              <FieldDisplay label="Academic Year" value={profile?.academicYear ?? null} />
            </div>
          )}
        </div>

        {/* ── Update form — glassmorphism card ── */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span>✏️</span> Update Academic Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="University"
              name="university"
              value={form.university ?? ''}
              placeholder="e.g. University of Colombo"
              onChange={handleChange}
            />
            <InputField
              label="Faculty"
              name="faculty"
              value={form.faculty ?? ''}
              placeholder="e.g. Faculty of Science"
              onChange={handleChange}
            />
            <InputField
              label="Academic Year"
              name="academicYear"
              value={form.academicYear ?? ''}
              placeholder="e.g. 2nd Year / 2024"
              onChange={handleChange}
            />

            {/* ── Feedback messages ── */}
            {saveSuccess && (
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30
                              rounded-xl px-4 py-3 text-green-300 text-sm">
                <span>✓</span> Profile updated successfully!
              </div>
            )}
            {saveError && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30
                              rounded-xl px-4 py-3 text-red-300 text-sm">
                <span>⚠</span> {saveError}
              </div>
            )}

            {/* ── Submit button ── */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl font-semibold text-sm transition
                         bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                         hover:from-indigo-600 hover:to-purple-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-indigo-900/40"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}

/* ── Wrapped in ProtectedRoute so only students can access ── */
export default function StudentProfilePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <StudentProfileContent />
    </ProtectedRoute>
  );
}
