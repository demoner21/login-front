import React, { useState } from 'react';
import { TaskSummary } from '../../widgets/Task/TaskSummary';
import { Modal } from '../../shared/ui/Modal';
// 1. Importe as visualizações do calendário diretamente
import { WeekScrollerView } from '../../features/task/WeekScrollerView';
import { FullMonthView } from '../../features/task/FullMonthView';
import { CreateTaskForm } from '../..//features/task/CreateTaskForm';
import { TaskList } from '../..//features/task/TaskList';
import { Plus } from 'lucide-react';

// --- (Lógica de MOCK_TASKS e TODAY_STRING permanece a mesma) ---
const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const TODAY = getTodayString();
const MOCK_TASKS = [
     {
        id: 1,
        title: 'Verificar sistema de irrigação (Setor A)',
        description: 'Checar se há vazamentos e se a pressão está correta.',
        dueDate: TODAY, // Tarefa de hoje
        priority: 'Alta',
        status: 'In Progress',
        roiId: null
    },
    {
        id: 5,
        title: 'Reunião de alinhamento',
        description: 'Reunião com a equipe de campo.',
        dueDate: TODAY, // Tarefa de hoje
        priority: 'Média',
        status: 'Pendente',
        roiId: null
    },
    // ...outras tarefas
];
// --- (Fim da lógica de Mocks) ---


const TaskPage = () => {
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 2. Renomeie o estado do modal para clareza
    const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

    const allTasks = tasks;
    const tasksForToday = tasks.filter(task => task.dueDate === TODAY);

    return (
        <div className="p-6">
            {/* 3. A estrutura do grid principal permanece */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- COLUNA ESQUERDA (Mobile: Tudo / Desktop: Tarefas) --- */}
                {/* Esta coluna agora contém a lógica mobile */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Item 1: Resumo (Visível em todos) */}
                    <TaskSummary tasks={allTasks} />

                    {/* Item 2: Calendário da Semana (APENAS MOBILE) */}
                    {/* 'lg:hidden' significa "esconder em telas 'lg' ou maiores" */}
                    <div className="block lg:hidden">
                        <WeekScrollerView onOpenMonthView={() => setIsMonthModalOpen(true)} />
                    </div>

                    {/* Item 3: Lista de Tarefas (Visível em todos) */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">Tarefas de Hoje</h2>
                        <TaskList tasks={tasksForToday} />
                        
                        {/* Botão de Adicionar (Visível em todos) */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all duration-300"
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

                {/* --- COLUNA DIREITA (APENAS DESKTOP) --- */}
                {/* 'hidden' significa "escondido por padrão" */}
                {/* 'lg:block' significa "mostrar como block em telas 'lg' ou maiores" */}
                <div className="hidden lg:block lg:col-span-2">
                    {/* 4. Colocamos o FullMonthView dentro do seu card com h-full */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm h-full">
                        <FullMonthView />
                    </div>
                </div>

            </div>

            {/* Modal para Adicionar Tarefa (sem alteração) */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateTaskForm onClose={() => setIsModalOpen(false)} />
            </Modal>

            {/* Modal para Calendário (Mobile) */}
            <Modal isOpen={isMonthModalOpen} onClose={() => setIsMonthModalOpen(false)}>
                <FullMonthView onClose={() => setIsMonthModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default TaskPage;