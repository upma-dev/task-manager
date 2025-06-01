
"use client";

import type { Task } from '@/lib/types';
import { TaskItem } from './TaskItem';
import { useMemo } from 'react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onToggleComplete }: TaskListProps) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (a.deadline) return -1; // Tasks with deadlines come before those without
      if (b.deadline) return 1;
      return parseInt(b.id) - parseInt(a.id); // Fallback to creation order (newer first based on timestamp ID)
    });
  }, [tasks]);

  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No tasks yet. Add one to get started!</p>;
  }

  return (
    <div className="space-y-3">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
