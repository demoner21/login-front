import React from 'react'; // Adicione a importação do React (boa prática)

// Use esta definição para o ícone de água
export const WaterUsageIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3.75a9.75 9.75 0 0 1 7.468 15.013H4.532A9.75 9.75 0 0 1 12 3.75Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 16.875h16.5M3.75 19.125h16.5"
        />
    </svg>
);

// GARANTA QUE NÃO HÁ NENHUM OUTRO 'export const WaterUsageIcon' NESTE ARQUIVO