import { Calendar, Tag, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskItemProps {
    task: Task;
    onDelete?: (taskId: string) => void;
    onToggleDone?: (task: Task) => void;
}

const priorityStyles: Record<Task['priority'], string> = {
    Low: 'border-green-500 bg-green-50',
    Medium: 'border-yellow-500 bg-yellow-50',
    High: 'border-red-500 bg-red-50',
};

const priorityLabels: Record<Task['priority'], string> = {
    Low: 'Baixa',
    Medium: 'Média',
    High: 'Alta',
};

const statusStyles: Record<Task['status'], string> = {
    Pending: 'text-gray-600 bg-gray-200',
    InProgress: 'text-blue-600 bg-blue-100',
    Done: 'text-green-600 bg-green-200',
    Canceled: 'text-red-600 bg-red-200',
};

const statusLabels: Record<Task['status'], string> = {
    Pending: 'Pendente',
    InProgress: 'Em Andamento',
    Done: 'Concluída',
    Canceled: 'Cancelada',
};

export const TaskItem = ({ task, onDelete, onToggleDone }: TaskItemProps) => {
    const priorityClass = priorityStyles[task.priority] ?? 'border-gray-300 bg-gray-50';
    const statusClass = statusStyles[task.status] ?? 'text-gray-600 bg-gray-200';
    const isDone = task.status === 'Done';

    return (
        <div className={`rounded-lg p-3 shadow-sm border-l-4 ${priorityClass}`}>
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-2 min-w-0">
                    {onToggleDone && (
                        <button
                            onClick={() => onToggleDone(task)}
                            className="mt-0.5 text-gray-400 hover:text-green-600 transition-colors shrink-0"
                            title={isDone ? 'Reabrir tarefa' : 'Marcar como concluída'}
                        >
                            {isDone ? (
                                <CheckCircle2 size={18} className="text-green-600" />
                            ) : (
                                <Circle size={18} />
                            )}
                        </button>
                    )}
                    <div className="min-w-0">
                        <h3
                            className={`text-base font-semibold ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}
                        >
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className="text-sm text-gray-600 truncate">{task.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClass}`}>
                        {statusLabels[task.status]}
                    </span>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(task.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Remover tarefa"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                {task.due_date && (
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5">
                    <Tag size={14} />
                    <span>{priorityLabels[task.priority]}</span>
                </div>
            </div>
        </div>
    );
};