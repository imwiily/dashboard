/**
 * Funções Utilitárias
 * Helpers para operações comuns do dashboard
 */

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