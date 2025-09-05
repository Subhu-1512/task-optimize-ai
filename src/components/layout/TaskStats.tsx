import { useTasks } from '@/hooks/useTasks';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export const TaskStats = () => {
  const { tasks } = useTasks();

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    highPriority: tasks.filter(t => t.priority === 'High' && t.status !== 'completed').length,
  };

  return (
    <Card className="p-3 hidden md:block">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Total:</span>
          <Badge variant="secondary">{stats.total}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Pending:</span>
          <Badge variant="outline">{stats.pending}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Completed:</span>
          <Badge className="bg-success text-success-foreground hover:bg-success/90">{stats.completed}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">High Priority:</span>
          <Badge className="bg-priority-high text-white hover:bg-priority-high/90">{stats.highPriority}</Badge>
        </div>
      </div>
    </Card>
  );
};