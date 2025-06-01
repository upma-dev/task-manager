
"use client";

import type { Note } from '@/lib/types';
import { NoteItem } from './NoteItem';
import { Card, CardContent } from '@/components/ui/card';
import { NotebookText } from 'lucide-react';
import { useMemo } from 'react';

interface NoteListProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

export function NoteList({ notes, onSelectNote, onDeleteNote }: NoteListProps) {
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes]);

  if (notes.length === 0) {
    return (
      <Card className="text-center py-10 shadow-sm border-dashed border-2 border-muted">
        <CardContent className="flex flex-col items-center justify-center">
          <NotebookText className="w-16 h-16 text-muted-foreground mb-4" strokeWidth={1.5}/>
          <h3 className="text-xl font-semibold text-foreground mb-2">No notes yet!</h3>
          <p className="text-muted-foreground">Click "Create New Note" to start jotting down your thoughts and ideas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedNotes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
        />
      ))}
    </div>
  );
}
