import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/task';

interface TaskListProps {
  statusFilter: 'all' | 'pending' | 'completed';
  priorityFilter: string;
}

export const TaskList = ({ statusFilter, priorityFilter }: TaskListProps) => {
  const { tasks, loading } = useTasks();

  const filteredTasks = tasks.filter((task: Task) => {
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'pending' && (task.status === 'pending' || task.status === 'in_progress')) ||
      (statusFilter === 'completed' && task.status === 'completed');
    
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found</p>
        <p className="text-sm text-muted-foreground mt-1">
          {statusFilter !== 'all' || priorityFilter !== 'all' 
            ? 'Try adjusting your filters' 
            : 'Create your first task to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};