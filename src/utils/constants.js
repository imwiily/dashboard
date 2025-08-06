/**
 * Constantes do Sistema
 * Valores fixos utilizados em toda a aplicação
 */

// Tipos de toast/notificação
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Status de categoria/produto
export const CATEGORY_STATUS = {
  ACTIVE: true,
  INACTIVE: false
};

export const PRODUCT_STATUS = {
  ACTIVE: true,
  INACTIVE: false
};

// Filtros de status
export const STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

// Views/páginas disponíveis
export const VIEWS = {
  DASHBOARD: 'dashboard',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  SETTINGS: 'settings'
};

// Rotas da aplicação
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard', 
  CATEGORIES: '/categories',
  PRODUCTS: '/products',
  SETTINGS: '/settings',
  ROOT: '/'
};

// Mensagens padrão
export const MESSAGES = {
  LOGIN: {
    SUCCESS: 'Login realizado com sucesso!',
    ERROR: 'Credenciais inválidas',
    MISSING_FIELDS: 'Preencha todos os campos',
    CONNECTION_ERROR: 'Erro de conexão com o servidor',
    TOKEN_ERROR: 'Token não recebido do servidor'
  },
  CATEGORY: {
    CREATE_SUCCESS: 'Categoria criada com sucesso!',
    UPDATE_SUCCESS: 'Categoria atualizada com sucesso!',
    DELETE_SUCCESS: 'Categoria excluída com sucesso!',
    CREATE_ERROR: 'Erro ao criar categoria',
    UPDATE_ERROR: 'Erro ao atualizar categoria',
    DELETE_ERROR: 'Erro ao excluir categoria',
    LOAD_ERROR: 'Erro ao carregar categorias',
    DELETE_WITH_PRODUCTS: 'Não é possível excluir esta categoria porque existem produtos cadastrados nela. Remova ou transfira os produtos primeiro.',
    NAME_REQUIRED: 'Nome da categoria é obrigatório',
    DESCRIPTION_REQUIRED: 'Descrição da categoria é obrigatória',
    IMAGE_REQUIRED: 'Imagem é obrigatória para novas categorias'
  },
  PRODUCT: {
    CREATE_SUCCESS: 'Produto criado com sucesso!',
    UPDATE_SUCCESS: 'Produto atualizado com sucesso!',
    DELETE_SUCCESS: 'Produto excluído com sucesso!',
    CREATE_ERROR: 'Erro ao criar produto',
    UPDATE_ERROR: 'Erro ao atualizar produto',
    DELETE_ERROR: 'Erro ao excluir produto',
    LOAD_ERROR: 'Erro ao carregar produtos',
    NAME_REQUIRED: 'Nome do produto é obrigatório',
    DESCRIPTION_REQUIRED: 'Descrição do produto é obrigatória',
    CATEGORY_REQUIRED: 'Categoria é obrigatória',
    PRICE_REQUIRED: 'Preço é obrigatório e deve ser maior que zero',
    IMAGE_REQUIRED: 'Imagem é obrigatória para novos produtos',
    INVALID_PRICE: 'Preço deve ser um número válido maior que zero'
  },
  GENERAL: {
    LOADING: 'Carregando...',
    CONNECTION_ERROR: 'Erro de conexão',
    UNEXPECTED_ERROR: 'Erro inesperado',
    NO_DATA: 'Nenhum dado encontrado',
    CONFIRM_DELETE: 'Tem certeza que deseja excluir?',
    ACTION_IRREVERSIBLE: 'Esta ação não pode ser desfeita.'
  }
};

// Configurações de UI
export const UI_CONFIG = {
  TOAST_DURATION: 4000, // 4 segundos
  DEBOUNCE_DELAY: 300, // 300ms para busca
  SKELETON_ROWS: 3, // Linhas do skeleton loader
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  SIDEBAR_MOBILE_BREAKPOINT: 1024, // lg breakpoint do Tailwind
  CURRENCY_LOCALE: 'pt-BR',
  CURRENCY_CODE: 'BRL'
};

// Classes CSS padrão (para reutilização)
export const CSS_CLASSES = {
  BUTTON: {
    PRIMARY: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200',
    SECONDARY: 'border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors',
    DANGER: 'bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors',
    ICON: 'p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
  },
  INPUT: {
    DEFAULT: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
    ERROR: 'w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
  },
  CARD: {
    DEFAULT: 'bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow',
    STATS: 'bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow'
  },
  STATUS: {
    ACTIVE: 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800',
    INACTIVE: 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'
  }
};

// Códigos de erro da API
export const API_ERROR_CODES = {
  CATEGORY_WITH_PRODUCTS: 'C.ITDx0001',
  PRODUCT_INVALID_CATEGORY: 'P.ITDx0001',
  PRODUCT_DUPLICATE_NAME: 'P.ITDx0002',
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};