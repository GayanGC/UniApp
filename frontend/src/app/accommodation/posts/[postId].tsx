import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BoardingPost } from '@/types';

export default function BoardingPostDetails() {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState<BoardingPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/v1/boarding/${postId}`);
        if (!res.ok) throw new Error('Failed to fetch post details');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="mb-2 text-gray-700">University: <span className="font-medium">{post.university}</span></div>
        <div className="mb-2 text-gray-700">Monthly Rent: <span className="font-medium">LKR {post.monthly_rent}</span></div>
        <div className="mb-2 text-gray-700">Location: <span className="font-medium">{post.location_details}</span></div>
        <div className="mb-2 text-gray-700">Contact: <span className="font-medium">{post.phone_number}</span></div>
        <div className="mt-4 text-gray-800">{post.description}</div>
      </div>
    </div>
  );
}