import React, { ReactNode, MouseEvent } from 'react';

interface ButtonProps {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
}

export const Button = ({
    children,
    type = 'button',
    onClick,
    disabled = false,
    className = '',
}: ButtonProps) => {
    // Estilos base que se repetem
    const baseStyles = `
        w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 
        rounded-lg transition duration-300 shadow-md hover:shadow-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
        disabled:opacity-50 disabled:cursor-not-allowed
    `;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${className}`}
        >
            {children}
        </button>
    );
};