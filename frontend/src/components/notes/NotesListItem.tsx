import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function NotesListItem({ note }: { note: any }) {
  const { token } = useAuth();

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/v1/notes/download/${note.note_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.file_path.split('/').pop() || 'note';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed.');
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
        <div className="text-gray-600 mb-1">Subject: {note.subject_code}</div>
        <div className="text-gray-600 mb-1">Uploaded By: {note.uploader?.fullName || 'Unknown'}</div>
        <div className="text-gray-500 text-sm mb-2">Year: {note.academic_year}</div>
        <div className="text-gray-700 mb-2">{note.description}</div>
      </div>
      <button onClick={handleDownload} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
        Download
      </button>
    </div>
  );
}