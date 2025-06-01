"use client";

import { useState } from 'react';
import type { Note } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NoteList } from '@/components/notes/NoteList';
import { NoteEditor } from '@/components/notes/NoteEditor';

export default function NotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleCreateNewNote = () => {
    setSelectedNote(null);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (noteToSave: Pick<Note, 'title' | 'content'>) => {
    if (selectedNote) {
      // Update existing note
      setNotes(
        notes.map((n) =>
          n.id === selectedNote.id
            ? { ...selectedNote, ...noteToSave, updatedAt: new Date() }
            : n
        )
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteToSave,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes([newNote, ...notes]); // Add new note to the beginning
    }
    setIsEditorOpen(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId));
    if (selectedNote?.id === noteId) {
      setIsEditorOpen(false);
      setSelectedNote(null);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedNote(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-headline font-semibold text-primary">Your Study Notes</h2>
        <Button onClick={handleCreateNewNote} className="bg-primary hover:bg-primary/80 text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Note
        </Button>
      </div>

      {isEditorOpen ? (
        <NoteEditor
          note={selectedNote}
          onSave={handleSaveNote}
          onClose={handleCloseEditor}
          onDelete={selectedNote ? handleDeleteNote : undefined}
        />
      ) : (
        <NoteList
          notes={notes}
          onSelectNote={handleSelectNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
}
