'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Filter, X } from 'lucide-react';

interface PastPapersFilterProps {
  onFilterChange?: () => void;
}

export function PastPapersFilter({ onFilterChange }: PastPapersFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    university: searchParams.get('university') || '',
    faculty: searchParams.get('faculty') || '',
    subjectName: searchParams.get('subjectName') || '',
    academicYear: searchParams.get('academicYear') || '',
    examYear: searchParams.get('examYear') || '',
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/student/past-papers?${queryString}` : '/student/past-papers');
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const clearFilters = () => {
    setFilters({
      university: '',
      faculty: '',
      subjectName: '',
      academicYear: '',
      examYear: '',
    });
    router.push('/student/past-papers');
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  // Academic year options (1-10)
  const academicYearOptions = [
    { value: '', label: 'All Years' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: String(i + 1),
      label: `Year ${i + 1}`,
    })),
  ];

  // Exam year options (last 10 years)
  const currentYear = new Date().getFullYear();
  const examYearOptions = [
    { value: '', label: 'All Exam Years' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    })),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter Papers
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* University */}
        <Input
          label="University"
          type="text"
          placeholder="e.g., Stanford University"
          value={filters.university}
          onChange={(e) => handleFilterChange('university', e.target.value)}
        />

        {/* Faculty */}
        <Input
          label="Faculty"
          type="text"
          placeholder="e.g., Computer Science"
          value={filters.faculty}
          onChange={(e) => handleFilterChange('faculty', e.target.value)}
        />

        {/* Subject Name */}
        <Input
          label="Subject"
          type="text"
          placeholder="e.g., Data Structures"
          value={filters.subjectName}
          onChange={(e) => handleFilterChange('subjectName', e.target.value)}
        />

        {/* Academic Year */}
        <Select
          label="Academic Year"
          value={filters.academicYear}
          onChange={(e) => handleFilterChange('academicYear', e.target.value)}
          options={academicYearOptions}
        />

        {/* Exam Year */}
        <Select
          label="Exam Year"
          value={filters.examYear}
          onChange={(e) => handleFilterChange('examYear', e.target.value)}
          options={examYearOptions}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={applyFilters} className="flex-1 md:flex-none">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" className="flex-1 md:flex-none">
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
