import React, { useState, useEffect } from 'react';
import { NotesFilter } from './NotesFilter';
import { NotesList } from './NotesList';
import { useAuth } from '../../contexts/AuthContext';

export function NotesBrowser() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({ university: '', faculty: '', subject_code: '', academic_year: '' });
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await fetch(`/api/v1/notes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data.data || []);
      setLoading(false);
    }
    fetchNotes();
  }, [filters, token]);

  return (
    <div>
      <NotesFilter filters={filters} setFilters={setFilters} />
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <NotesList notes={notes} />
      )}
    </div>
  );
}