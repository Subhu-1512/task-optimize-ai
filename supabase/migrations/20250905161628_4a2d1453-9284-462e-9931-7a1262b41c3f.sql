-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER, -- in minutes
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'in_progress')),
  scheduled_date DATE,
  scheduled_start_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create task dependencies table
CREATE TABLE public.task_dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(task_id, depends_on_task_id)
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks (public access for demo)
CREATE POLICY "Tasks are viewable by everyone" 
ON public.tasks 
FOR SELECT 
USING (true);

CREATE POLICY "Tasks can be created by everyone" 
ON public.tasks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Tasks can be updated by everyone" 
ON public.tasks 
FOR UPDATE 
USING (true);

CREATE POLICY "Tasks can be deleted by everyone" 
ON public.tasks 
FOR DELETE 
USING (true);

-- Create policies for task dependencies (public access for demo)
CREATE POLICY "Task dependencies are viewable by everyone" 
ON public.task_dependencies 
FOR SELECT 
USING (true);

CREATE POLICY "Task dependencies can be created by everyone" 
ON public.task_dependencies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Task dependencies can be deleted by everyone" 
ON public.task_dependencies 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_scheduled_date ON public.tasks(scheduled_date);
CREATE INDEX idx_task_dependencies_task_id ON public.task_dependencies(task_id);
CREATE INDEX idx_task_dependencies_depends_on ON public.task_dependencies(depends_on_task_id);