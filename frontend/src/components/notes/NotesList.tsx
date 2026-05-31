import React from 'react';
import { NotesListItem } from './NotesListItem';
import { StudyNote } from '@/types';

export function NotesList({ notes }: { notes: StudyNote[] }) {
  if (!notes.length) {
    return <div className="text-center py-10 text-gray-500">No notes found.</div>;
  }
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {notes.map(note => (
        <NotesListItem key={note.note_id} note={note} />
      ))}
    </div>
  );
}