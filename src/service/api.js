import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de request com mais detalhes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 ENVIANDO REQUISIÇÃO:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ ERRO NA REQUISIÇÃO:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response com mais detalhes
api.interceptors.response.use(
  (response) => {
    console.log('✅ RESPOSTA RECEBIDA:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('❌ ERRO NA RESPOSTA:', {
      status: error.response?.status,
      message: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  refreshToken: (refreshToken) => 
    api.post('/auth/refresh', { refresh_token: refreshToken }),
  
  logout: () => 
    api.post('/auth/logout'),
};

export const usersAPI = {
  create: (userData) => {
    console.log('📝 Criando usuário:', userData);
    return api.post('/users', userData);
  },
  
  list: () => 
    api.get('/users'),
  
  getById: (id) => 
    api.get(`/users/${id}`),
  
  update: (id, userData) => 
    api.put(`/users/${id}`, userData),
  
  delete: (id) => 
    api.delete(`/users/${id}`),
};

// Teste de conexão melhorado
export const testConnection = async () => {
  try {
    console.log('🔍 Testando conexão com backend...');
    const response = await api.get('/health');
    console.log('✅ Backend respondendo:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Backend não responde:', error.message);
    return { 
      success: false, 
      error: `Backend offline: ${error.message}` 
    };
  }
};

export const testUsersEndpoint = async () => {
  try {
    console.log('🔍 Testando endpoint /users...');
    const response = await api.get('/users');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Endpoint /users com problema:', error);
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
};

export default api;