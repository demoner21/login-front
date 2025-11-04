import React, { useState } from 'react';
import { TaskSummary } from '../../widgets/Task/TaskSummary';
import { CreateTaskForm } from '../..//features/task/CreateTaskForm';
import { TaskList } from '../..//features/task/TaskList';

const MOCK_TASKS = [
    {
        id: 1,
        title: 'Verificar sistema de irrigação (Setor A)',
        description: 'Checar se há vazamentos e se a pressão está correta.',
        dueDate: '2025-11-10',
        priority: 'Alta',
        status: 'In Progress',
        roiId: null
    },
    {
        id: 2,
        title: 'Coleta de amostra de solo (Setor B)',
        description: 'Coletar 5 amostras para análise de pH.',
        dueDate: '2025-11-12',
        priority: 'Média',
        status: 'Done',
        roiId: null
    },
    {
        id: 3,
        title: 'Manutenção do Trator 02',
        description: 'Troca de óleo e filtro.',
        dueDate: '2025-11-05',
        priority: 'Baixa',
        status: 'Done',
        roiId: null
    },
    {
        id: 4,
        title: 'Reunião com fornecedor de sementes',
        description: '',
        dueDate: '2025-11-08',
        priority: 'Média',
        status: 'Canceled',
        roiId: null
    },
];
// Adicionamos 'Pendente' como o status inicial padrão.

const TaskPage = () => {
    // Por enquanto, o estado vive aqui.
    const [tasks, setTasks] = useState(MOCK_TASKS);

    // No futuro, as funções de adicionar, editar e deletar tarefas
    // serão passadas para os componentes filhos.

    return (
        // Usamos o padding padrão do dashboard
        <div className="p-6">

            {/* Layout da Página (inspirado nas imagens e na arquitetura):
              - Desktop: Coluna de formulário/resumo à esquerda, lista à direita.
              - Mobile: Pilha vertical.
            */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Coluna Esquerda (Formulário e Resumo) */}
                <div className="lg:col-span-1 space-y-6">
                    <TaskSummary tasks={tasks} />
                    <CreateTaskForm />
                </div>

                {/* Coluna Direita (Lista de Tarefas) */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Minhas Tarefas</h2>
                    <TaskList tasks={tasks} />
                </div>

            </div>
        </div>
    );
};

export default TaskPage;