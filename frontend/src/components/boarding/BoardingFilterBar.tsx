'use client';

import React from 'react';
import type { BoardingFilters } from '@/types';

interface BoardingFilterBarProps {
  filters: BoardingFilters;
  onChange: (updated: BoardingFilters) => void;
  onReset: () => void;
  resultCount: number;
  loading: boolean;
}

/**
 * BoardingFilterBar
 *
 * Renders four filter controls that map 1-to-1 onto the backend's
 * GetBoardingFilterDto query parameters:
 *
 *   location  → text input  (ILIKE partial match on locationDetails)
 *   minPrice  → number input (monthlyRent >= value)
 *   maxPrice  → number input (monthlyRent <= value)
 *   available → 3-way toggle: All | Available only | Unavailable only
 */
export default function BoardingFilterBar({
  filters,
  onChange,
  onReset,
  resultCount,
  loading,
}: BoardingFilterBarProps) {
  /* ── helpers ── */
  const set = (key: keyof BoardingFilters, value: BoardingFilters[typeof key]) =>
    onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.location !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.available !== null;

  /* ── availability options ── */
  const availabilityOptions: { label: string; value: boolean | null }[] = [
    { label: 'All rooms', value: null },
    { label: 'Available only', value: true },
    { label: 'Unavailable', value: false },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8">
      {/* ── Row 1: inputs ── */}
      <div className="flex flex-wrap gap-3 items-end">
        {/* Location search */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">
            Location
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              📍
            </span>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Colombo, Kandy…"
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition placeholder-gray-300"
            />
          </div>
        </div>

        {/* Min price */}
        <div className="w-36">
          <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">
            Min Rent (LKR)
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
            placeholder="0"
            min={0}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition placeholder-gray-300"
          />
        </div>

        {/* Max price */}
        <div className="w-36">
          <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">
            Max Rent (LKR)
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
            placeholder="Any"
            min={0}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition placeholder-gray-300"
          />
        </div>

        {/* Availability toggle */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">
            Availability
          </label>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 divide-x divide-gray-200">
            {availabilityOptions.map((opt) => {
              const isActive = filters.available === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => set('available', opt.value)}
                  className={`px-3 py-2.5 text-xs font-medium transition whitespace-nowrap
                    ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset button — only visible when a filter is active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="self-end px-4 py-2.5 text-sm text-red-500 border border-red-200
                       rounded-lg hover:bg-red-50 transition font-medium"
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* ── Row 2: result summary ── */}
      <div className="mt-3 text-xs text-gray-400">
        {loading ? (
          <span>Searching…</span>
        ) : (
          <span>
            {resultCount} {resultCount === 1 ? 'room' : 'rooms'} found
            {hasActiveFilters && ' for current filters'}
          </span>
        )}
      </div>
    </div>
  );
}