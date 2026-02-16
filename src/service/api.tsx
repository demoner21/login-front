// src/service/api.ts
import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError 
} from 'axios';

// ============ TIPOS BASEADOS NA SUA API ============

// Resposta de login/refresh - baseado no seu JSON
export interface AuthResponseData {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Usuário - baseado no seu JSON de /users/:id
export interface User {
  id: string;        // Note: é string, não number!
  email: string;
  name: string;
  role_id: number;
  is_active: boolean;
  is_email_verified: boolean;
  last_password_update: string;
  created_at: string;
  updated_at: string;
  last_login_at: string;
  avatar_url?: string; // Pode existir após upload
  job_title?: string;
  phone?: string;
  location?: string;
  country?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  tax_id?: string;
}

// Para criação/atualização de usuário (campos opcionais)
export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  role_id?: number;
  job_title?: string;
  phone?: string;
  location?: string;
  country?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  tax_id?: string;
}

export type UserUpdateData = Partial<UserCreateData>;

// Para change password
export interface PasswordChangeData {
  current_password?: string;
  new_password: string;
  confirm_password: string;
}

// ============ CONFIGURAÇÃO DA API ============

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL não está definida no ambiente');
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ============ REFRESH TOKEN QUEUE ============

interface PendingRequest {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}

let isRefreshing: boolean = false;
let failedQueue: PendingRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom: PendingRequest) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// ============ INTERCEPTORS ============

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Você pode adicionar lógica de logging aqui se necessário
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (!error.response) {
      return Promise.reject(error);
    }

    // Não tentar refresh em erros de login
    if (error.response.status === 401 && originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Tratamento de token expirado
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Aguarda o refresh token
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err: Error) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post<ApiResponse<AuthResponseData>>('/auth/refresh');
        const newAccessToken = response.data.data.access_token;

        // Atualiza o token nos headers padrão
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Atualiza o token na requisição original
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        
        // Limpa o token dos headers
        delete api.defaults.headers.common['Authorization'];
        
        // Redireciona para login apenas se não estiver lá
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ============ API DE AUTENTICAÇÃO ============

export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<ApiResponse<AuthResponseData>>> => 
    api.post<ApiResponse<AuthResponseData>>('/auth/login', { email, password }),
  
  refreshToken: (): Promise<AxiosResponse<ApiResponse<AuthResponseData>>> => 
    api.post<ApiResponse<AuthResponseData>>('/auth/refresh'),
  
  logout: (): Promise<AxiosResponse> => 
    api.post('/auth/logout'),
};

// ============ API DE USUÁRIOS ============

export const usersAPI = {
  // Criar usuário
  create: (userData: UserCreateData): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.post<ApiResponse<User>>('/users', userData),
  
  // Listar usuários
  list: (): Promise<AxiosResponse<ApiResponse<User[]>>> => 
    api.get<ApiResponse<User[]>>('/users'),
  
  // Buscar por ID
  getById: (id: string): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.get<ApiResponse<User>>(`/users/${id}`),
  
  // Atualizar usuário
  update: (id: string, userData: UserUpdateData): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.put<ApiResponse<User>>(`/users/${id}`, userData),
  
  // Deletar usuário
  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.delete<ApiResponse<void>>(`/users/${id}`),
  
  // Alterar senha
  changePassword: (id: string, passwordData: PasswordChangeData): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.post<ApiResponse<void>>(`/users/${id}/change-password`, passwordData),
  
  // Upload de avatar
  uploadAvatar: (id: string, file: File): Promise<AxiosResponse<ApiResponse<User>>> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return api.post<ApiResponse<User>>(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// ============ UTILITÁRIOS ============

export const testConnection = async (): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { 
      success: false, 
      error: `Backend offline: ${axiosError.message}` 
    };
  }
};

export default api;