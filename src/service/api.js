import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Configuração da Instância Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Importante: Permite cookies HttpOnly (Refresh Token)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Variáveis de controle para o Refresh Token
let isRefreshing = false;
let failedQueue = [];

// Função para processar a fila de requisições pausadas
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. Interceptor de Requisição (Logs em Dev)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data ? config.data : '');
    }
    return config;
  },
  (error) => {
    console.error('❌ ERRO NA REQUISIÇÃO:', error);
    return Promise.reject(error);
  }
);

// 3. Interceptor de Resposta (Tratamento de Erros e Refresh Token)
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Ignora 401 na rota de login (evita loop infinito se errar a senha)
    if (error.response.status === 401 && originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Lógica de Refresh Token para erro 401
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Tentando renovar token...');
        const response = await api.post('/auth/refresh');
        const newAccessToken = response.data.data.access_token;

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        delete api.defaults.headers.common['Authorization'];
        
        if (window.location.pathname !== '/login') {
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

// 4. Definição das Funções da API

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

export const usersAPI = {
  create: (userData) => api.post('/users', userData),
  list: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  
  // Atualização de Perfil (PUT)
  update: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Deleção de Conta (DELETE)
  delete: (id) => api.delete(`/users/${id}`),

  // Alteração de Senha (POST)
  changePassword: (id, passwordData) => api.post(`/users/${id}/change-password`, passwordData),

  // Upload de Avatar (POST multipart/form-data)
  // Esta função cria o FormData automaticamente para você
  uploadAvatar: (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file); // 'avatar' deve corresponder à chave que o backend espera

    return api.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Sobrescreve o JSON padrão para envio de arquivo
      },
    });
  },
};

export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: `Backend offline: ${error.message}` };
  }
};

export default api;