'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole } from '@/types';
import BrandHeader from '@/components/BrandHeader';
import CreateBoardingForm from '@/components/boarding/CreateBoardingForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function CreateBoardingContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BrandHeader subtitle="Provider Portal - Create Listing" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="mb-6">
          <Link
            href="/provider/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <CreateBoardingForm />
      </main>
    </div>
  );
}

export default function CreateBoardingPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.BOARDING_PROVIDER]}>
      <CreateBoardingContent />
    </ProtectedRoute>
  );
}
