export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
