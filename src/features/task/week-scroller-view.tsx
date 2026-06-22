import { Calendar } from 'lucide-react';

interface DayItemProps {
    dayName: string;
    dayNum: string;
    isSelected?: boolean;
}

interface WeekScrollerViewProps {
    onOpenMonthView: () => void;
}

const DayItem = ({ dayName, dayNum, isSelected = false }: DayItemProps) => (
    <div
        className={`flex flex-col items-center p-2 rounded-lg gap-0.5 ${isSelected ? 'bg-yellow-300' : ''}`}
    >
        <span className={`text-xs ${isSelected ? 'text-black' : 'text-gray-500'}`}>{dayName}</span>
        <span className={`text-sm font-bold ${isSelected ? 'text-black' : 'text-gray-900'}`}>
            {dayNum}
        </span>
    </div>
);

export const WeekScrollerView = ({ onOpenMonthView }: WeekScrollerViewProps) => {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-2">
                <div>
                    <p className="text-sm text-gray-500">July 30, 2024</p>
                    <h3 className="text-2xl font-bold text-gray-900">Today</h3>
                </div>
                <button
                    onClick={onOpenMonthView}
                    className="p-2 text-gray-600 hover:text-gray-900"
                    aria-label="Abrir calendário"
                >
                    <Calendar size={24} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
                <DayItem dayName="Sun" dayNum="29" />
                <DayItem dayName="Mon" dayNum="30" />
                <DayItem dayName="Tue" dayNum="31" isSelected />
                <DayItem dayName="Wed" dayNum="1" />
                <DayItem dayName="Thu" dayNum="2" />
                <DayItem dayName="Fri" dayNum="3" />
                <DayItem dayName="Sat" dayNum="4" />
            </div>
        </div>
    );
};