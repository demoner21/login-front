import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

// Recebemos 'onClose' do modal para podermos fechá-lo
export const CreateTaskForm = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState('High'); // 'High' como padrão
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!title) {
            newErrors.title = 'O nome da tarefa é obrigatório.';
        }
        if (!date) {
            newErrors.date = 'A data é obrigatória.';
        }
        if (!time) {
            newErrors.time = 'A hora é obrigatória.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Nova Tarefa:', { title, description, date, time, priority });
            // Aqui você adicionaria a lógica para salvar a tarefa
            onClose(); // Fecha o modal após o sucesso
        }
    };

    // Estilo condicional para inputs com erro
    const getErrorClass = (fieldName) => {
        return errors[fieldName] 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-700 focus:ring-blue-700';
    };

    return (
        // Note que removemos o card branco, pois o Modal.jsx já o fornece
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Add a Task</h2>

            {/* Título */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Tarefa
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring-1 ${getErrorClass('title')}`}
                        placeholder="Enter task name"
                    />
                    {errors.title && (
                        <AlertCircle size={16} className="absolute right-3 top-2.5 text-red-500" />
                    )}
                </div>
                {errors.title && (
                    <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
            </div>

            {/* Descrição */}
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (Opcional)
                </label>
                <textarea
                    id="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:border-blue-700 focus:ring-1"
                    placeholder="Enter task description"
                ></textarea>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Data
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring-1 ${getErrorClass('date')}`}
                        />
                        {!date && (
                             <Calendar size={16} className="absolute right-3 top-2.5 text-gray-400" />
                        )}
                    </div>
                     {errors.date && (
                        <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                        Hora
                    </label>
                     <div className="relative">
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring-1 ${getErrorClass('time')}`}
                        />
                         {!time && (
                            <Clock size={16} className="absolute right-3 top-2.5 text-gray-400" />
                        )}
                    </div>
                     {errors.time && (
                        <p className="mt-1 text-xs text-red-600">{errors.time}</p>
                    )}
                </div>
            </div>

            {/* Prioridade (Radio Buttons) */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Set priority</label>
                <div className="flex space-x-4">
                    {['High', 'Medium', 'Low'].map((p) => (
                        <label key={p} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="priority"
                                value={p}
                                checked={priority === p}
                                onChange={(e) => setPriority(e.target.value)}
                                className="h-4 w-4 text-blue-700 focus:ring-blue-600"
                            />
                            <span className={`text-sm font-medium ${priority === p ? 'text-gray-900' : 'text-gray-600'}`}>
                                {p}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Botão de Adicionar */}
            <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center gap-2"
            >
                Add
            </button>
        </form>
    );
};