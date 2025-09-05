import { useState } from 'react';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
}

export const TaskForm = ({ task, onSuccess }: TaskFormProps) => {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium' as 'High' | 'Medium' | 'Low',
    due_date: task?.due_date ? task.due_date.split('T')[0] : '',
    estimated_duration: task?.estimated_duration || 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask({
          ...taskData,
          status: 'pending' as const,
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description (optional)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: 'High' | 'Medium' | 'Low') => 
              setFormData(prev => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimated_duration">Duration (minutes)</Label>
          <Input
            id="estimated_duration"
            type="number"
            value={formData.estimated_duration}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              estimated_duration: parseInt(e.target.value) || 0 
            }))}
            min="0"
            step="15"
            placeholder="60"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="due_date">Due Date</Label>
        <Input
          id="due_date"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || !formData.title.trim()}>
          {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
        </Button>
      </div>
    </form>
  );
};