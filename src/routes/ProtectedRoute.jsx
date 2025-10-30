import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth(); // Pega o estado do nosso contexto

    if (!isAuthenticated) {
        // 1. Se não estiver logado, redireciona para /login
        // 'replace' impede o usuário de voltar para a página protegida no histórico
        return <Navigate to="/login" replace />;
    }

    // 2. Se estiver logado, renderiza o conteúdo da rota (ex: DashboardPage)
    return <Outlet />;
};

export default ProtectedRoute;