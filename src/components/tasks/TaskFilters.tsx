import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskFiltersProps {
  statusFilter: 'all' | 'pending' | 'completed';
  priorityFilter: string;
  onStatusChange: (status: 'all' | 'pending' | 'completed') => void;
  onPriorityChange: (priority: string) => void;
}

export const TaskFilters = ({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) => {
  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ] as const;

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <div className="text-sm font-medium text-muted-foreground">Filter by Status:</div>
        <div className="flex gap-1">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-muted-foreground">Priority:</div>
        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};