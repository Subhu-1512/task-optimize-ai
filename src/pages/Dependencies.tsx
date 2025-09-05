import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GitBranch, Plus, Trash2, ArrowRight, AlertCircle } from 'lucide-react';

export default function Dependencies() {
  const { tasks, dependencies, addDependency, removeDependency } = useTasks();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedDependency, setSelectedDependency] = useState('');

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  
  const getTaskById = (id: string) => tasks.find(t => t.id === id);
  
  const getBlockedTasks = () => {
    return tasks.filter(task => {
      const taskDeps = dependencies.filter(dep => dep.task_id === task.id);
      return taskDeps.some(dep => {
        const dependsOnTask = getTaskById(dep.depends_on_task_id);
        return dependsOnTask && dependsOnTask.status !== 'completed';
      });
    });
  };

  const handleAddDependency = async () => {
    if (!selectedTask || !selectedDependency) return;
    
    try {
      await addDependency(selectedTask, selectedDependency);
      setSelectedTask('');
      setSelectedDependency('');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding dependency:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-priority-high text-white';
      case 'Medium': return 'bg-priority-medium text-white';
      case 'Low': return 'bg-priority-low text-white';
      default: return 'bg-secondary';
    }
  };

  const blockedTasks = getBlockedTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dependencies</h1>
          <p className="text-muted-foreground">Manage task dependencies and track blocked tasks</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Dependency
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Task Dependency</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Task that depends on:</label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingTasks.map(task => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Must complete first:</label>
                <Select value={selectedDependency} onValueChange={setSelectedDependency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dependency" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingTasks
                      .filter(task => task.id !== selectedTask)
                      .map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddDependency}
                disabled={!selectedTask || !selectedDependency}
                className="w-full"
              >
                Add Dependency
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blocked Tasks Alert */}
      {blockedTasks.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              Blocked Tasks ({blockedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {blockedTasks.map(task => {
                const taskDeps = dependencies.filter(dep => dep.task_id === task.id);
                const blockingTasks = taskDeps
                  .map(dep => getTaskById(dep.depends_on_task_id))
                  .filter(t => t && t.status !== 'completed');

                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-background rounded-md">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Blocked by: {blockingTasks.map(t => t?.title).join(', ')}
                      </p>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dependencies List */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Dependency Graph
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dependencies.length === 0 ? (
              <div className="text-center py-8">
                <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No dependencies defined</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add dependencies to track task relationships
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dependencies.map(dep => {
                  const task = getTaskById(dep.task_id);
                  const dependsOnTask = getTaskById(dep.depends_on_task_id);
                  
                  if (!task || !dependsOnTask) return null;
                  
                  return (
                    <div key={dep.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="text-sm">
                            <span className="font-medium">{dependsOnTask.title}</span>
                            <Badge 
                              className={`ml-2 ${getPriorityColor(dependsOnTask.priority)}`}
                            >
                              {dependsOnTask.priority}
                            </Badge>
                            {dependsOnTask.status === 'completed' && (
                              <Badge className="ml-1 bg-success text-success-foreground">
                                ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        
                        <div className="flex items-center gap-2 flex-1">
                          <div className="text-sm">
                            <span className="font-medium">{task.title}</span>
                            <Badge 
                              className={`ml-2 ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </Badge>
                            {task.status === 'completed' && (
                              <Badge className="ml-1 bg-success text-success-foreground">
                                ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDependency(dep.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}