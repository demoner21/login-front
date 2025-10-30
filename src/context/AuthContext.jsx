import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Criar o Provedor (Provider)
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Função de login (simulada)
    // No mundo real, você receberia um token aqui
    const login = () => {
        // Lógica de simulação:
        // 1. Define o estado como autenticado
        setIsAuthenticated(true);

        // 2. (Opcional) No mundo real, você salvaria o token no localStorage
        // localStorage.setItem('authToken', 'meu-token-falso');
    };

    // Função de logout (simulada)
    const logout = () => {
        // Lógica de simulação:
        // 1. Define o estado como não autenticado
        setIsAuthenticated(false);

        // 2. (Opcional) Remove o token
        // localStorage.removeItem('authToken');

        // 3. Redireciona para a página de login
        navigate('/login');
    };

    // 3. O valor que será compartilhado com os componentes filhos
    const value = {
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};