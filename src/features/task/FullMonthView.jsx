import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

// (Componentes DayNumber e DayHeader não mudam)
const DayNumber = ({ day, isCurrentMonth = true, isSelected = false }) => (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
        isSelected ? 'bg-yellow-300 text-black' : (isCurrentMonth ? 'text-gray-900' : 'text-gray-300')
    } ${isCurrentMonth ? 'font-medium' : ''}`}>
        {day}
    </div>
);
const DayHeader = ({ children }) => (
    <div className="text-center text-sm font-medium text-gray-500">{children}</div>
);


export const FullMonthView = ({ onClose }) => {
    return (
        // 1. Adicionado 'h-full flex flex-col'
        <div className="h-full flex flex-col">
            {/* Cabeçalho (sem alteração) */}
            <div className="flex items-center justify-between mb-4">
                {onClose ? (
                    <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </button>
                ) : (
                    <div className="w-8"></div>
                )}
                <div className="flex items-center gap-4">
                    <ChevronLeft size={16} className="text-gray-400 cursor-pointer" />
                    <span className="text-gray-400 font-medium">jun</span>
                    <span className="text-xl font-bold text-gray-900">July</span>
                    <span className="text-gray-400 font-medium">Aug</span>
                    <ChevronRight size={16} className="text-gray-400 cursor-pointer" />
                </div>
                <span className="text-xl font-bold text-gray-900">2024</span>
            </div>

            {/* Grid do Calendário */}
            {/* 2. Adicionado 'flex-grow flex flex-col' para fazer esta seção crescer */}
            <div className="space-y-3 flex-grow flex flex-col">
                {/* Headers (sem alteração) */}
                <div className="grid grid-cols-7 gap-2">
                    <DayHeader>S</DayHeader>
                    <DayHeader>M</DayHeader>
                    <DayHeader>T</DayHeader>
                    <DayHeader>W</DayHeader>
                    <DayHeader>T</DayHeader>
                    <DayHeader>F</DayHeader>
                    <DayHeader>S</DayHeader>
                </div>

                {/* Dias */}
                {/* 3. Adicionado 'flex-grow' para que as linhas do grid preencham o espaço */}
                <div className="grid grid-cols-7 gap-y-2 place-items-center flex-grow">
                    {/* (Conteúdo dos dias não muda) */}
                    <DayNumber day="30" isCurrentMonth={false} />
                    <DayNumber day="1" />
                    <DayNumber day="2" />
                    <DayNumber day="3" />
                    <DayNumber day="4" />
                    <DayNumber day="5" />
                    <DayNumber day="6" />
                    
                    <DayNumber day="7" />
                    <DayNumber day="8" />
                    <DayNumber day="9" />
                    <DayNumber day="10" />
                    <DayNumber day="11" />
                    <DayNumber day="12" />
                    <DayNumber day="13" />

                    <DayNumber day="14" />
                    <DayNumber day="15" />
                    <DayNumber day="16" />
                    <DayNumber day="17" />
                    <DayNumber day="18" />
                    <DayNumber day="19" />
                    <DayNumber day="20" />

                    <DayNumber day="21" />
                    <DayNumber day="22" />
                    <DayNumber day="23" />
                    <DayNumber day="24" />
                    <DayNumber day="25" />
                    <DayNumber day="26" />
                    <DayNumber day="27" />

                    <DayNumber day="28" />
                    <DayNumber day="29" />
                    <DayNumber day="30" isSelected={true} />
                    <DayNumber day="31" />
                    <DayNumber day="1" isCurrentMonth={false} />
                    <DayNumber day="2" isCurrentMonth={false} />
                    <DayNumber day="3" isCurrentMonth={false} />
                </div>
            </div>
        </div>
    );
};