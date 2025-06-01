"use client";

import { useState } from 'react';
import type { Task } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarDays, ListFilter } from 'lucide-react';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleOpenForm = (task?: Task) => {
    setEditingTask(task || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTasks([...tasks, task]);
    }
    handleCloseForm();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };
  
  const tasksForSelectedDate = tasks.filter(task => 
    task.deadline && selectedDate &&
    new Date(task.deadline).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-headline font-semibold text-primary">Manage Your Tasks</h2>
        <Button onClick={() => handleOpenForm()} className="bg-primary hover:bg-primary/80 text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Task
        </Button>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTask}
        task={editingTask}
      />
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="list"><ListFilter className="mr-2 h-4 w-4" />Task List</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarDays className="mr-2 h-4 w-4" />Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={tasks}
                onEdit={handleOpenForm}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-headline">Select Date</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow-sm"
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()-1))}
                />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-headline">
                  Tasks for {selectedDate ? selectedDate.toLocaleDateString() : 'Selected Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate && tasksForSelectedDate.length > 0 ? (
                   <TaskList
                    tasks={tasksForSelectedDate}
                    onEdit={handleOpenForm}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                  />
                ) : (
                  <p className="text-muted-foreground">No tasks for this date. Add some!</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
