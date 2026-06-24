import { Task } from '@/types/task';
import { TaskItem } from '@/features/task/task-item';
import { Skeleton } from '@/shared/ui/skeleton';

interface TaskListProps {
    tasks?: Task[];
    isLoading?: boolean;
    onDelete?: (taskId: string) => void;
    onToggleDone?: (task: Task) => void;
}

export const TaskList = ({ tasks = [], isLoading = false, onDelete, onToggleDone }: TaskListProps) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg p-3 shadow-sm border-l-4 border-gray-200 bg-white">
                        <div className="flex justify-between items-start mb-2">
                            <div className="space-y-2 w-3/4">
                                <Skeleton className="h-5 w-1/2" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="flex gap-4 mt-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
                <p className="text-gray-600">Nenhuma tarefa encontrada.</p>
                <p className="text-sm text-gray-500 mt-1">Adicione uma nova tarefa para começar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onDelete={onDelete} onToggleDone={onToggleDone} />
            ))}
        </div>
    );
};