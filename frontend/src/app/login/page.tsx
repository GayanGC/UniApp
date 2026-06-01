'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { formatErrorMessage } from '@/lib/utils';
import { GraduationCap, ShieldCheck, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login, googleLogin, authenticate2FA, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 2FA State
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorUserId, setTwoFactorUserId] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(formData);
      if (response?.requires2FA && response?.userId) {
        setRequires2FA(true);
        setTwoFactorUserId(String(response.userId));
      }
    } catch (err: any) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setError('');
    setIsLoading(true);
    try {
      const response = await googleLogin(credentialResponse.credential);
      if (response?.requires2FA && response?.userId) {
        setRequires2FA(true);
        setTwoFactorUserId(String(response.userId));
      }
    } catch (err: any) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorUserId) return;
    setError('');
    setIsLoading(true);

    try {
      await authenticate2FA(twoFactorUserId, twoFactorCode);
    } catch (err: any) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4 shadow-lg shadow-primary-500/30">
            {requires2FA ? <ShieldCheck className="w-8 h-8 text-white" /> : <GraduationCap className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {requires2FA ? 'Two-Factor Auth' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 mt-2">
            {requires2FA ? 'Enter the 6-digit code from your authenticator app.' : 'Sign in to your Uni App account'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-8">
          {error && <Alert type="error" message={error} className="mb-6" />}

          {!requires2FA ? (
            <>
              {/* Standard Login */}
              <form onSubmit={handleStandardLogin} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />

                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                  <Mail className="w-4 h-4 mr-2" /> Sign In with Email
                </Button>
              </form>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Or continue with</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Google OAuth */}
              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Sign-In Failed')}
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700 transition">
                    Create one
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 2FA Login */}
              <form onSubmit={handle2FASubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                    Authentication Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-0 outline-none transition"
                    placeholder="000000"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading || twoFactorCode.length !== 6}>
                  Verify & Proceed
                </Button>

                <button 
                  type="button" 
                  onClick={() => setRequires2FA(false)} 
                  className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4 font-medium transition"
                >
                  Cancel & go back
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
