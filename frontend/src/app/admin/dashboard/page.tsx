'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { GraduationCap, Users, Home, LogOut, Settings, BarChart } from 'lucide-react';

function AdminDashboardContent() {
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
                <p className="text-sm text-gray-500">Admin Portal</p>
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {user?.fullName}
          </h2>
          <p className="text-purple-100">
            Manage the entire Uni App platform from here.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Users</p>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Students</p>
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Providers</p>
              <Home className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Listings</p>
              <BarChart className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-sm text-gray-600">
              View and manage all registered users
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Listings</h3>
            <p className="text-sm text-gray-600">
              Oversee all boarding accommodation listings
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-sm text-gray-600">
              Configure platform settings and preferences
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-2">
            👑 Admin Dashboard
          </h3>
          <p className="text-purple-800">
            This is your admin dashboard. You have successfully logged in with role-based authentication.
            Only users with the "admin" role can access this page.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
