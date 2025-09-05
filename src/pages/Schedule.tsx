import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';

export default function Schedule() {
  const { tasks } = useTasks();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.scheduled_date) return false;
      return isSameDay(new Date(task.scheduled_date), date);
    });
  };

  const getTotalTimeForDate = (date: Date) => {
    const dayTasks = getTasksForDate(date);
    return dayTasks.reduce((total, task) => total + (task.estimated_duration || 0), 0);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-priority-high text-white';
      case 'Medium': return 'bg-priority-medium text-white';
      case 'Low': return 'bg-priority-low text-white';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Weekly calendar view with task scheduling</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium min-w-[200px] text-center">
            {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayTasks = getTasksForDate(day);
          const totalTime = getTotalTimeForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <Card key={day.toISOString()} className={`min-h-[300px] ${isToday ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className={isToday ? 'text-primary font-semibold' : ''}>
                    {format(day, 'EEE dd')}
                  </span>
                  {totalTime > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.floor(totalTime / 60)}h {totalTime % 60}m
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-2">
                {dayTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No tasks scheduled</p>
                  </div>
                ) : (
                  dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-2 rounded-md border bg-card hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                            {task.estimated_duration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.estimated_duration}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Drag & Drop Scheduling</h3>
          <p className="text-muted-foreground">
            This is a preview of the schedule view. In the full version, you'll be able to drag tasks from the Tasks section to schedule them on specific days.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Advanced scheduling features coming soon</span>
          </div>
        </div>
      </Card>
    </div>
  );
}