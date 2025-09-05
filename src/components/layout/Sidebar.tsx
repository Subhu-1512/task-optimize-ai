import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { CheckSquare, Calendar, GitBranch, Brain, TrendingUp } from 'lucide-react';

const navigationItems = [
  { title: 'Tasks', url: '/', icon: CheckSquare },
  { title: 'Schedule', url: '/schedule', icon: Calendar },
  { title: 'Dependencies', url: '/dependencies', icon: GitBranch },
  { title: 'AI Optimizer', url: '/ai-optimizer', icon: Brain },
];

export function Sidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const collapsed = state === 'collapsed';

  return (
    <SidebarPrimitive
      className={`${collapsed ? 'w-14' : 'w-64'} border-r transition-all duration-300`}
    >
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-semibold">AI Smart To-Do</h2>
              <p className="text-xs text-muted-foreground">Task Scheduler</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarPrimitive>
  );
}