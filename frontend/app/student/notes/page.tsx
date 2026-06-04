'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, ResourceItem } from '@/types';
import BrandHeader from '@/components/BrandHeader';
import { BookOpen, FileText, Download, Search, FileUp, Filter } from 'lucide-react';
import { apiService } from '@/services/api';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

function NotesBrowserContent() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [subjectCode, setSubjectCode] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [type, setType] = useState('');

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { subjectCode, year, semester, type };
      const data = await apiService.getResources(filters);
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources', err);
    } finally {
      setLoading(false);
    }
  }, [subjectCode, year, semester, type]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDownload = (filePath: string) => {
    window.open(`${API_BASE}${filePath}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <BrandHeader subtitle="Academic Resources" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Past Papers & Notes
            </h1>
            <p className="text-sm text-gray-500 mt-1">Browse, filter, and download academic resources.</p>
          </div>
          <Link href="/student/notes/upload">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition shadow-sm w-full md:w-auto justify-center">
              <FileUp className="w-4 h-4" />
              Upload Resource
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Subject Code..."
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm uppercase"
            />
          </div>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">All Types</option>
            <option value="past-paper">Past Paper</option>
            <option value="lecture-note">Lecture Note</option>
          </select>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white h-40 rounded-2xl animate-pulse border border-gray-100 p-5"></div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${resource.type === 'past-paper' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {resource.type === 'past-paper' ? 'Past Paper' : 'Lecture Note'}
                    </span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {resource.subjectCode}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2" title={resource.title}>
                    {resource.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span>{resource.year}</span>
                    <span>•</span>
                    <span>Semester {resource.semester}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    <p>Uploaded by {resource.uploader?.fullName || 'Student'}</p>
                    <p>{new Date(resource.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleDownload(resource.filePath)}
                    className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition group-hover:scale-105"
                    title="Download/View"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function NotesBrowserPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.ADMIN]}>
      <NotesBrowserContent />
    </ProtectedRoute>
  );
}
