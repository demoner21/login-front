export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
}

export const MONTH_NAMES_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/** Gera os 42 dias (6 semanas) de uma grade mensal, incluindo dias de overflow do mês anterior/seguinte */
export function getMonthGrid(year: number, month: number): CalendarDay[] {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay(); // 0 = Domingo
    const gridStart = new Date(year, month, 1 - startOffset);

    return Array.from({ length: 42 }, (_, i) => {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + i);
        return { date, isCurrentMonth: date.getMonth() === month };
    });
}

/** Retorna os 7 dias (Dom-Sáb) da semana que contém referenceDate */
export function getWeekDays(referenceDate: Date): Date[] {
    const start = new Date(referenceDate);
    start.setDate(referenceDate.getDate() - referenceDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/** Chave estável "YYYY-MM-DD", útil para marcar dias com tarefa num Set */
export function toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}