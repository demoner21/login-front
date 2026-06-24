import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getWeekDays, isSameDay, toDateKey } from '@/shared/lib/calendar';

interface WeekScrollerViewProps {
    onOpenMonthView: () => void;
    selectedDate?: Date;
    onSelectDate?: (date: Date) => void;
    taskDates?: Set<string>;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeekScrollerView = ({
    onOpenMonthView,
    selectedDate,
    onSelectDate,
    taskDates,
}: WeekScrollerViewProps) => {
    const today = new Date();
    const [weekAnchor, setWeekAnchor] = useState(selectedDate ?? today);
    const days = getWeekDays(weekAnchor);
    const isTodaySelected = selectedDate ? isSameDay(selectedDate, today) : true;

    const goToPrevWeek = () => {
        const prev = new Date(weekAnchor);
        prev.setDate(prev.getDate() - 7);
        setWeekAnchor(prev);
    };
    const goToNextWeek = () => {
        const next = new Date(weekAnchor);
        next.setDate(next.getDate() + 7);
        setWeekAnchor(next);
    };

    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-2">
                <div>
                    <p className="text-sm text-gray-500">
                        {weekAnchor.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {isTodaySelected ? 'Hoje' : 'Selecionado'}
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={goToPrevWeek} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Semana anterior">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={goToNextWeek} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Próxima semana">
                        <ChevronRight size={20} />
                    </button>
                    <button
                        onClick={onOpenMonthView}
                        className="p-2 text-gray-600 hover:text-gray-900"
                        aria-label="Abrir calendário"
                    >
                        <Calendar size={24} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((date, i) => {
                    const isSelected = selectedDate ? isSameDay(date, selectedDate) : isSameDay(date, today);
                    const hasTask = taskDates?.has(toDateKey(date));
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onSelectDate?.(date)}
                            className={`relative flex flex-col items-center p-2 rounded-lg gap-0.5 transition-colors ${
                                isSelected ? 'bg-yellow-300' : 'hover:bg-gray-100'
                            }`}
                        >
                            <span className={`text-xs ${isSelected ? 'text-black' : 'text-gray-500'}`}>
                                {DAY_LABELS[i]}
                            </span>
                            <span className={`text-sm font-bold ${isSelected ? 'text-black' : 'text-gray-900'}`}>
                                {date.getDate()}
                            </span>
                            {hasTask && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-blue-600" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};