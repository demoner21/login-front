import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

export const Topbar = () => {
    return (
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-gray-200 bg-white px-6">

            <div className="flex items-center">
                {/* 3. Botão de Menu REMOVIDO */}
                <h1 className="text-xl font-semibold text-gray-900">Farm Map</h1>
            </div>

            {/* Seção de Pesquisa e Ações (sem mudanças) */}
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="search"
                        placeholder="Search..."
                        className="rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <button className="text-gray-500 hover:text-gray-700">
                    <Bell className="h-6 w-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <Settings className="h-6 w-6" />
                </button>
                <button className="h-9 w-9 overflow-hidden rounded-full">
                    <img
                        src="https://via.placeholder.com/150" // Placeholder para avatar
                        alt="User avatar"
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};