import { useState } from 'react';
import { toast } from 'sonner';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { tasksAPI } from '@/service/api';
import { Task } from '@/types/task';

interface CreateTaskFormProps {
    onClose: () => void;
    onCreated: (task: Task) => void;
}

interface FormErrors {
    title?: string;
    date?: string;
    time?: string;
}

type Priority = 'High' | 'Medium' | 'Low';

const priorityLabels: Record<Priority, string> = { High: 'Alta', Medium: 'Média', Low: 'Baixa' };

export const CreateTaskForm = ({ onClose, onCreated }: CreateTaskFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState<Priority>('High');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!title || title.trim().length < 3) newErrors.title = 'O nome da tarefa precisa ter ao menos 3 caracteres.';
        if (!date) newErrors.date = 'A data é obrigatória.';
        if (!time) newErrors.time = 'A hora é obrigatória.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const due_date = new Date(`${date}T${time}`).toISOString();

            const response = await tasksAPI.create({
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
                due_date,
            });

            toast.success('Tarefa criada com sucesso!');
            onCreated(response.data);
            onClose();
        } catch (err: any) {
            toast.error('Erro ao criar tarefa', {
                description: err.response?.data?.error || 'Tente novamente mais tarde.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getErrorClass = (fieldName: keyof FormErrors) =>
        errors[fieldName]
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-700 focus:ring-blue-700';

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Add a Task</h2>

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
                    {errors.title && <AlertCircle size={16} className="absolute right-3 top-2.5 text-red-500" />}
                </div>
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (Opcional)
                </label>
                <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:border-blue-700 focus:ring-1"
                    placeholder="Enter task description"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <div className="relative">
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring-1 ${getErrorClass('date')}`}
                        />
                        {!date && <Calendar size={16} className="absolute right-3 top-2.5 text-gray-400" />}
                    </div>
                    {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <div className="relative">
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring-1 ${getErrorClass('time')}`}
                        />
                        {!time && <Clock size={16} className="absolute right-3 top-2.5 text-gray-400" />}
                    </div>
                    {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Set priority</label>
                <div className="flex space-x-4">
                    {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
                        <label key={p} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="priority"
                                value={p}
                                checked={priority === p}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                                className="h-4 w-4 text-blue-700 focus:ring-blue-600"
                            />
                            <span className={`text-sm font-medium ${priority === p ? 'text-gray-900' : 'text-gray-600'}`}>
                                {priorityLabels[p]}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center gap-2"
            >
                {isSubmitting ? 'Salvando...' : 'Add'}
            </button>
        </form>
    );
};