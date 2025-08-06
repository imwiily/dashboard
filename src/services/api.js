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
export const makeRequest = async (url, options = {}) => {
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
 * Serviços de Produtos
 */
export const productService = {
  /**
   * Buscar todos os produtos
   */
  async fetchProducts(token) {
    console.log('📦 Buscando produtos...');

    const response = await makeRequest(buildApiUrl(config.endpoints.products.list), {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    const data = await response.json();
    
    // Normalizar resposta da API baseada na estrutura real
    let products = [];
    if (data.success && data.data && data.data.content && Array.isArray(data.data.content)) {
      products = data.data.content.map(product => ({
        id: product.id,
        nome: product.name,
        name: product.name, // Mantém ambos para compatibilidade
        slug: product.slug,
        imageUrl: product.imageURL,
        imageURL: product.imageURL,
        // Nova estrutura de categoria com ID e nome
        categoriaId: product.category?.id || null,
        categoryId: product.category?.id || null,
        categoria: product.category?.name || 'Sem categoria',
        category: product.category?.name || 'Sem categoria',
        categoriaNome: product.category?.name || 'Sem categoria',
        categoryName: product.category?.name || 'Sem categoria',
        categoryObject: product.category, // Mantém o objeto completo
        preco: product.price,
        price: product.price,
        precoDesconto: product.discountPrice > 0 ? product.discountPrice : null,
        discountPrice: product.discountPrice > 0 ? product.discountPrice : null,
        descricao: product.description,
        description: product.description,
        descricaoCompleta: product.completeDescription,
        completeDescription: product.completeDescription,
        ingredientes: product.ingredients || [],
        ingredients: product.ingredients || [],
        modoUso: product.howToUse,
        howToUse: product.howToUse,
        tags: product.tags || [],
        ativo: product.active,
        active: product.active,
        createdAt: product.createAt,
        createAt: product.createAt,
        updatedAt: product.updateAt,
        updateAt: product.updateAt
      }));
    } else if (data.content && Array.isArray(data.content)) {
      products = data.content;
    } else if (Array.isArray(data)) {
      products = data;
    }

    console.log('✅ Produtos carregados:', products.length);
    return products;
  },

  /**
   * Buscar produto por ID
   */
  async getProductById(productId, token) {
    console.log('👁️ Buscando produto por ID:', productId);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.products.getById}/${productId}`),
      {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }
    );

    const data = await response.json();
    
    // Normalizar resposta para produto único
    if (data.success && data.data) {
      const product = data.data;
      const normalized = {
        id: product.id,
        nome: product.name,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageURL,
        imageURL: product.imageURL,
        categoria: product.category,
        category: product.category,
        preco: product.price,
        price: product.price,
        precoDesconto: product.discountPrice,
        discountPrice: product.discountPrice,
        descricao: product.description,
        description: product.description,
        descricaoCompleta: product.completeDescription,
        completeDescription: product.completeDescription,
        ingredientes: product.ingredients || [],
        ingredients: product.ingredients || [],
        modoUso: product.howToUse,
        howToUse: product.howToUse,
        tags: product.tags || [],
        ativo: product.active,
        active: product.active,
        createdAt: product.createAt,
        createAt: product.createAt,
        updatedAt: product.updateAt,
        updateAt: product.updateAt
      };
      
      console.log('✅ Produto encontrado:', normalized.nome);
      return normalized;
    }
    
    return data;
  },

  /**
   * Criar novo produto
   */
  async createProduct(productData, imageFile, token) {
    console.log('🆕 Criando novo produto...', productData.nome);

    const formData = new FormData();
    
    // Mapear campos para o formato esperado pela API
    const apiData = {
      nome: productData.nome,
      preco: productData.preco,
      precoDesconto: productData.precoDesconto || null,
      descricao: productData.descricao,
      descricaoCompleta: productData.descricaoCompleta || productData.descricao,
      ingredientes: productData.ingredientes || [],
      tags: productData.tags || [],
      modoUso: productData.modoUso || '',
      ativo: productData.ativo !== false,
      categoria: productData.categoriaId
    };
    
    // Campo "dados" como Blob com Content-Type application/json
    const dadosJson = JSON.stringify(apiData);
    const dadosBlob = new Blob([dadosJson], { type: 'application/json' });
    formData.append('dados', dadosBlob);
    formData.append('imagem', imageFile);
    
    console.log('📦 FormData preparado - dados:', dadosJson);

    const response = await makeRequest(buildApiUrl(config.endpoints.products.create), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();
    console.log('✅ Produto criado com sucesso!');
    return result;
  },

  /**
   * Atualizar produto existente
   */
  async updateProduct(productData, imageFile, token) {
    console.log('✏️ Atualizando produto...', productData.nome);

    const formData = new FormData();
    
    // Mapear campos para o formato esperado pela API
    const apiData = {
      nome: productData.nome,
      preco: productData.preco,
      precoDesconto: productData.precoDesconto || null,
      descricao: productData.descricao,
      descricaoCompleta: productData.descricaoCompleta || productData.descricao,
      ingredientes: productData.ingredientes || [],
      tags: productData.tags || [],
      modoUso: productData.modoUso || '',
      ativo: productData.ativo !== false,
      categoria: productData.categoriaId
    };
    
    // Campo "dados" como Blob com Content-Type application/json
    const dadosJson = JSON.stringify(apiData);
    const dadosBlob = new Blob([dadosJson], { type: 'application/json' });
    formData.append('dados', dadosBlob);
    
    // Adicionar imagem se fornecida
    if (imageFile) {
      formData.append('imagem', imageFile);
      console.log('🖼️ Nova imagem incluída');
    }

    console.log('📦 FormData preparado para PUT - dados:', dadosJson);

    const response = await makeRequest(buildApiUrl(`${config.endpoints.products.update}/${productData.id}`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('✅ Produto atualizado com sucesso!');
    return response.ok ? { success: true } : await response.json();
  },

  /**
   * Excluir produto
   */
  async deleteProduct(productId, token) {
    console.log('🗑️ Excluindo produto...', productId);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.products.delete}/${productId}`),
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Produto excluído com sucesso!');
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

/**
 * Função para verificar se erro é de produto inválido
 */
export const isProductError = (error) => {
  return error instanceof ApiError && (
    error.code === API_ERROR_CODES.PRODUCT_INVALID_CATEGORY ||
    error.code === API_ERROR_CODES.PRODUCT_DUPLICATE_NAME
  );
};