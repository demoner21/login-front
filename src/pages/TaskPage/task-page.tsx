import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { TaskSummary } from '@/widgets/Task/task-summary';
import { Modal } from '@/shared/ui/modal';
import { WeekScrollerView } from '@/features/task/week-scroller-view';
import { FullMonthView } from '@/features/task/full-month-view';
import { CreateTaskForm } from '@/features/task/create-task-form';
import { TaskList } from '@/features/task/task-list';
import { tasksAPI } from '@/service/api';
import { Task } from '@/types/task';
import { toDateKey, isSameDay } from '@/shared/lib/calendar';
import { Plus } from 'lucide-react';

const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await tasksAPI.list();
            setTasks(response.data ?? []);
        } catch {
            toast.error('Não foi possível carregar suas tarefas.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleTaskCreated = (task: Task) => setTasks((prev) => [task, ...prev]);

    const handleDelete = async (taskId: string) => {
        try {
            await tasksAPI.delete(taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            toast.success('Tarefa removida.');
        } catch {
            toast.error('Erro ao remover tarefa.');
        }
    };

    const handleToggleDone = async (task: Task) => {
        const nextStatus = task.status === 'Done' ? 'Pending' : 'Done';
        try {
            const response = await tasksAPI.update(task.id, { status: nextStatus });
            setTasks((prev) => prev.map((t) => (t.id === task.id ? response.data : t)));
        } catch {
            toast.error('Erro ao atualizar status da tarefa.');
        }
    };

    // Datas que têm ao menos 1 tarefa — usado para marcar bolinhas no calendário
    const taskDates = useMemo(() => {
        const set = new Set<string>();
        tasks.forEach((t) => {
            if (t.due_date) set.add(toDateKey(new Date(t.due_date)));
        });
        return set;
    }, [tasks]);

    const tasksForSelectedDate = useMemo(
        () => tasks.filter((task) => task.due_date && isSameDay(new Date(task.due_date), selectedDate)),
        [tasks, selectedDate],
    );

    const isToday = isSameDay(selectedDate, new Date());

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <TaskSummary tasks={tasks} />

                    <div className="block lg:hidden">
                        <WeekScrollerView
                            onOpenMonthView={() => setIsMonthModalOpen(true)}
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                            taskDates={taskDates}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">
                            {isToday ? 'Tarefas de Hoje' : `Tarefas de ${selectedDate.toLocaleDateString('pt-BR')}`}
                        </h2>
                        <TaskList
                            tasks={tasksForSelectedDate}
                            isLoading={isLoading}
                            onDelete={handleDelete}
                            onToggleDone={handleToggleDone}
                        />

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl p-4 text-gray-600 hover:text-gray-800 transition-all duration-300"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23D1D5DB' stroke-width='3' stroke-dasharray='6%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                                border: 'none',
                            }}
                        >
                            <Plus size={20} />
                            Adicionar uma tarefa
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block lg:col-span-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm h-full">
                        <FullMonthView
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                            taskDates={taskDates}
                        />
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateTaskForm onClose={() => setIsModalOpen(false)} onCreated={handleTaskCreated} />
            </Modal>

            <Modal isOpen={isMonthModalOpen} onClose={() => setIsMonthModalOpen(false)}>
                <FullMonthView
                    onClose={() => setIsMonthModalOpen(false)}
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                        setSelectedDate(date);
                        setIsMonthModalOpen(false);
                    }}
                    taskDates={taskDates}
                />
            </Modal>
        </div>
    );
};

export default TaskPage;