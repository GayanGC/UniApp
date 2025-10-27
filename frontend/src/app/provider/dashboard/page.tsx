'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { GraduationCap, Home, User, LogOut, PlusCircle, List } from 'lucide-react';

function ProviderDashboardContent() {
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
                <p className="text-sm text-gray-500">Provider Portal</p>
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
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.fullName}!
          </h2>
          <p className="text-green-100">
            Manage your boarding listings and connect with students.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-900">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Boarding Provider
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium text-gray-900">{user?.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-900">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <PlusCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Listing</h3>
            <p className="text-sm text-gray-600">
              Add a new boarding accommodation listing
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <List className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">My Listings</h3>
            <p className="text-sm text-gray-600">
              View and manage your current listings
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bookings</h3>
            <p className="text-sm text-gray-600">
              Track student inquiries and bookings
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Total Listings</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Active Listings</p>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Total Views</p>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-900 mb-2">
            🏠 Provider Dashboard
          </h3>
          <p className="text-green-800">
            This is your boarding provider dashboard. You have successfully logged in with role-based authentication.
            Only users with the "boarding_provider" role can access this page.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ProviderDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.BOARDING_PROVIDER]}>
      <ProviderDashboardContent />
    </ProtectedRoute>
  );
}
