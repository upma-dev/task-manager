"use client";

import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteItemProps {
  note: Note;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

export function NoteItem({ note, onSelectNote, onDeleteNote }: NoteItemProps) {
  const timeSinceUpdated = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => onSelectNote(note)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-primary truncate">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {note.content || "No content..."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-2">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>Updated {timeSinceUpdated}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when deleting
            onDeleteNote(note.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete note</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
