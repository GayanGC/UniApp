'use client';

import { useState } from 'react';
import { Download, FileText, Calendar, GraduationCap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import type { PastPaper } from '@/types';
import { apiService } from '@/services/api';

interface PastPapersListProps {
  papers: PastPaper[];
  isLoading: boolean;
}

export function PastPapersList({ papers, isLoading }: PastPapersListProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string>('');

  const handleDownload = async (paper: PastPaper) => {
    setDownloadingId(paper.paperId);
    setDownloadError('');

    try {
      // Call API to download the file
      const blob = await apiService.downloadPastPaper(paper.paperId);

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from paper details
      const filename = `${paper.university}_${paper.faculty}_${paper.subjectName}_${paper.examYear}.pdf`
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_.-]/g, '');
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download error:', error);
      setDownloadError('Failed to download file. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (papers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Past Papers Found
        </h3>
        <p className="text-gray-600 mb-4">
          We couldn't find any past papers matching your criteria.
        </p>
        <p className="text-sm text-gray-500">
          Try adjusting your filters or check back later for new uploads.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {downloadError && (
        <Alert type="error" message={downloadError} className="mb-4" />
      )}

      <div className="grid grid-cols-1 gap-4">
        {papers.map((paper) => (
          <div
            key={paper.paperId}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Paper Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {paper.subjectName}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">University:</span>
                    <span>{paper.university}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Faculty:</span>
                    <span>{paper.faculty}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Academic Year:</span>
                    <span>Year {paper.academicYear}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Exam Year:</span>
                    <span>{paper.examYear}</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={() => handleDownload(paper)}
                  isLoading={downloadingId === paper.paperId}
                  disabled={downloadingId === paper.paperId}
                  size="md"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results count */}
      <div className="text-center text-sm text-gray-600 pt-4">
        Showing {papers.length} {papers.length === 1 ? 'paper' : 'papers'}
      </div>
    </div>
  );
}
