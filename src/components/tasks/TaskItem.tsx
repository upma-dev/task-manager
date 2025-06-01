"use client";

import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, CalendarClock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskItem({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  const timeToDeadline = task.deadline ? formatDistanceToNow(new Date(task.deadline), { addSuffix: true }) : null;
  
  let deadlineBadgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  if (task.completed) {
    deadlineBadgeVariant = "default"; // Or some "completed" specific style
  } else if (task.deadline) {
    const daysUntilDeadline = (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    if (daysUntilDeadline < 0) deadlineBadgeVariant = "destructive"; // Overdue
    else if (daysUntilDeadline < 3) deadlineBadgeVariant = "secondary"; // Nearing
  }


  return (
    <Card className={`transition-all duration-300 ease-in-out ${task.completed ? 'opacity-60 bg-muted/30' : 'bg-card'}`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
            />
            <CardTitle className={`text-lg font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </CardTitle>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8 text-primary hover:bg-primary/10">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit Task</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Task</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="px-4 pb-2 pt-0">
          <p className={`text-sm ${task.completed ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="px-4 pb-3 pt-1 flex justify-end">
        {task.deadline && (
          <Badge variant={deadlineBadgeVariant} className="flex items-center">
            <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
            {format(new Date(task.deadline), "MMM d, yyyy")}
            {!task.completed && timeToDeadline && <span className="ml-1 text-xs">({timeToDeadline})</span>}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
