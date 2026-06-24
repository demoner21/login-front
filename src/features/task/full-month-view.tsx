import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthGrid, isSameDay, toDateKey, MONTH_NAMES_PT, WEEKDAY_LABELS } from '@/shared/lib/calendar';

interface FullMonthViewProps {
    onClose?: () => void;
    selectedDate?: Date;
    onSelectDate?: (date: Date) => void;
    /** Datas (formato YYYY-MM-DD) que possuem tarefa, para exibir uma bolinha indicadora */
    taskDates?: Set<string>;
}

const DayHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="text-center text-sm font-medium text-gray-500">{children}</div>
);

export const FullMonthView = ({ onClose, selectedDate, onSelectDate, taskDates }: FullMonthViewProps) => {
    const initial = selectedDate ?? new Date();
    const [viewDate, setViewDate] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));

    const goToPrevMonth = () =>
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const goToNextMonth = () =>
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const days = getMonthGrid(viewDate.getFullYear(), viewDate.getMonth());
    const today = new Date();

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                {onClose ? (
                    <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </button>
                ) : (
                    <div className="w-8" />
                )}
                <div className="flex items-center gap-4">
                    <button
                        onClick={goToPrevMonth}
                        className="p-1 text-gray-400 hover:text-gray-700"
                        aria-label="Mês anterior"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-xl font-bold text-gray-900 min-w-[8rem] text-center">
                        {MONTH_NAMES_PT[viewDate.getMonth()]}
                    </span>
                    <button
                        onClick={goToNextMonth}
                        className="p-1 text-gray-400 hover:text-gray-700"
                        aria-label="Próximo mês"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <span className="text-xl font-bold text-gray-900">{viewDate.getFullYear()}</span>
            </div>

            <div className="space-y-3 flex-grow flex flex-col">
                <div className="grid grid-cols-7 gap-2">
                    {WEEKDAY_LABELS.map((d, i) => (
                        <DayHeader key={i}>{d}</DayHeader>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2 place-items-center flex-grow">
                    {days.map(({ date, isCurrentMonth }) => {
                        const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                        const isToday = isSameDay(date, today);
                        const hasTask = taskDates?.has(toDateKey(date));

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => onSelectDate?.(date)}
                                className="relative flex flex-col items-center"
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                                        isSelected
                                            ? 'bg-yellow-300 text-black'
                                            : isToday
                                              ? 'border border-blue-500 text-blue-700'
                                              : isCurrentMonth
                                                ? 'text-gray-900 hover:bg-gray-100'
                                                : 'text-gray-300'
                                    } ${isCurrentMonth ? 'font-medium' : ''}`}
                                >
                                    {date.getDate()}
                                </div>
                                {hasTask && (
                                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-blue-600" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};