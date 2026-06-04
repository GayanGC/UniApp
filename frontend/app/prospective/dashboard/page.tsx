'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { GraduationCap, Search, MapPin, LogOut, BookOpen, Info } from 'lucide-react';

function ProspectiveDashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Uni App</h1>
                <p className="text-sm text-gray-500">Prospective Student Portal</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {user?.fullName}!
          </h2>
          <p className="text-orange-100">
            Explore universities and find your perfect accommodation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse Universities</h3>
            <p className="text-sm text-gray-600">
              Explore universities and their programs
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Find Accommodation</h3>
            <p className="text-sm text-gray-600">
              Search for boarding near your chosen university
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Resources</h3>
            <p className="text-sm text-gray-600">
              Access guides and helpful information
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Ready to become a student?
              </h3>
              <p className="text-gray-600 mb-4">
                Once you've been accepted to a university, you can update your profile to student status
                and access additional features like student profile management.
              </p>
              <Button variant="outline" size="sm">
                Update Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="font-semibold text-orange-900 mb-2">
            🎓 Prospective Student Dashboard
          </h3>
          <p className="text-orange-800">
            This is your prospective student dashboard. You have successfully logged in with role-based authentication.
            Only users with the "prospective" role can access this page.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ProspectiveDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PROSPECTIVE]}>
      <ProspectiveDashboardContent />
    </ProtectedRoute>
  );
}
