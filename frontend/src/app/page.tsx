'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { GraduationCap, ArrowRight, Users, Home, Shield } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoutes: Record<string, string> = {
        admin: '/admin/dashboard',
        student: '/student/dashboard',
        boarding_provider: '/provider/dashboard',
        prospective: '/prospective/dashboard',
      };
      router.push(dashboardRoutes[user.role] || '/');
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Uni App</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your University Journey
            <br />
            <span className="text-primary-600">Starts Here</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with universities, find accommodation, and manage your student life
            all in one platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg">
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              For Students
            </h3>
            <p className="text-gray-600">
              Manage your profile, find accommodation, and connect with your university community.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              For Providers
            </h3>
            <p className="text-gray-600">
              List your boarding accommodations and connect with students looking for housing.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure & Reliable
            </h3>
            <p className="text-gray-600">
              Your data is protected with industry-standard security and authentication.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h3>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of students and providers on Uni App today.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create Your Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2024 Uni App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
