'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area is restricted to specific user roles.
          </p>

          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Your current role:</p>
              <p className="font-semibold text-gray-900">{user.role}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link href={user ? `/${user.role.replace('_', '-')}/dashboard` : '/'}>
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <Button variant="outline" onClick={logout} className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
