import { User } from './user';
import { ApiResponse } from './api'; // Assumindo que ApiResponse está em '../types/api'

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation?: string;
    job_title?: string;
    phone?: string;
    location?: string;
    country?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    tax_id?: string;
    role_id?: number;
}

export interface AuthContextType extends AuthState {
    // Autenticação
    login: (email: string, password: string) => Promise<ApiResponse<AuthResponse>>;
    register: (userData: RegisterData) => Promise<ApiResponse<User>>;
    logout: () => Promise<void>;
    verifySession: () => Promise<void>;
    
    // Gerenciamento de perfil
    updateUserProfile: (data: Partial<User>) => Promise<ApiResponse<User>>;
    updateUserPhoto: (file: File) => Promise<ApiResponse<User>>;
}

// Type guard para verificar autenticação completa
export const isFullyAuthenticated = (context: AuthContextType): context is AuthContextType & 
    { user: User; token: string; isAuthenticated: true } => {
    return context.isAuthenticated && context.user !== null && context.token !== null;
};

// Estado inicial do Auth
export const initialAuthState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
};