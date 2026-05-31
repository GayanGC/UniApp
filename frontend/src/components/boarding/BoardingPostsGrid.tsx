'use client';

import React from 'react';
import Link from 'next/link';
import type { BoardingPost } from '@/types';

interface BoardingPostsGridProps {
  posts: BoardingPost[];
  loading: boolean;
}

/** Format a decimal rent value as "LKR 25,000 / month" */
function formatRent(rent: number): string {
  return `LKR ${Number(rent).toLocaleString('en-LK')} / mo`;
}

/** Truncate description text for the card preview */
function truncate(text: string | null, maxLen = 100): string {
  if (!text) return 'No description provided.';
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

/**
 * BoardingPostsGrid
 *
 * Renders a responsive grid of boarding post cards.
 * Each card shows the title, location, rent, availability badge,
 * a description preview, and a link to the full post detail page.
 *
 * Handles three states:
 *  - loading  → skeleton placeholders
 *  - no posts → friendly empty state
 *  - posts    → card grid
 */
export default function BoardingPostsGrid({ posts, loading }: BoardingPostsGridProps) {
  /* ── Loading state: skeleton cards ── */
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse"
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
            <div className="h-3 bg-gray-100 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-5/6 mb-6" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  /* ── Empty state ── */
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🏠</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No rooms found</h3>
        <p className="text-sm text-gray-400 max-w-sm">
          Try adjusting your filters — clear the location, widen the price range, or show all
          availability statuses.
        </p>
      </div>
    );
  }

  /* ── Posts grid ── */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      {posts.map((post) => (
        <div
          key={post.postId}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5
                     flex flex-col hover:shadow-md hover:-translate-y-0.5
                     transition-all duration-200"
        >
          {/* ── Header: title + availability badge ── */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-base font-semibold text-gray-800 leading-snug line-clamp-2">
              {post.title}
            </h2>
            <span
              className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full
                ${post.isAvailable
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
                }`}
            >
              {post.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>

          {/* ── Location ── */}
          {post.locationDetails && (
            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
              <span>📍</span>
              <span className="truncate">{post.locationDetails}</span>
            </p>
          )}

          {/* ── Description preview ── */}
          <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
            {truncate(post.description)}
          </p>

          {/* ── Footer: rent + provider + link ── */}
          <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-blue-600">{formatRent(post.monthlyRent)}</span>
              {post.provider && (
                <p className="text-xs text-gray-400 mt-0.5">by {post.provider.fullName}</p>
              )}
            </div>
            <Link
              href={`/accommodation/posts/${post.postId}`}
              className="text-xs font-semibold text-blue-600 border border-blue-200
                         px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
            >
              View →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}