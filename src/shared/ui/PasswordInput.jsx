import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = ({ 
    id, 
    label, 
    value, 
    onChange, 
    placeholder = "Mínimo 6 caracteres", 
    required = false,
    error // Opcional: para mostrar erro visual se necessário
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // O estilo exato que você pediu
    const inputStyle = "w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900 placeholder-gray-400 transition-colors";

    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className={`${inputStyle} pr-10`} // pr-10 para o texto não ficar sob o ícone
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    );
};