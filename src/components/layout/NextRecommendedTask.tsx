import { useTasks } from '@/hooks/useTasks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const NextRecommendedTask = () => {
  const { tasks } = useTasks();

  // Simple algorithm: prioritize by due date and priority
  const getNextRecommendedTask = () => {
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    
    if (pendingTasks.length === 0) return null;

    return pendingTasks.sort((a, b) => {
      // First sort by priority (High > Medium > Low)
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date (earlier first)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      
      return 0;
    })[0];
  };

  const nextTask = getNextRecommendedTask();

  if (!nextTask) {
    return (
      <Card className="p-3 hidden lg:block">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>No pending tasks</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 hidden lg:block max-w-xs">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Next Recommended</span>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium truncate">{nextTask.title}</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full text-white ${
                nextTask.priority === 'High' ? 'bg-priority-high' :
                nextTask.priority === 'Medium' ? 'bg-priority-medium' : 'bg-priority-low'
              }`}>
                {nextTask.priority}
              </span>
              {nextTask.due_date && (
                <span className="text-xs text-muted-foreground">
                  Due {format(new Date(nextTask.due_date), 'MMM dd')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};