import React from 'react';
import { Plus } from 'lucide-react';

// Por enquanto, este é um placeholder visual.
// No futuro, ele pode ser um modal ou um formulário inline.
export const CreateTaskForm = () => {
    return (
        <form className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Criar Nova Tarefa</h2>

            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input type="text" id="title" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ex: Verificar irrigação" />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
                <textarea id="description" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="..."></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega</label>
                    <input type="date" id="dueDate" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                    <select id="priority" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>
            </div>

            {/* Ocultamos o seletor de ROI por enquanto
            <div className="mb-4">
                <label htmlFor="roi" className="block text-sm font-medium text-gray-700 mb-1">Vincular à ROI (Opcional)</label>
                <select id="roi" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" disabled>
                    <option>Disponível após integração</option>
                </select>
            </div>
            */}

            <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center gap-2"
                onClick={(e) => e.preventDefault()} // Impede o envio real por enquanto
            >
                <Plus size={20} />
                Adicionar Tarefa
            </button>
        </form>
    );
};