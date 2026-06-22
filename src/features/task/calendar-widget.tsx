import { useState } from 'react';
import { Modal } from '@/shared/ui/modal';
import { WeekScrollerView } from '@/features/task/week-scroller-view';
import { FullMonthView } from '@/features/task/full-month-view';

export const CalendarWidget = () => {
    const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

    return (
        <>
            {/* Vista Desktop */}
            <div className="hidden md:block rounded-2xl bg-white p-6 shadow-sm">
                <FullMonthView />
            </div>

            {/* Vista Mobile */}
            <div className="block md:hidden">
                <WeekScrollerView onOpenMonthView={() => setIsMonthModalOpen(true)} />
            </div>

            {/* Modal (Apenas para Mobile) */}
            <Modal isOpen={isMonthModalOpen} onClose={() => setIsMonthModalOpen(false)}>
                <FullMonthView onClose={() => setIsMonthModalOpen(false)} />
            </Modal>
        </>
    );
};