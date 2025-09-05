export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  due_date?: string;
  estimated_duration?: number; // in minutes
  status: 'pending' | 'completed' | 'in_progress';
  scheduled_date?: string;
  scheduled_start_time?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  created_at: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  inProgress: number;
  highPriority: number;
}

export interface OptimizedTask {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  estimated_duration: number;
  order: number;
  reasoning: string;
}