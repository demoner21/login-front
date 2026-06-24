// src/service/api.ts
import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError 
} from 'axios';

import { Task, CreateTaskRequest, UpdateTaskRequest, CreateTaskResult  } from '@/types/task';
import { ACL, GrantACLRequest } from '@/types/acl';


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
  login: (email: string, password: string): Promise<ApiResponse<AuthResponseData>> =>
    api.post<ApiResponse<AuthResponseData>>('/auth/login', { email, password }).then((r) => r.data),

  refreshToken: (): Promise<ApiResponse<AuthResponseData>> =>
    api.post<ApiResponse<AuthResponseData>>('/auth/refresh').then((r) => r.data),

  logout: (): Promise<AxiosResponse> =>
    api.post('/auth/logout'),
};

// ============ API DE USUÁRIOS ============

export const usersAPI = {
  // Criar usuário
  create: (userData: UserCreateData): Promise<ApiResponse<User>> =>
    api.post<ApiResponse<User>>('/users', userData).then((r) => r.data),

  // Listar usuários
  list: (): Promise<ApiResponse<User[]>> =>
    api.get<ApiResponse<User[]>>('/users').then((r) => r.data),

  // Buscar por ID
  getById: (id: string): Promise<ApiResponse<User>> =>
    api.get<ApiResponse<User>>(`/users/${id}`).then((r) => r.data),

  // Atualizar usuário
  update: (id: string, userData: UserUpdateData): Promise<ApiResponse<User>> =>
    api.put<ApiResponse<User>>(`/users/${id}`, userData).then((r) => r.data),

  // Deletar usuário
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete<ApiResponse<void>>(`/users/${id}`).then((r) => r.data),

  // Alterar senha
  changePassword: (id: string, passwordData: PasswordChangeData): Promise<ApiResponse<void>> =>
    api.post<ApiResponse<void>>(`/users/${id}/change-password`, passwordData).then((r) => r.data),

  // Upload de avatar
  uploadAvatar: (id: string, file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api
      .post<ApiResponse<User>>(`/users/${id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
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

export const tasksAPI = {
  // ⚠️ Hoje retorna só tarefas onde owner_id = usuário logado.
  // Quando o módulo de Times existir, o repository.List() do backend
  // precisa virar um UNION com "shared-with-me" (ACL) para o time
  // ver o que foi compartilhado. Ver features/tasks/repository.go::List
  list: (): Promise<ApiResponse<Task[]>> =>
    api.get<ApiResponse<Task[]>>('/tasks').then((r) => r.data),

  create: (data: CreateTaskRequest): Promise<ApiResponse<CreateTaskResult>> =>
    api.post<ApiResponse<CreateTaskResult>>('/tasks', data).then((r) => r.data),

  update: (id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> =>
    api.put<ApiResponse<Task>>(`/tasks/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete<ApiResponse<void>>(`/tasks/${id}`).then((r) => r.data),
};

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
}

export const usersSearchAPI = {
  search: (email: string): Promise<ApiResponse<UserSearchResult[]>> =>
    api.get<ApiResponse<UserSearchResult[]>>('/users/search', { params: { q: email } }).then((r) => r.data),
};

export const aclAPI = {
  grant: (req: GrantACLRequest): Promise<ApiResponse<void>> =>
    api.post<ApiResponse<void>>('/acl', req).then((r) => r.data),

  getForResource: (resourceId: string, resourceType: string): Promise<ApiResponse<ACL[]>> =>
    api.get<ApiResponse<ACL[]>>(`/acl/${resourceId}`, { params: { resource_type: resourceType } }).then((r) => r.data),

  revoke: (
    resourceId: string,
    resourceType: string,
    granteeType: string,
    granteeId?: string,
  ): Promise<ApiResponse<void>> =>
    api
      .delete<ApiResponse<void>>(`/acl/${resourceId}`, {
        params: { resource_type: resourceType, grantee_type: granteeType, grantee_id: granteeId },
      })
      .then((r) => r.data),

  sharedWithMe: (resourceType?: string): Promise<ApiResponse<any[]>> =>
    api.get<ApiResponse<any[]>>('/acl/shared-with-me', { params: { resource_type: resourceType } }).then((r) => r.data),

  sharedByMe: (resourceType?: string): Promise<ApiResponse<any[]>> =>
    api.get<ApiResponse<any[]>>('/acl/shared-by-me', { params: { resource_type: resourceType } }).then((r) => r.data),
};

export default api;