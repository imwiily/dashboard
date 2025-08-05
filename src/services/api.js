/**
 * Serviços de API
 * Funções centralizadas para comunicação com a API
 */

import { config, buildApiUrl } from '../utils/config';
import { API_ERROR_CODES } from '../utils/constants';

/**
 * Classe para erros customizados da API
 */
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Função auxiliar para fazer requisições HTTP
 */
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      timeout: config.api.timeout,
      ...options,
    });

    // Se a resposta não for ok, tentar extrair erro
    if (!response.ok) {
      let errorMessage = `Erro ${response.status}`;
      let errorCode = null;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.errorCode || null;
      } catch (parseError) {
        // Se não conseguir parsear JSON, usar mensagem padrão
        errorMessage = await response.text() || errorMessage;
      }

      throw new ApiError(errorMessage, response.status, errorCode);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Erro de rede ou timeout
    throw new ApiError('Erro de conexão com o servidor', 0, 'NETWORK_ERROR');
  }
};

/**
 * Serviços de Autenticação
 */
export const authService = {
  /**
   * Fazer login
   */
  async login(credentials) {
    console.log('🔐 Fazendo login...', credentials.username);

    const response = await makeRequest(buildApiUrl(config.endpoints.login), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    
    if (!data.accessToken) {
      throw new ApiError('Token não recebido do servidor', 200, 'NO_TOKEN');
    }

    console.log('✅ Login realizado com sucesso');
    return data;
  }
};

/**
 * Serviços de Categorias
 */
export const categoryService = {
  /**
   * Buscar todas as categorias
   */
  async fetchCategories(token) {
    console.log('📋 Buscando categorias...');

    const response = await makeRequest(buildApiUrl(config.endpoints.categories.list), {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    const data = await response.json();
    
    // Normalizar resposta da API
    let categories = [];
    if (data.success && data.data && data.data.content && Array.isArray(data.data.content)) {
      categories = data.data.content;
    } else if (data.content && Array.isArray(data.content)) {
      categories = data.content;
    } else if (Array.isArray(data)) {
      categories = data;
    }

    console.log('✅ Categorias carregadas:', categories.length);
    return categories;
  },

  /**
   * Criar nova categoria
   */
  async createCategory(categoryData, imageFile, token) {
    console.log('🆕 Criando nova categoria...', categoryData.nome);

    const formData = new FormData();
    
    // Campo "dados" como Blob com Content-Type application/json
    const dadosJson = JSON.stringify(categoryData);
    const dadosBlob = new Blob([dadosJson], { type: 'application/json' });
    formData.append('dados', dadosBlob);
    formData.append('imagem', imageFile);
    
    console.log('📦 FormData preparado - dados:', dadosJson);

    const response = await makeRequest(buildApiUrl(config.endpoints.categories.create), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();
    console.log('✅ Categoria criada com sucesso!');
    return result;
  },

  /**
   * Atualizar categoria existente
   */
  async updateCategory(categoryData, imageFile, token) {
    console.log('✏️ Atualizando categoria...', categoryData.nome);

    const formData = new FormData();
    
    // Campo "dados" como Blob com Content-Type application/json
    const dadosJson = JSON.stringify(categoryData);
    const dadosBlob = new Blob([dadosJson], { type: 'application/json' });
    formData.append('dados', dadosBlob);
    
    // Adicionar imagem se fornecida
    if (imageFile) {
      formData.append('imagem', imageFile);
      console.log('🖼️ Nova imagem incluída');
    }

    console.log('📦 FormData preparado para PUT - dados:', dadosJson);

    const response = await makeRequest(buildApiUrl(config.endpoints.categories.update), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('✅ Categoria atualizada com sucesso!');
    return response.ok ? { success: true } : await response.json();
  },

  /**
   * Excluir categoria
   */
  async deleteCategory(categoryId, token) {
    console.log('🗑️ Excluindo categoria...', categoryId);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.categories.delete}/${categoryId}`),
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Categoria excluída com sucesso!');
    return response.ok;
  }
};

/**
 * Função para verificar se erro é de categoria com produtos
 */
export const isCategoryWithProductsError = (error) => {
  return error instanceof ApiError && error.code === API_ERROR_CODES.CATEGORY_WITH_PRODUCTS;
};

/**
 * Função para verificar se erro é de autenticação
 */
export const isAuthError = (error) => {
  return error instanceof ApiError && 
    (error.status === API_ERROR_CODES.UNAUTHORIZED || error.status === API_ERROR_CODES.FORBIDDEN);
};