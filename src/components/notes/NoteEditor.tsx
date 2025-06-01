"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, XCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content cannot be empty'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteEditorProps {
  note?: Note | null;
  onSave: (data: Pick<Note, 'title' | 'content'>) => void;
  onClose: () => void;
  onDelete?: (noteId: string) => void;
}

export function NoteEditor({ note, onSave, onClose, onDelete }: NoteEditorProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (note) {
      reset({ title: note.title, content: note.content });
    } else {
      reset({ title: '', content: '' });
    }
  }, [note, reset]);

  const onSubmit = (data: NoteFormData) => {
    onSave(data);
  };

  return (
    <Card className="shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            {note ? 'Edit Note' : 'Create New Note'}
          </CardTitle>
          <CardDescription>
            {note ? 'Update your study notes below.' : 'Capture your thoughts and ideas.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="font-semibold">Title</Label>
            <Input
              id="title"
              {...register('title')}
              className={`mt-1 ${errors.title ? 'border-destructive' : ''}`}
              placeholder="Enter note title..."
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="content" className="font-semibold">Content</Label>
            <Textarea
              id="content"
              {...register('content')}
              rows={10}
              className={`mt-1 ${errors.content ? 'border-destructive' : ''}`}
              placeholder="Start writing your note here..."
            />
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {note && onDelete && (
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" className="mr-2">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(note.id!)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="space-x-2">
             <Button type="button" variant="outline" onClick={onClose}>
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" disabled={!isDirty} className="bg-primary hover:bg-primary/80 text-primary-foreground">
              <Save className="mr-2 h-4 w-4" /> Save Note
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
