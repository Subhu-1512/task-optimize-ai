import { SidebarTrigger } from '@/components/ui/sidebar';
import { TaskStats } from './TaskStats';
import { NextRecommendedTask } from './NextRecommendedTask';

export const Header = () => {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />
          <div>
            <h1 className="text-lg font-semibold">AI Smart To-Do Scheduler</h1>
            <p className="text-sm text-muted-foreground">Optimize your productivity with AI</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <TaskStats />
          <NextRecommendedTask />
        </div>
      </div>
    </header>
  );
};