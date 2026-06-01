'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, LocalMerchant, CampusEvent, StudentProfile } from '@/types';
import BrandHeader from '@/components/BrandHeader';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Tag, CalendarDays, ExternalLink, MapPin, SearchX, Loader2 } from 'lucide-react';

function LifestyleContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState<LocalMerchant[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userProfile = await apiService.getStudentProfile();
        setProfile(userProfile);
        
        // Assume university name corresponds roughly to a campus ID.
        // For MVP, if they belong to "SLIIT", fetch campus ID 1.
        // (In a real scenario, profile would have a direct campusId).
        const campusId = userProfile.university?.toLowerCase().includes('sliit') ? 1 : 2;
        
        const [mRes, eRes] = await Promise.all([
          apiService.getLocalMerchants(campusId),
          apiService.getCampusEvents(campusId),
        ]);
        
        setMerchants(mRes);
        setEvents(eRes);
      } catch (err) {
        console.error('Failed to load lifestyle data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <BrandHeader subtitle="Campus Lifestyle & Offers" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <BrandHeader subtitle="Campus Lifestyle & Offers" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Campus Hub</h1>
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> Customized for {profile?.university || 'your location'}
            </p>
          </div>
        </div>

        {/* Local Offers */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-500" />
            Local Merchant Discounts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchants.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                <SearchX className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No active discounts for your campus right now.</p>
              </div>
            ) : (
              merchants.map(merchant => (
                <div key={merchant.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{merchant.name}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md mt-1 font-medium">
                        {merchant.category}
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                      <Tag className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">{merchant.discountDescription}</p>
                  
                  {merchant.couponCode && (
                    <div className="mt-auto bg-emerald-50/50 border border-emerald-200 border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-emerald-50 transition" onClick={() => navigator.clipboard.writeText(merchant.couponCode!)}>
                      <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block mb-1">Click to copy code</span>
                      <span className="text-lg font-mono font-bold text-emerald-900">{merchant.couponCode}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Campus Events */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-500" />
            Upcoming Campus Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                <CalendarDays className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No upcoming events scheduled.</p>
              </div>
            ) : (
              events.map(event => (
                <div key={event.id} className="bg-white rounded-2xl flex overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-1 transition duration-300">
                  <div className="w-32 bg-blue-600 text-white flex flex-col items-center justify-center shrink-0 border-r border-blue-700">
                    <span className="text-sm font-semibold uppercase tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-4xl font-bold my-1">{new Date(event.date).getDate()}</span>
                    <span className="text-sm">{new Date(event.date).getFullYear()}</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                    </div>
                    {event.registrationLink && (
                      <a 
                        href={event.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition w-fit"
                      >
                        Register Now <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default function LifestylePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <LifestyleContent />
    </ProtectedRoute>
  );
}
