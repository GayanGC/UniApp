'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { apiService } from '@/services/api';

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import('./LocationPicker'), { ssr: false });

/**
 * CreateBoardingForm
 *
 * Provides a multipart/form-data submittable form for Boarding Providers
 * to create new accommodation listings along with multiple image uploads.
 */
export default function CreateBoardingForm() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  
  // Coordinates state
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  
  // File upload state
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const totalFiles = files.length + selectedFiles.length;
      
      if (totalFiles > 6) {
        setError('You can only upload a maximum of 6 images.');
        return;
      }
      
      setError(null);
      setFiles((prev) => [...prev, ...selectedFiles]);
      
      // Generate object URLs for immediate preview
      const newUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
    // Clear input so selecting the same file again triggers change event
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    
    // Revoke the URL of the removed item
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !monthlyRent || !locationDetails) {
      setError('Title, monthly rent, and location details are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('monthlyRent', monthlyRent);
      formData.append('locationDetails', locationDetails);
      // isAvailable defaults to true on the backend if omitted, but we can append it:
      formData.append('isAvailable', 'true');
      
      // Append each file to 'images' (NestJS FilesInterceptor expects 'images')
      files.forEach(file => {
        formData.append('images', file);
      });

      if (position) {
        formData.append('latitude', position.lat.toString());
        formData.append('longitude', position.lng.toString());
      }

      // We bypass ApiService helper since we need multipart/form-data specifically.
      // Alternatively, we use getAxiosInstance() to use the configured Axios singleton.
      const api = apiService.getAxiosInstance();
      await api.post('/boarding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect back to dashboard upon success
      router.push('/provider/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to create listing.';
      setError(Array.isArray(msg) ? msg.join(' · ') : msg);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="p-8 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Listing</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Spacious Room near Campus"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Monthly Rent (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g., 15000"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Location Details <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              placeholder="e.g., No 15, Reid Avenue, Colombo 07"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Pin Location on Map
            </label>
            <LocationPicker position={position} onPositionChange={setPosition} />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the accommodation..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* ── Image Upload Section ── */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Photos (Max 6)
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Photo Previews */}
              {previewUrls.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              {files.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-teal-500 bg-gray-50 hover:bg-teal-50/50 flex flex-col items-center justify-center text-gray-500 hover:text-teal-600 transition"
                >
                  <span className="text-3xl mb-1">+</span>
                  <span className="text-xs font-medium">Add Photo</span>
                </button>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, image/gif"
              multiple
              className="hidden"
            />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/provider/dashboard')}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
