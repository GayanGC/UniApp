'use client';

import React, { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Star, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

const LocationDisplay = dynamic(() => import('@/components/boarding/LocationDisplay'), { ssr: false });
import type { BoardingPost } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

function formatRent(rent: number) {
  return `LKR ${Number(rent).toLocaleString('en-LK')}`;
}

/**
 * /accommodation/posts/[postId]
 *
 * Premium boarding post detail page.
 * — Image gallery / hero banner
 * — Full description, location, availability badge
 * — "Contact Provider" glassmorphism card
 */
export default function BoardingPostDetailPage() {
  const params = useParams<{ postId: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BoardingPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const { isAuthenticated } = useAuth();
  
  // Review State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.postId) return;
    const id = Number(params.postId);
    if (isNaN(id)) { setError('Invalid post ID'); setLoading(false); return; }

    apiService
      .getBoardingPostById(id)
      .then((data) => { setPost(data); setLoading(false); })
      .catch((err) => {
        setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load post.');
        setLoading(false);
      });
  }, [params?.postId]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading post…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Post not found</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Link href="/accommodation/search" className="text-blue-600 hover:underline text-sm font-medium">
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  const images = post.images?.filter(Boolean) ?? [];
  const hasImages = images.length > 0;
  const reviews = post.reviews ?? [];
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
    : null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    setReviewError(null);
    try {
      const newReview = await apiService.createBoardingReview(post.postId, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      // Append the new review to the local state so it shows up immediately
      setPost({
        ...post,
        reviews: [newReview, ...reviews],
      });
      setReviewComment('');
      setReviewRating(5);
    } catch (err: any) {
      setReviewError(err?.response?.data?.message ?? err?.message ?? 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Back nav ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition mb-6"
        >
          ← Back
        </button>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ════════════════ LEFT / MAIN COLUMN ════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── Image gallery ── */}
            {hasImages ? (
              <div className="rounded-2xl overflow-hidden bg-gray-900 shadow-md">
                {/* Main image */}
                <div className="relative aspect-video">
                  <img
                    src={`${API_BASE}${images[activeImg]}`}
                    alt={`Photo ${activeImg + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Availability badge overlay */}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
                      ${post.isAvailable
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      }`}
                  >
                    {post.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 bg-gray-800 overflow-x-auto">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition
                          ${activeImg === i ? 'border-blue-400' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={`${API_BASE}${src}`} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* No-image placeholder */
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100
                              aspect-video flex flex-col items-center justify-center shadow-sm">
                <span className="text-6xl mb-3">🏠</span>
                <p className="text-sm text-gray-400">No photos uploaded yet</p>
                <span
                  className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold
                    ${post.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                >
                  {post.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            )}

            {/* ── Title, rating, & price ── */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{post.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                {averageRating ? (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{averageRating}</span>
                    <span className="text-gray-400">({reviewCount} Review{reviewCount !== 1 ? 's' : ''})</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">No reviews yet</span>
                )}
              </div>
              <p className="text-3xl font-extrabold text-blue-600">
                {formatRent(post.monthlyRent)}
                <span className="text-base font-normal text-gray-400"> / month</span>
              </p>
            </div>

            {/* ── Location ── */}
            {post.locationDetails && (
              <div className="flex items-start gap-2 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <span className="text-xl mt-0.5">📍</span>
                <div className="w-full">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Location Details</p>
                  <p className="text-gray-800 font-medium mb-4">{post.locationDetails}</p>
                  
                  {post.latitude !== null && post.longitude !== null && (
                    <div className="mt-2">
                      <LocationDisplay latitude={Number(post.latitude)} longitude={Number(post.longitude)} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Description ── */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                About this room
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.description || 'No description provided.'}
              </p>
            </div>

            {/* ── Meta ── */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-gray-400 mb-1">Listed</p>
                <p className="font-medium text-gray-800">
                  {new Date(post.createdAt).toLocaleDateString('en-LK', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-gray-400 mb-1">Last updated</p>
                <p className="font-medium text-gray-800">
                  {new Date(post.updatedAt).toLocaleDateString('en-LK', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            
            {/* ── Reviews Section ── */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
              
              {/* Review List */}
              <div className="space-y-6 mb-8">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Be the first to review this boarding post!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {r.student?.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{r.student?.fullName || 'Anonymous'}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              {isAuthenticated ? (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Leave a Review</h3>
                  {reviewError && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3 border border-red-100">{reviewError}</p>
                  )}
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this boarding..."
                      className="w-full text-sm bg-white border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    ></textarea>
                    <button
                      type="submit"
                      disabled={submittingReview || !reviewComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-sm text-gray-500 mb-2">You must be logged in to leave a review.</p>
                  <Link href="/login" className="text-sm text-blue-600 font-medium hover:underline">Log in here</Link>
                </div>
              )}
            </div>
          </div>

          {/* ════════════════ RIGHT / SIDEBAR ════════════════ */}
          <div className="space-y-5">

            {/* Contact Provider — glassmorphism card */}
            {post.provider && (
              <div
                className="relative rounded-2xl p-6 overflow-hidden shadow-lg
                           bg-gradient-to-br from-blue-600 to-indigo-700"
              >
                {/* Decorative orb */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-white/10 rounded-full" />

                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center
                                  text-white text-2xl font-bold mb-4 border border-white/30">
                    {post.provider.fullName.charAt(0).toUpperCase()}
                  </div>

                  <p className="text-blue-200 text-xs uppercase tracking-widest mb-1 font-medium">
                    Contact Provider
                  </p>
                  <h3 className="text-white text-lg font-bold mb-1">{post.provider.fullName}</h3>
                  <p className="text-blue-200 text-sm mb-5 break-all">{post.provider.email}</p>

                  <a
                    href={`mailto:${post.provider.email}?subject=Inquiry about: ${encodeURIComponent(post.title)}`}
                    className="block w-full text-center py-2.5 rounded-xl bg-white text-blue-700
                               text-sm font-semibold hover:bg-blue-50 transition shadow"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            )}

            {/* Quick info card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Details</h3>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Monthly Rent</span>
                <span className="font-semibold text-gray-900">{formatRent(post.monthlyRent)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                  ${post.isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {post.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Photos</span>
                <span className="font-medium text-gray-800">{images.length}</span>
              </div>
            </div>

            <Link
              href="/accommodation/search"
              className="block text-center text-sm text-blue-600 hover:underline py-2"
            >
              ← All listings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
