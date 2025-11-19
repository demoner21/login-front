import React from 'react';

export const Input = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    placeholder = '',
    autoComplete = '',
}) => {
    return (
        <div className="mb-6">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-600 mb-1"
            >
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900"
            />
        </div>
    );
};