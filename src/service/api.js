import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Configuração da Instância Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🚨 OBRIGATÓRIO: Permite o envio/recebimento de Cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Variáveis de controle para o Refresh Token
let isRefreshing = false;
let failedQueue = [];

// Função para processar a fila de requisições pausadas enquanto o token renova
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

// 2. Interceptor de Requisição (Logs)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('🚀 REQUISIÇÃO:', {
        method: config.method?.toUpperCase(),
        url: config.url,
      });
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
      console.log('✅ RESPOSTA:', {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se não houver resposta (erro de rede), rejeita direto
    if (!error.response) {
      return Promise.reject(error);
    }

    // 🚨 CORREÇÃO CRÍTICA: Se o erro 401 vier do próprio Login (senha errada),
    // não tentamos fazer refresh, apenas retornamos o erro para o formulário mostrar.
    if (error.response.status === 401 && originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Se for erro 401 (Não autorizado) em outras rotas e não for uma retentativa
    if (error.response.status === 401 && !originalRequest._retry) {
      
      // Se já existe um refresh acontecendo, põe essa requisição na fila
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
        // O cookie httpOnly é enviado automaticamente aqui graças ao withCredentials: true
        const response = await api.post('/auth/refresh');
        
        // Backend retorna o novo Access Token no corpo (o Refresh Token novo vem no Cookie)
        const newAccessToken = response.data.data.access_token; 

        // Atualiza o header padrão para futuras requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Atualiza a requisição que falhou
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Processa a fila de requisições que estavam esperando
        processQueue(null, newAccessToken);

        // Refaz a requisição original
        return api(originalRequest);

      } catch (refreshError) {
        // Se o refresh falhar (token expirou mesmo ou inválido), desloga o usuário
        processQueue(refreshError, null);
        
        delete api.defaults.headers.common['Authorization'];
        
        // Redireciona para login apenas se não estiver lá
        if (window.location.pathname !== '/login') {
           window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Log de erro genérico em desenvolvimento
    if (import.meta.env.DEV) {
        console.error('❌ ERRO NA RESPOSTA:', {
            status: error.response?.status,
            message: error.response?.data,
            url: error.config?.url
        });
    }

    return Promise.reject(error);
  }
);

// 4. Definição das Funções da API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  // O refresh não precisa de corpo, o cookie vai no header
  refreshToken: () => 
    api.post('/auth/refresh'),
  
  logout: () => 
    api.post('/auth/logout'),
};

export const usersAPI = {
  create: (userData) => api.post('/users', userData),
  list: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export const testConnection = async () => {
  try {
    console.log(`🔍 Testando conexão em: ${API_BASE_URL}/health`);
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: `Backend offline: ${error.message}` };
  }
};

export default api;