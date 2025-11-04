import React from 'react';

export const TaskSummary = ({ tasks = [] }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Done').length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Resumo das Tarefas</h2>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-3xl font-bold text-blue-900">{percentage}%</p>
                    <p className="text-sm text-gray-600">Concluídas</p>
                </div>
                <div>
                    <p className="text-lg text-gray-700">
                        <span className="font-bold">{completedTasks}</span> de <span className="font-bold">{totalTasks}</span> tarefas
                    </p>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div
                    className="bg-blue-900 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};