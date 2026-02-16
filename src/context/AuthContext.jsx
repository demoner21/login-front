import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { authAPI, usersAPI } from '../service/api';
import { User } from '../types/user';
import { AuthState, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });
    
    const navigate = useNavigate();

    /**
     * Cache Busting para Avatares
     */
    const applyCacheBusting = useCallback((userData: User): User => {
        if (userData?.avatar_url) {
            const timestamp = new Date().getTime();
            const separator = userData.avatar_url.includes('?') ? '&' : '?';
            return {
                ...userData,
                avatar_url: `${userData.avatar_url}${separator}t=${timestamp}`
            };
        }
        return userData;
    }, []);

    /**
     * Busca perfil completo do usuário
     */
    const fetchFullUserProfile = useCallback(async (userId: number): Promise<User> => {
        try {
            const profileResponse = await usersAPI.getById(userId);
            return profileResponse.data.data || profileResponse.data;
        } catch (error) {
            console.warn("Não foi possível carregar perfil completo:", error);
            throw error;
        }
    }, []);

    /**
     * Silent Refresh com HttpOnly Cookies
     */
    const verifySession = useCallback(async (): Promise<void> => {
        try {
            const response = await authAPI.refreshToken();
            const { data } = response.data;

            if (data?.access_token) {
                // Configura token no header
                api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
                
                // Tenta buscar perfil completo
                let userData: User = data.user;
                try {
                    if (data.user?.id) {
                        userData = await fetchFullUserProfile(data.user.id);
                    }
                } catch {
                    // Mantém dados parciais se falhar
                }

                setAuthState({
                    user: applyCacheBusting(userData),
                    token: data.access_token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            }
        } catch (error) {
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            delete api.defaults.headers.common['Authorization'];
        }
    }, [applyCacheBusting, fetchFullUserProfile]);

    useEffect(() => {
        verifySession();
    }, [verifySession]);

    /**
     * Login com token e dados do usuário
     * Adaptado para a interface AuthContextType existente
     */
    const login = useCallback(async (accessToken: string, userData: User): Promise<void> => {
        try {
            // Configura token no header
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            // Busca perfil completo
            let fullUserData = userData;
            try {
                if (userData?.id) {
                    fullUserData = await fetchFullUserProfile(userData.id);
                }
            } catch {
                // Mantém dados originais se falhar
            }

            setAuthState({
                user: applyCacheBusting(fullUserData),
                token: accessToken,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error('Erro ao processar login:', error);
            throw error;
        }
    }, [applyCacheBusting, fetchFullUserProfile]);

    /**
     * Login com email/senha (mantido para compatibilidade)
     */
    const loginWithCredentials = async (email: string, password: string): Promise<{ success: boolean; error?: string; data?: any }> => {
        try {
            const response = await authAPI.login(email, password);
            const { data } = response.data;

            if (data?.access_token && data?.user) {
                await login(data.access_token, data.user);
                return { success: true, data };
            }
            
            return { success: false, error: 'Resposta inválida do servidor' };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Erro ao fazer login' 
            };
        }
    };

    /**
     * Registro de novo usuário
     */
    const register = async (userData: Partial<User>): Promise<{ success: boolean; error?: string; data?: any }> => {
        try {
            const response = await usersAPI.create(userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Erro ao criar conta' 
            };
        }
    };

    /**
     * Logout
     */
    const logout = useCallback(async (): Promise<void> => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            delete api.defaults.headers.common['Authorization'];
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            navigate('/login');
        }
    }, [navigate]);

    /**
     * Atualização parcial do usuário (implementa a interface AuthContextType)
     */
    const updateUser = useCallback((data: Partial<User>): void => {
        setAuthState(prev => ({
            ...prev,
            user: prev.user ? applyCacheBusting({ ...prev.user, ...data }) : null
        }));
    }, [applyCacheBusting]);

    /**
     * Atualização de perfil com persistência no backend
     */
    const updateUserProfile = async (partialData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
        if (!authState.user?.id) {
            return { success: false, error: 'Usuário não autenticado' };
        }
        
        try {
            await usersAPI.update(authState.user.id, partialData);
            updateUser(partialData); // Reusa a função updateUser
            return { success: true };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Erro ao atualizar perfil' 
            };
        }
    };

    /**
     * Upload de foto do usuário
     */
    const updateUserPhoto = async (file: File): Promise<{ success: boolean; error?: string }> => {
        if (!authState.user?.id) {
            return { success: false, error: 'Usuário não autenticado' };
        }

        try {
            const response = await usersAPI.uploadAvatar(authState.user.id, file);
            const updatedUser = response.data.data || response.data;
            
            if (updatedUser) {
                updateUser(updatedUser); // Reusa a função updateUser
            }
            
            return { success: true };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Falha ao enviar imagem' 
            };
        }
    };

    // Valor do contexto combinando estado e métodos
    const contextValue: AuthContextType = {
        // Estado
        user: authState.user,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        
        // Métodos da interface
        login,
        logout,
        updateUser,
        
        // Métodos extras (não na interface, mas expostos)
        register,
        loginWithCredentials,
        updateUserProfile,
        updateUserPhoto,
        verifySession,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para usar o contexto de autenticação
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};