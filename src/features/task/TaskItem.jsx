import React from 'react';
import { Calendar, Tag } from 'lucide-react';

const priorityStyles = {
    'Baixa': 'border-green-500 bg-green-50',
    'Média': 'border-yellow-500 bg-yellow-50',
    'Alta': 'border-red-500 bg-red-50',
};
const statusStyles = {
    'Pendente': 'text-gray-600 bg-gray-200',
    'In Progress': 'text-blue-600 bg-blue-100',
    'Done': 'text-green-600 bg-green-200',
    'Canceled': 'text-red-600 bg-red-200',
};

export const TaskItem = ({ task }) => {
    const priorityClass = priorityStyles[task.priority] || 'border-gray-300 bg-gray-50';
    const statusClass = statusStyles[task.status] || 'text-gray-600 bg-gray-200';

    // --- MUDANÇAS AQUI ---
    // 1. Padding principal 'p-4' (1rem) alterado para 'p-3' (0.75rem)
    return (
        <div className={`rounded-lg p-3 shadow-sm border-l-4 ${priorityClass}`}>
            <div className="flex justify-between items-start">

                <div>

                    <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>

                    <p className="text-sm text-gray-600">{task.description}</p>
                </div>

                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClass}`}>
                    {task.status}
                </span>
            </div>


            <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">

                <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{task.dueDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Tag size={14} />
                    <span>{task.priority}</span>
                </div>

            </div>
        </div>
    );
};