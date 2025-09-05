import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskDependency } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data as Task[]) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    }
  };

  const fetchDependencies = async () => {
    try {
      const { data, error } = await supabase
        .from('task_dependencies')
        .select('*');

      if (error) throw error;
      setDependencies(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch task dependencies",
        variant: "destructive",
      });
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data as Task, ...prev]);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(task => task.id === id ? (data as Task) : task));
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addDependency = async (taskId: string, dependsOnTaskId: string) => {
    try {
      const { data, error } = await supabase
        .from('task_dependencies')
        .insert([{ task_id: taskId, depends_on_task_id: dependsOnTaskId }])
        .select()
        .single();

      if (error) throw error;
      
      setDependencies(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Dependency added successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add dependency",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeDependency = async (id: string) => {
    try {
      const { error } = await supabase
        .from('task_dependencies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDependencies(prev => prev.filter(dep => dep.id !== id));
      toast({
        title: "Success",
        description: "Dependency removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove dependency",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchDependencies()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    tasks,
    dependencies,
    loading,
    createTask,
    updateTask,
    deleteTask,
    addDependency,
    removeDependency,
    refreshTasks: fetchTasks,
  };
};