'use client';

import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { apiService } from '@/services/api';
import type { Campus, CampusPOI } from '@/types';
import { MapPin, School, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Sri Lanka center coordinates
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 };
const DEFAULT_ZOOM = 8;

// POI category colors
const POI_COLORS: Record<string, string> = {
  Restaurant: '#EF4444',
  Bookshop: '#3B82F6',
  ATM: '#10B981',
  Boarding: '#F59E0B',
  Library: '#8B5CF6',
  Gym: '#EC4899',
  default: '#6B7280',
};

export default function CampusMapPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [pois, setPois] = useState<CampusPOI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  const [error, setError] = useState('');

  // Fetch all campuses on mount
  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getAllCampuses();
      setCampuses(response.data);
    } catch (err: any) {
      console.error('Error fetching campuses:', err);
      setError('Failed to load campuses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampusClick = async (campus: Campus) => {
    setSelectedCampus(campus);
    setIsLoadingPOIs(true);
    setPois([]);

    try {
      const response = await apiService.getPOIsByCampus(campus.campusId);
      setPois(response.data);
    } catch (err: any) {
      console.error('Error fetching POIs:', err);
    } finally {
      setIsLoadingPOIs(false);
    }
  };

  const handleCloseInfoWindow = () => {
    setSelectedCampus(null);
    setPois([]);
  };

  const getPOIColor = (category: string): string => {
    return POI_COLORS[category] || POI_COLORS.default;
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Google Maps API Key not configured</p>
          <p className="text-gray-600 text-sm mt-2">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Campus Guide</h1>
                <p className="text-sm text-gray-500">Explore university locations</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-80px)]">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading campuses...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={DEFAULT_ZOOM}
            mapId="campus-guide-map"
            className="w-full h-full"
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {/* Campus Markers */}
            {campuses.map((campus) => (
              <AdvancedMarker
                key={campus.campusId}
                position={{ lat: campus.latitude, lng: campus.longitude }}
                onClick={() => handleCampusClick(campus)}
                title={campus.name}
              >
                <div className="bg-primary-600 rounded-full p-3 shadow-lg cursor-pointer hover:bg-primary-700 transition-colors">
                  <School className="w-6 h-6 text-white" />
                </div>
              </AdvancedMarker>
            ))}

            {/* POI Markers */}
            {pois.map((poi) => (
              <AdvancedMarker
                key={poi.poiId}
                position={{ lat: poi.latitude, lng: poi.longitude }}
                title={poi.name}
              >
                <div
                  className="rounded-full p-2 shadow-md"
                  style={{ backgroundColor: getPOIColor(poi.category) }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </AdvancedMarker>
            ))}

            {/* Info Window for Selected Campus */}
            {selectedCampus && (
              <InfoWindow
                position={{
                  lat: selectedCampus.latitude,
                  lng: selectedCampus.longitude,
                }}
                onCloseClick={handleCloseInfoWindow}
              >
                <div className="p-4 max-w-sm">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedCampus.name}
                    </h3>
                    <button
                      onClick={handleCloseInfoWindow}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {selectedCampus.address}
                  </p>

                  <div className="border-t pt-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Points of Interest
                    </h4>

                    {isLoadingPOIs && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading POIs...
                      </div>
                    )}

                    {!isLoadingPOIs && pois.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No POIs available for this campus
                      </p>
                    )}

                    {!isLoadingPOIs && pois.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {pois.map((poi) => (
                          <div
                            key={poi.poiId}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div
                              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                              style={{ backgroundColor: getPOIColor(poi.category) }}
                            />
                            <div>
                              <p className="font-medium text-gray-900">{poi.name}</p>
                              <p className="text-xs text-gray-500">{poi.category}</p>
                              {poi.description && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {poi.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      Found {pois.length} {pois.length === 1 ? 'location' : 'locations'}
                    </p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 rounded-full p-2">
                <School className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-700">University Campus</span>
            </div>
            {Object.entries(POI_COLORS)
              .filter(([key]) => key !== 'default')
              .map(([category, color]) => (
                <div key={category} className="flex items-center gap-2">
                  <div
                    className="rounded-full p-2"
                    style={{ backgroundColor: color }}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{category}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Campus Count */}
        {!isLoading && campuses.length > 0 && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{campuses.length}</span>{' '}
              {campuses.length === 1 ? 'Campus' : 'Campuses'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
