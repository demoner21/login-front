import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, children }) => {
    
    // 1. MUDANÇA: Não vamos mais retornar 'null'.
    // O componente sempre existe, mas fica invisível.
    // Isso é o que permite a animação de *saída* (fade-out).

    return (
        // --- Overlay (O Fundo) ---
        <div 
            className={`
                fixed inset-0 z-50 flex items-center justify-center
                
                ${/* 2. MUDANÇA: Estilo de fundo mais suave */ ''}
                bg-gray-900/75 backdrop-blur-md 
                
                ${/* 3. MUDANÇA: Adiciona classes de transição (fade-in/out) */ ''}
                transition-opacity duration-300 ease-out
                
                ${/* 4. MUDANÇA: Controla a visibilidade com opacidade e 'pointer-events' */ ''}
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            onClick={onClose}
        >
            {/* --- Conteúdo do Modal (A Caixa) --- */}
            <div
                className={`
                    relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl
                    
                    ${/* 5. MUDANÇA: Adiciona transição para (fade + scale) */ ''}
                    transition-all duration-300 ease-out
                    
                    ${/* 6. MUDANÇA: Define os estados 'fechado' (scale-95) e 'aberto' (scale-100) */ ''}
                    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                `}
                onClick={(e) => e.stopPropagation()} // Impede o clique no modal de fechar o overlay
            >
                {/* Botão de Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    aria-label="Fechar modal"
                >
                    <X size={20} />
                </button>

                {children}
            </div>
        </div>
    );
};