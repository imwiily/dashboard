/**
 * Funções Utilitárias
 * Helpers para operações comuns do dashboard
 */

import { UI_CONFIG } from './constants';

// Função para validar se string é vazia ou só espaços
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

// Função para formatar data/hora
export const formatDateTime = (date) => {
  if (!date) return 'Não informado';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Função para formatar apenas data
export const formatDate = (date) => {
  if (!date) return 'Não informado';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }).format(new Date(date));
};

// Função para formatar moeda
export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00';
  
  return new Intl.NumberFormat(UI_CONFIG.CURRENCY_LOCALE, {
    style: 'currency',
    currency: UI_CONFIG.CURRENCY_CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Função para formatar número
export const formatNumber = (value, decimals = 0) => {
  if (!value && value !== 0) return '0';
  
  return new Intl.NumberFormat(UI_CONFIG.CURRENCY_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

// Função para validar arquivo de imagem
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado' };
  }
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo inválido. Use JPG, PNG ou GIF' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande. Máximo 10MB' };
  }
  
  return { valid: true };
};

// Função para criar preview de imagem
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Função para debounce (evitar muitas chamadas de busca)
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Função para filtrar categorias
export const filterCategories = (categories, searchTerm, statusFilter) => {
  return categories.filter(category => {
    const categoryName = category?.nome || category?.name || '';
    const matchesSearch = categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = category?.ativo === true;
    } else if (statusFilter === 'inactive') {
      matchesStatus = category?.ativo === false;
    }
    
    return matchesSearch && matchesStatus;
  });
};

// Função para filtrar produtos
export const filterProducts = (products, searchTerm, statusFilter, categoryFilter) => {
  return products.filter(product => {
    const productName = product?.nome || product?.name || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = product?.ativo === true;
    } else if (statusFilter === 'inactive') {
      matchesStatus = product?.ativo === false;
    }
    
    let matchesCategory = true;
    if (categoryFilter !== 'all') {
      matchesCategory = product?.categoriaId === parseInt(categoryFilter);
    }
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
};

// Função para gerar ID único temporário
export const generateTempId = () => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Função para calcular estatísticas das categorias
export const calculateCategoryStats = (categories) => {
  const total = categories.length;
  const active = categories.filter(c => c.ativo === true).length;
  const inactive = total - active;
  const percentage = total > 0 ? Math.round((active / total) * 100) : 0;
  
  return {
    total,
    active,
    inactive,
    activePercentage: percentage
  };
};

// Função para calcular estatísticas dos produtos
export const calculateProductStats = (products) => {
  const total = products.length;
  const active = products.filter(p => p.ativo === true).length;
  const inactive = total - active;
  const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0;
  
  // Cálculos de valor
  const totalValue = products.reduce((sum, p) => {
    const price = p.preco || p.price || 0;
    return sum + price;
  }, 0);
  
  const averagePrice = total > 0 ? totalValue / total : 0;
  
  // Produtos por categoria
  const byCategory = products.reduce((acc, product) => {
    const categoryId = product.categoriaId;
    const existing = acc.find(item => item.categoryId === categoryId);
    
    if (existing) {
      existing.count += 1;
      existing.totalValue += (product.preco || product.price || 0);
    } else {
      acc.push({
        categoryId,
        categoryName: product.categoryName || 'Categoria Desconhecida',
        count: 1,
        totalValue: product.preco || product.price || 0
      });
    }
    
    return acc;
  }, []);
  
  // Ordenar por quantidade
  byCategory.sort((a, b) => b.count - a.count);
  
  return {
    total,
    active,
    inactive,
    activePercentage,
    totalValue,
    averagePrice,
    byCategory
  };
};

// Função para validar preço
export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return { valid: false, error: 'Preço deve ser um número válido' };
  }
  
  if (numPrice <= 0) {
    return { valid: false, error: 'Preço deve ser maior que zero' };
  }
  
  return { valid: true };
};

// Função para truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Função para obter cor baseada no status
export const getStatusColor = (isActive) => {
  return isActive 
    ? { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' }
    : { bg: 'bg-red-100', text: 'text-red-800', label: 'Inativo' };
};

// Função para converter string para slug
export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/[\s_-]+/g, '-') // Substitui espaços por hífens
    .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
};

// Função para ordenar array de objetos
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Função para agrupar array por propriedade
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Função para capitalizar primeira letra
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Função para formatar texto em title case
export const toTitleCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Função para validar email (caso precise no futuro)
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para gerar cores aleatórias (para gráficos)
export const generateColors = (count) => {
  const colors = [
    '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B',
    '#EF4444', '#EC4899', '#6366F1', '#84CC16',
    '#F97316', '#14B8A6', '#8B5A2B', '#DC2626'
  ];
  
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
};

// Função para calcular porcentagem
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Função para delay (útil para testes e animações)
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Função para copiar texto para clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Não foi possível copiar para a área de transferência' };
  }
};

// Função para download de dados como JSON
export const downloadJSON = (data, filename = 'data.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};

// Função para download de dados como CSV
export const downloadCSV = (data, filename = 'data.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => `"${value}"`).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  const csvBlob = new Blob([csvContent], { type: 'text/csv' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(csvBlob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};