'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, AlumniFeed } from '@/types';
import BrandHeader from '@/components/BrandHeader';
import { apiService } from '@/services/api';
import { Briefcase, Building, GraduationCap, Loader2 } from 'lucide-react';

function AlumniContent() {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<AlumniFeed[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiService.getAlumniFeed();
        setFeed(res);
      } catch (err) {
        console.error('Failed to load alumni feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <BrandHeader subtitle="Alumni Insights & Tips" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <BrandHeader subtitle="Alumni Insights & Tips" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Career Wisdom from Graduates</h1>
          <p className="text-gray-500 mt-1">Read reviews and tips left by our successful alumni network.</p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-gray-200 ml-4 md:ml-6 space-y-12">
          {feed.length === 0 ? (
             <div className="pl-10 text-gray-500 font-medium">No alumni insights available yet.</div>
          ) : (
            feed.map((post) => (
              <div key={post.id} className="relative pl-8 md:pl-10">
                {/* Timeline Dot */}
                <div className="absolute -left-[11px] top-6 w-5 h-5 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {post.author?.fullName.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{post.author?.fullName || 'Anonymous Alumni'}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3 h-3" /> Class of {new Date(post.createdAt).getFullYear() - 1}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100/50">
                      <span className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" /> {post.role}
                      </span>
                      <span className="text-xs font-medium text-blue-700 flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-500" /> {post.company}
                      </span>
                    </div>
                  </div>

                  <div className="prose prose-sm md:prose-base prose-blue max-w-none text-gray-700">
                    <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-50 text-xs text-gray-400 font-medium">
                    Posted on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}

export default function AlumniPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.PROSPECTIVE]}>
      <AlumniContent />
    </ProtectedRoute>
  );
}
