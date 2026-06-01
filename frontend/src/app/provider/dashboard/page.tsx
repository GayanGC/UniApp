'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ProviderAnalytics } from '@/types';
import { Home, User, PlusCircle, List, Star, Activity, BarChart2 } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

function ProviderDashboardContent() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ProviderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getProviderAnalytics()
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <BrandHeader subtitle="Provider Portal" />

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
          <Link href="/provider/dashboard/create" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <PlusCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Listing</h3>
              <p className="text-sm text-gray-600">
                Add a new boarding accommodation listing
              </p>
            </div>
          </Link>

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

        {/* Analytics Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Performance Analytics
          </h3>
          
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-28 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 h-80 animate-pulse"></div>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                  <p className="text-sm font-semibold text-blue-800 mb-1 uppercase tracking-wider relative z-10">Total Listings</p>
                  <p className="text-4xl font-black text-gray-900 relative z-10">{analytics.totalPosts}</p>
                </div>
                
                <div className="bg-gradient-to-br from-white to-yellow-50 border border-yellow-100 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-100 rounded-full opacity-50"></div>
                  <p className="text-sm font-semibold text-yellow-800 mb-1 uppercase tracking-wider relative z-10 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-600" /> Global Rating
                  </p>
                  <p className="text-4xl font-black text-gray-900 relative z-10">
                    {analytics.averageRating > 0 ? analytics.averageRating : '-'}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-100 rounded-full opacity-50"></div>
                  <p className="text-sm font-semibold text-purple-800 mb-1 uppercase tracking-wider relative z-10">Total Reviews</p>
                  <p className="text-4xl font-black text-gray-900 relative z-10">{analytics.totalReviewsCount}</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-gray-400" />
                  Rating Distribution
                </h4>
                
                {analytics.totalReviewsCount > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={analytics.ratingDistribution.map(d => ({
                          name: `${d.rating} Stars`,
                          count: d.count,
                        }))}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <Tooltip 
                          cursor={{ fill: '#F3F4F6' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                          {
                            analytics.ratingDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.rating >= 4 ? '#34D399' : entry.rating === 3 ? '#FBBF24' : '#F87171'} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] w-full flex flex-col items-center justify-center bg-gray-50 rounded-xl">
                    <Star className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No reviews received yet</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
              Failed to load analytics data.
            </div>
          )}
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
