'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PastPapersFilter } from '@/components/PastPapersFilter';
import { PastPapersList } from '@/components/PastPapersList';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, type PastPaper } from '@/types';
import { apiService } from '@/services/api';
import { FileText, LogOut, Home } from 'lucide-react';
import Link from 'next/link';

function PastPapersContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch papers whenever search params change
  useEffect(() => {
    fetchPapers();
  }, [searchParams]);

  const fetchPapers = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Build filter object from URL params
      const filters: any = {};
      
      const university = searchParams.get('university');
      const faculty = searchParams.get('faculty');
      const subjectName = searchParams.get('subjectName');
      const academicYear = searchParams.get('academicYear');
      const examYear = searchParams.get('examYear');

      if (university) filters.university = university;
      if (faculty) filters.faculty = faculty;
      if (subjectName) filters.subjectName = subjectName;
      if (academicYear) filters.academicYear = parseInt(academicYear, 10);
      if (examYear) filters.examYear = parseInt(examYear, 10);

      // Fetch papers from API
      const response = await apiService.getPastPapers(filters);
      setPapers(response.data);
    } catch (err: any) {
      console.error('Error fetching papers:', err);
      setError('Failed to load past papers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Past Papers</h1>
                  <p className="text-sm text-gray-500">Browse and download examination papers</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.fullName}
              </span>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold mb-2">
            📚 Past Examination Papers
          </h2>
          <p className="text-primary-100">
            Search and download past papers to help with your studies. Use the filters below to find papers for your courses.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        {/* Filter Component */}
        <PastPapersFilter onFilterChange={fetchPapers} />

        {/* Papers List */}
        <PastPapersList papers={papers} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default function PastPapersPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <PastPapersContent />
      </Suspense>
    </ProtectedRoute>
  );
}
