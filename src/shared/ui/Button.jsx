import React from 'react';

export const Button = ({
    children,
    type = 'button',
    onClick,
    disabled = false,
    className = '',
}) => {
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