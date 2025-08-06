/**
 * Configurações Centralizadas do Dashboard
 * Versão: 2.4.08
 * Última atualização: 05/08/2025
 */

// Configurações do Dashboard
export const config = {
  api: {
    baseUrl: 'http://localhost:8080',
    version: 'v1',
    timeout: 30000,
  },
  dashboard: {
    version: '2.4.08',
    name: 'Dashboard de Gestão de Categorias',
    releaseDate: '05/08/2025',
    build: Date.now() // Timestamp do build
  },
  auth: {
    tokenKey: 'authToken',
  },
  endpoints: {
    login: '/login',
    health: '/health',
    categories: {
      list: '/categorias',
      create: '/categorias', 
      update: '/categorias',
      delete: '/categorias',
    }
  }
};

// Função para construir URL da API
export const buildApiUrl = (endpoint) => {
  return `${config.api.baseUrl}/api/${config.api.version}${endpoint}`;
};

// Função para normalizar URL de imagem
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return null;
  }
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  return `http://${imageUrl}`;
};