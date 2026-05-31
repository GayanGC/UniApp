import React from 'react';
import { NotesBrowser } from '../../../components/notes/NotesBrowser';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function NotesBrowserPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/unauthorized');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Study Notes</h1>
      <NotesBrowser />
    </div>
  );
}