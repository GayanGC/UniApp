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
  page: 1,
  limit: 10,
};

/**
 * BoardingSearchPage
 *
 * Orchestrates the boarding search experience:
 *  - Fetches posts via apiService.getBoardingPosts() (JWT-authenticated)
 *  - Applies a 400 ms debounce on text/number inputs to avoid hammering the API
 *  - Re-fetches immediately when the availability toggle or Reset is clicked
 *  - Shows skeleton loading, friendly error states, and a result summary
 *  - Includes pagination controls
 */
export default function BoardingSearchPage() {
  const [filters, setFilters] = useState<BoardingFilters>(DEFAULT_FILTERS);
  const [posts, setPosts] = useState<BoardingPost[]>([]);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
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
      const { data, total, lastPage } = await apiService.getBoardingPosts(activeFilters);
      setPosts(data);
      setTotal(total);
      setLastPage(lastPage);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to load boarding posts. Please try again.';
      setError(Array.isArray(msg) ? msg.join(' · ') : msg);
      setPosts([]);
      setTotal(0);
      setLastPage(1);
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
      // Whenever a filter changes (except page itself), reset page to 1
      // Check if page was specifically changed
      const isPageChange = updated.page !== filters.page;
      const nextFilters = isPageChange ? updated : { ...updated, page: 1 };
      
      setFilters(nextFilters);

      // Clear any pending debounce timer
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      // If only the availability field changed or page changed, fire immediately (no debounce needed)
      const availabilityChanged = updated.available !== filters.available;
      if (availabilityChanged || isPageChange) {
        fetchPosts(nextFilters);
        return;
      }

      // For text / number fields debounce 400 ms
      debounceTimer.current = setTimeout(() => {
        fetchPosts(nextFilters);
      }, 400);
    },
    [filters, fetchPosts],
  );

  /* ─────────────────────────────────────────────────────────────
     Reset — clears all filters and refetches immediately
  ───────────────────────────────────────────────────────────── */
  const handleReset = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setFilters(DEFAULT_FILTERS);
    fetchPosts(DEFAULT_FILTERS);
  }, [fetchPosts]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    handleFilterChange({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex-1 w-full">

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
          resultCount={total}
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

        {/* ── Pagination Controls ── */}
        {!loading && total > 0 && (
          <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(filters.page * filters.limit, total)}
              </span>{' '}
              of <span className="font-medium">{total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === lastPage}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}