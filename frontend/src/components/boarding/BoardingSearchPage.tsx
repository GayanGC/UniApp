'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/services/api';
import type { BoardingPost, BoardingFilters } from '@/types';
import BoardingFilterBar from './BoardingFilterBar';
import BoardingPostsGrid from './BoardingPostsGrid';

/** Default / reset state for all filters */
const DEFAULT_FILTERS: BoardingFilters = {
  location: '',
  minPrice: '',
  maxPrice: '',
  available: null, // null = no filter → backend defaults to available-only
};

/**
 * BoardingSearchPage
 *
 * Orchestrates the boarding search experience:
 *  - Fetches posts via apiService.getBoardingPosts() (JWT-authenticated)
 *  - Applies a 400 ms debounce on text/number inputs to avoid hammering the API
 *  - Re-fetches immediately when the availability toggle or Reset is clicked
 *  - Shows skeleton loading, friendly error states, and a result summary
 */
export default function BoardingSearchPage() {
  const [filters, setFilters] = useState<BoardingFilters>(DEFAULT_FILTERS);
  const [posts, setPosts] = useState<BoardingPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to hold the latest debounce timer so we can clear it on every keystroke
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─────────────────────────────────────────────────────────────
     Core fetch function — called by both the debounced path and
     the immediate path (availability toggle, reset).
  ───────────────────────────────────────────────────────────── */
  const fetchPosts = useCallback(async (activeFilters: BoardingFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getBoardingPosts(activeFilters);
      setPosts(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to load boarding posts. Please try again.';
      setError(Array.isArray(msg) ? msg.join(' · ') : msg);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────
     Initial fetch on mount (no filters → returns all available posts)
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    fetchPosts(DEFAULT_FILTERS);
  }, [fetchPosts]);

  /* ─────────────────────────────────────────────────────────────
     Debounced handler for text / number inputs.
     Fires the API call 400 ms after the user stops typing.
  ───────────────────────────────────────────────────────────── */
  const handleFilterChange = useCallback(
    (updated: BoardingFilters) => {
      setFilters(updated);

      // Clear any pending debounce timer
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      // If only the availability field changed, fire immediately (no debounce needed)
      const availabilityChanged = updated.available !== filters.available;
      if (availabilityChanged) {
        fetchPosts(updated);
        return;
      }

      // For text / number fields debounce 400 ms
      debounceTimer.current = setTimeout(() => {
        fetchPosts(updated);
      }, 400);
    },
    [filters.available, fetchPosts],
  );

  /* ─────────────────────────────────────────────────────────────
     Reset — clears all filters and refetches immediately
  ───────────────────────────────────────────────────────────── */
  const handleReset = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setFilters(DEFAULT_FILTERS);
    fetchPosts(DEFAULT_FILTERS);
  }, [fetchPosts]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  /* ─────────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Accommodation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse available boarding rooms near your university. Use the filters to narrow your
            search.
          </p>
        </div>

        {/* ── Filter bar ── */}
        <BoardingFilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          resultCount={posts.length}
          loading={loading}
        />

        {/* ── Global error banner ── */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200
                          text-red-700 rounded-xl px-4 py-3 text-sm">
            <span className="mt-0.5 text-base">⚠️</span>
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="text-red-500 mt-0.5">{error}</p>
              <button
                onClick={() => fetchPosts(filters)}
                className="mt-2 text-xs font-medium underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ── Posts grid ── */}
        <BoardingPostsGrid posts={posts} loading={loading} />
      </div>
    </div>
  );
}