import React, { useState } from 'react';
import { Modal } from '../../shared/ui/Modal';
import { WeekScrollerView } from './WeekScrollerView';
import { FullMonthView } from './FullMonthView';

export const CalendarWidget = () => {
    // Estado para controlar o modal do calendário no mobile
    const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

    return (
        <>
            {/* --- Vista Desktop --- 
              (hidden = escondido em telas pequenas, md:block = visível em telas médias/grandes)
              Renderiza a view de mês completo dentro do card de widget padrão.
            */}
            <div className="hidden md:block rounded-2xl bg-white p-6 shadow-sm">
                <FullMonthView />
            </div>

            {/* --- Vista Mobile ---
              (block = visível em telas pequenas, md:hidden = escondido em telas médias/grandes)
              Renderiza o scroller da semana (que já tem seu próprio card).
            */}
            <div className="block md:hidden">
                <WeekScrollerView onOpenMonthView={() => setIsMonthModalOpen(true)} />
            </div>

            {/* --- Modal (Apenas para Mobile) ---
              O Modal já fornece o fundo branco e o padding.
            */}
            <Modal isOpen={isMonthModalOpen} onClose={() => setIsMonthModalOpen(false)}>
                {/* Passamos a função 'onClose' para que o FullMonthView possa mostrar o botão de voltar */}
                <FullMonthView onClose={() => setIsMonthModalOpen(false)} />
            </Modal>
        </>
    );
};