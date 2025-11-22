import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { authAPI, usersAPI } from '../service/api'; // Ajuste o caminho conforme sua estrutura

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Inicializa a sessão ao carregar a página
  useEffect(() => {
    verifySession();
  }, []);

  // Função auxiliar para o "Cache Busting" da imagem
  const applyCacheBusting = (userData) => {
    if (userData && userData.avatar_url) {
      const timestamp = new Date().getTime();
      // Verifica se já tem query params para usar '&' ou '?'
      const separator = userData.avatar_url.includes('?') ? '&' : '?';
      return {
        ...userData,
        avatar_url: `${userData.avatar_url}${separator}t=${timestamp}`
      };
    }
    return userData;
  };

  const verifySession = async () => {
    try {
      // 1. Tenta renovar o token silenciosamente
      const response = await authAPI.refreshToken();
      const { data } = response.data;

      if (data && data.access_token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        
        let fullUserData = data.user;

        // 2. ESTRATÉGIA DE CARGA COMPLETA:
        // Se o login retorna dados parciais, buscamos o perfil completo agora.
        // Isso impede que campos como 'phone' ou 'address' venham vazios.
        try {
            if (data.user && data.user.id) {
                const profileResponse = await usersAPI.getById(data.user.id);
                // Ajuste conforme o retorno do seu backend (response.data ou response.data.data)
                if (profileResponse.data && profileResponse.data.data) {
                    fullUserData = profileResponse.data.data;
                } else if (profileResponse.data) {
                    fullUserData = profileResponse.data;
                }
            }
        } catch (profileError) {
            console.warn("Não foi possível carregar perfil completo, usando dados do token.", profileError);
        }

        const userWithCache = applyCacheBusting(fullUserData);
        setUser(userWithCache);
        setIsAuthenticated(true);
      } else {
        throw new Error('Token não recebido');
      }

    } catch (error) {
      // Se falhar o refresh, limpa tudo
      setIsAuthenticated(false);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { data } = response.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      
      setIsAuthenticated(true);
      
      // Aplicamos o cache busting na foto que veio do login
      setUser(applyCacheBusting(data.user));
      
      // NOTA: Se o login retornar usuário incompleto, a próxima vez que
      // der F5, o verifySession buscará os dados completos.
      
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
      delete api.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  };

  // ✅ Função Corrigida para Atualização Parcial
  const updateUserProfile = async (partialUserData) => {
    try {
      // 1. Envia para o backend APENAS os dados recebidos (que já devem estar filtrados pelo componente)
      await usersAPI.update(user.id, partialUserData);

      // 2. Atualiza o estado local fazendo MERGE (fusão)
      // Mantém os dados antigos (avatar, id, etc) e sobrepõe apenas os novos
      setUser((currentUser) => {
        const newUserState = {
          ...currentUser,
          ...partialUserData
        };
        return newUserState;
      });

      return { success: true };

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao atualizar perfil.' 
      };
    }
  };

  const updateUserPhoto = async (file) => {
    try {
      const response = await usersAPI.uploadAvatar(user.id, file);
      // Suporta retorno { data: user } ou { data: { data: user } }
      const updatedUserFromBackend = response.data.data || response.data;

      if (updatedUserFromBackend) {
        // Reaplica o cache busting com timestamp novo para forçar atualização da imagem
        const userWithNewPhoto = applyCacheBusting(updatedUserFromBackend);
        
        // Atualiza estado global
        setUser(userWithNewPhoto);
        return { success: true };
      }
      
      return { success: true, warning: 'Foto enviada, mas URL não retornada.' };

    } catch (error) {
      console.error('Erro no upload de avatar:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Falha ao enviar imagem.' 
      };
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    updateUserPhoto,
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