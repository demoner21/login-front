import React from 'react';
import { TaskItem } from './TaskItem';

export const TaskList = ({ tasks = [] }) => {
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
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};