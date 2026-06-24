// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { authAPI, usersAPI } from '@/service/api';
import { User } from '@/types/user';
import { AuthResponse } from '@/types/user'; // Assumindo que AuthResponse está em user.ts
import { ApiResponse } from '@/types/api';
import { 
    AuthState, 
    AuthContextType, 
    RegisterData, 
    initialAuthState,
    isFullyAuthenticated 
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>(initialAuthState);
    const navigate = useNavigate();

    // Cache Busting para Avatares
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

    // Busca perfil completo do usuário
    const fetchFullUserProfile = useCallback(async (userId: number): Promise<User> => {
        const response = await usersAPI.getById(userId) as ApiResponse<User>;
        return response.data;
    }, []);

    // Verify Session com Silent Refresh
    const verifySession = useCallback(async (): Promise<void> => {
        try {
            const response = await authAPI.refreshToken() as ApiResponse<AuthResponse>;
            
            if (response.data?.access_token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
                
                let userData: User = response.data.user;
                try {
                    if (response.data.user?.id) {
                        userData = await fetchFullUserProfile(response.data.user.id);
                    }
                } catch {
                    // Mantém dados parciais se falhar
                }

                setAuthState({
                    user: applyCacheBusting(userData),
                    token: response.data.access_token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            }
        } catch (error) {
            setAuthState({ ...initialAuthState, isLoading: false });
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, [applyCacheBusting, fetchFullUserProfile]);

    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // Login com email/senha - EXATAMENTE como seu tipo define
    const login = useCallback(async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
        try {
            const response = await authAPI.login(email, password) as ApiResponse<AuthResponseData>;
            const { access_token, user } = response.data;

            // Configura token
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            // Busca perfil completo
            let fullUserData = user;
            try {
                if (user?.id) {
                    fullUserData = await fetchFullUserProfile(user.id);
                }
            } catch {
                console.warn("Login com perfil parcial");
            }

            setAuthState({
                user: applyCacheBusting(fullUserData),
                token: access_token,
                isAuthenticated: true,
                isLoading: false,
            });

            return {
                success: true,
                data: { access_token, user: fullUserData }
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Erro ao fazer login',
                data: {} as AuthResponse
            };
        }
    }, [applyCacheBusting, fetchFullUserProfile]);

    // Register com tipagem completa
    const register = useCallback(async (userData: RegisterData): Promise<ApiResponse<User>> => {
        try {
            const response = await usersAPI.create(userData) as ApiResponse<User>;
            return {
                success: true,
                data: response.data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Erro ao criar conta',
                data: {} as User
            };
        }
    }, []);

    // Logout
    const logout = useCallback(async (): Promise<void> => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            delete api.defaults.headers.common['Authorization'];
            setAuthState(initialAuthState);
            navigate('/login');
        }
    }, [navigate]);

    // Update Profile
    const updateUserProfile = useCallback(async (data: Partial<User>): Promise<ApiResponse<User>> => {
        if (!authState.user?.id) {
            return {
                success: false,
                error: 'Usuário não autenticado',
                data: {} as User
            };
        }

        try {
            await usersAPI.update(authState.user.id, data);
            
            // Atualização otimista
            const updatedUser = { ...authState.user, ...data };
            setAuthState(prev => ({
                ...prev,
                user: applyCacheBusting(updatedUser)
            }));

            return {
                success: true,
                data: updatedUser
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Erro ao atualizar perfil',
                data: {} as User
            };
        }
    }, [authState.user, applyCacheBusting]);

    // Update Photo
    const updateUserPhoto = useCallback(async (file: File): Promise<ApiResponse<User>> => {
        if (!authState.user?.id) {
            return {
                success: false,
                error: 'Usuário não autenticado',
                data: {} as User
            };
        }

        try {
            const response = await usersAPI.uploadAvatar(authState.user.id, file) as ApiResponse<User>;
            
            if (response.data) {
                setAuthState(prev => ({
                    ...prev,
                    user: applyCacheBusting(response.data)
                }));
            }

            return {
                success: true,
                data: response.data || authState.user
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || 'Falha ao enviar imagem',
                data: {} as User
            };
        }
    }, [authState.user, applyCacheBusting]);

    const contextValue: AuthContextType = {
        ...authState,
        login,
        register,
        logout,
        verifySession,
        updateUserProfile,
        updateUserPhoto,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

// Exportando o type guard para uso em componentes
export { isFullyAuthenticated };