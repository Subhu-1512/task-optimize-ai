import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Clock, TrendingUp, Loader2 } from 'lucide-react';

interface OptimizedTask {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  estimated_duration: number;
  order: number;
  reasoning: string;
}

export default function AIOptimizer() {
  const [input, setInput] = useState('');
  const [optimizedTasks, setOptimizedTasks] = useState<OptimizedTask[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (!input.trim()) return;
    
    setIsOptimizing(true);
    
    // Simulate AI processing for demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock optimized results based on input
    const inputLines = input.split('\n').filter(line => line.trim());
    const mockOptimized: OptimizedTask[] = inputLines.map((line, index) => {
      const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
      const durations = [30, 45, 60, 90, 120];
      
      return {
        title: line.trim(),
        priority: priorities[index % 3],
        estimated_duration: durations[index % durations.length],
        order: index + 1,
        reasoning: `This task should be ${priorities[index % 3].toLowerCase()} priority based on dependencies and urgency patterns.`
      };
    });
    
    setOptimizedTasks(mockOptimized.sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }));
    
    setIsOptimizing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-priority-high text-white';
      case 'Medium': return 'bg-priority-medium text-white';
      case 'Low': return 'bg-priority-low text-white';
      default: return 'bg-secondary';
    }
  };

  const totalEstimatedTime = optimizedTasks.reduce((total, task) => total + task.estimated_duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Optimizer
          </h1>
          <p className="text-muted-foreground">Let AI analyze and optimize your task planning</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Task Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="task-input" className="text-sm font-medium">
                Enter your tasks (one per line):
              </label>
              <Textarea
                id="task-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Review project proposal&#10;Schedule team meeting&#10;Update website content&#10;Prepare presentation slides&#10;Send client follow-up emails"
                rows={8}
                className="mt-2"
              />
            </div>
            
            <Button 
              onClick={handleOptimize}
              disabled={!input.trim() || isOptimizing}
              className="w-full gap-2"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Optimizing with AI...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Optimize Tasks
                </>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Tip:</strong> The AI will analyze your tasks and suggest:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Optimal priority levels</li>
                <li>Estimated time requirements</li>
                <li>Recommended task ordering</li>
                <li>Productivity insights</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Optimization Results
            </CardTitle>
            {optimizedTasks.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Total estimated time: {Math.floor(totalEstimatedTime / 60)}h {totalEstimatedTime % 60}m</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {optimizedTasks.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Enter tasks above to get AI optimization</p>
                <p className="text-sm text-muted-foreground mt-1">
                  AI will analyze and provide intelligent suggestions
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {optimizedTasks.map((task, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{task.order}
                          </Badge>
                          <h3 className="font-medium">{task.title}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.estimated_duration}min
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {task.reasoning}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary mb-2">AI Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on the analysis, I recommend starting with high-priority tasks and 
                    grouping similar activities together for better focus and productivity.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demo Notice */}
      <Card className="border-info/20 bg-info/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-info">Demo Mode</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This is a demonstration of the AI optimizer. In the full version, this would connect to 
                OpenAI's GPT API to provide real intelligent task analysis and optimization suggestions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}