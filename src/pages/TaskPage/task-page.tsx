import { useState } from 'react';
import { TaskSummary } from '@/widgets/Task/task-summary';
import { Modal } from '@/shared/ui/modal';
import { WeekScrollerView } from '@/features/task/week-scroller-view';
import { FullMonthView } from '@/features/task/full-month-view';
import { CreateTaskForm } from '@/features/task/create-task-form';
import { TaskList } from '@/features/task/task-list';
import { Plus } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    roiId: null | string;
}

const getTodayString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TODAY = getTodayString();

const MOCK_TASKS: Task[] = [
    {
        id: 1,
        title: 'Verificar sistema de irrigação (Setor A)',
        description: 'Checar se há vazamentos e se a pressão está correta.',
        dueDate: TODAY,
        priority: 'Alta',
        status: 'In Progress',
        roiId: null,
    },
    {
        id: 5,
        title: 'Reunião de alinhamento',
        description: 'Reunião com a equipe de campo.',
        dueDate: TODAY,
        priority: 'Média',
        status: 'Pendente',
        roiId: null,
    },
];

const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

    const allTasks = tasks;
    const tasksForToday = tasks.filter((task) => task.dueDate === TODAY);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-1 space-y-6">
                    <TaskSummary tasks={allTasks} />

                    <div className="block lg:hidden">
                        <WeekScrollerView onOpenMonthView={() => setIsMonthModalOpen(true)} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">Tarefas de Hoje</h2>
                        <TaskList tasks={tasksForToday} />

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

                {/* Right column – desktop only */}
                <div className="hidden lg:block lg:col-span-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm h-full">
                        <FullMonthView />
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateTaskForm onClose={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={isMonthModalOpen} onClose={() => setIsMonthModalOpen(false)}>
                <FullMonthView onClose={() => setIsMonthModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default TaskPage;