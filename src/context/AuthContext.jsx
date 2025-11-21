import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '/home/demoner/alpha-earth/login-front/src/service/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      // Aqui você poderia fazer uma requisição para validar o token
      // ou decodificar o JWT para obter informações do usuário
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { data } = response.data;
      
      // Salvar tokens
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      
      // Atualizar estado
      setIsAuthenticated(true);
      setUser(data.user);
      
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao fazer login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await usersAPI.create(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao criar conta' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar localStorage independente do sucesso da requisição
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};