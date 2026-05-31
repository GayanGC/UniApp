import React from 'react';
import { NoteUploadForm } from '../../../components/notes/NoteUploadForm';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function NotesUploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'student')) {
      router.replace('/unauthorized');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'student') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Study Notes</h1>
      <NoteUploadForm />
    </div>
  );
}