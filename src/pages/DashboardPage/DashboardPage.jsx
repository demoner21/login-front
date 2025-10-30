// src/pages/DashboardPage/DashboardPage.jsx

import React from 'react';

const DashboardPage = () => {
    return (
        // 1. ESTE é o "elemento renderizado" que flutua.
        // É um card branco (bg-white), com cantos arredondados (rounded-2xl)
        // e sombra (shadow-sm) sobre o fundo cinza (bg-gray-50) do <main>.
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Bem-vindo ao Dashboard!</h2>
            <p className="text-gray-700">
                Este é o seu "Overview". Agora esta página flutua sobre o fundo cinza.
            </p>
        </div>
    );
};

export default DashboardPage;