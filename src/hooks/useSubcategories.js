/**
 * Hook de Gerenciamento de Subcategorias
 * Lógica completa para CRUD de subcategorias
 */

import { useState, useEffect, useCallback } from 'react';
import { subcategoryService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './useToast';
import { MESSAGES } from '../utils/constants';

export const useSubcategories = () => {
  // Estados
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Hooks
  const { getToken } = useAuth();
  const toast = useToast();

  // Cache simples - só busca se não buscou nos últimos 30 segundos
  const shouldFetch = () => {
    if (!lastFetch) return true;
    const timeDiff = Date.now() - lastFetch;
    return timeDiff > 30000; // 30 segundos
  };

  // Carregar todas as subcategorias
  const fetchSubcategories = useCallback(async (force = false) => {
    if (!force && !shouldFetch()) {
      console.log('📋 Cache válido, não buscando subcategorias');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('📋 Carregando subcategorias...');
      const token = getToken();
      const data = await subcategoryService.fetchAllSubcategories(token);
      
      setSubcategories(data);
      setLastFetch(Date.now());
      console.log('✅ Subcategorias carregadas:', data.length);
      
    } catch (err) {
      console.error('❌ Erro ao carregar subcategorias:', err);
      const errorMessage = err.message || MESSAGES.SUBCATEGORY.LOAD_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getToken, toast]);

  // Carregar subcategorias por categoria
  const fetchSubcategoriesByCategory = useCallback(async (categoryId) => {
    if (!categoryId) return [];
    
    try {
      console.log('📋 Carregando subcategorias da categoria:', categoryId);
      const token = getToken();
      const data = await subcategoryService.fetchSubcategoriesByCategory(categoryId, token);
      
      console.log('✅ Subcategorias da categoria carregadas:', data.length);
      return data;
      
    } catch (err) {
      console.error('❌ Erro ao carregar subcategorias da categoria:', err);
      toast.error('Erro ao carregar subcategorias da categoria');
      return [];
    }
  }, [getToken, toast]);

  // Criar subcategoria
  const createSubcategory = useCallback(async (subcategoryData) => {
    console.log('🆕 Criando subcategoria:', subcategoryData.name);

    try {
      // Validar dados
      if (!subcategoryData.name?.trim()) {
        throw new Error(MESSAGES.SUBCATEGORY.NAME_REQUIRED);
      }
      if (!subcategoryData.categoryId) {
        throw new Error(MESSAGES.SUBCATEGORY.CATEGORY_REQUIRED);
      }

      const token = getToken();
      await subcategoryService.createSubcategory(subcategoryData, token);
      
      toast.success(MESSAGES.SUBCATEGORY.CREATE_SUCCESS);
      
      // Recarregar lista
      await fetchSubcategories(true);
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao criar subcategoria:', err);
      const errorMessage = err.message || MESSAGES.SUBCATEGORY.CREATE_ERROR;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchSubcategories]);

  // Atualizar subcategoria
  const updateSubcategory = useCallback(async (subcategoryData) => {
    console.log('✏️ Atualizando subcategoria:', subcategoryData.name);

    try {
      // Validar dados
      if (!subcategoryData.name?.trim()) {
        throw new Error(MESSAGES.SUBCATEGORY.NAME_REQUIRED);
      }
      if (!subcategoryData.categoryId) {
        throw new Error(MESSAGES.SUBCATEGORY.CATEGORY_REQUIRED);
      }

      const token = getToken();
      await subcategoryService.updateSubcategory(subcategoryData, token);
      
      toast.success(MESSAGES.SUBCATEGORY.UPDATE_SUCCESS);
      
      // Recarregar lista
      await fetchSubcategories(true);
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao atualizar subcategoria:', err);
      const errorMessage = err.message || MESSAGES.SUBCATEGORY.UPDATE_ERROR;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchSubcategories]);

  // Excluir subcategoria
  const deleteSubcategory = useCallback(async (subcategoryId) => {
    console.log('🗑️ Excluindo subcategoria:', subcategoryId);

    try {
      const token = getToken();
      await subcategoryService.deleteSubcategory(subcategoryId, token);
      
      toast.success(MESSAGES.SUBCATEGORY.DELETE_SUCCESS);
      
      // Recarregar lista
      await fetchSubcategories(true);
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao excluir subcategoria:', err);
      
      let errorMessage = MESSAGES.SUBCATEGORY.DELETE_ERROR;
      
      // Verificar se é erro de subcategoria com produtos
      if (err.code === 'S.ITDx0001') {
        errorMessage = MESSAGES.SUBCATEGORY.DELETE_WITH_PRODUCTS;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchSubcategories]);

  // Buscar subcategoria por ID
  const getSubcategoryById = useCallback((id) => {
    return subcategories.find(subcategory => subcategory.id === id);
  }, [subcategories]);

  // Buscar subcategorias por categoria
  const getSubcategoriesByCategory = useCallback((categoryId) => {
    return subcategories.filter(subcategory => 
      subcategory.categoryId === categoryId || subcategory.categoria_id === categoryId
    );
  }, [subcategories]);

  // Carregar subcategorias ao montar o componente
  useEffect(() => {
    let isMounted = true;
    
    const loadSubcategories = async () => {
      if (isMounted) {
        await fetchSubcategories();
      }
    };
    
    loadSubcategories();
    
    return () => {
      isMounted = false;
    };
  }, [fetchSubcategories]);

  return {
    // Estados
    subcategories,
    loading,
    error,
    
    // Ações
    fetchSubcategories,
    fetchSubcategoriesByCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    
    // Helpers
    getSubcategoryById,
    getSubcategoriesByCategory,
    clearError: () => setError(null),
    hasSubcategories: subcategories.length > 0,
    
    // Estados calculados
    isLoading: loading,
    hasError: !!error,
    isEmpty: !loading && subcategories.length === 0
  };
};

// Hook simplificado para apenas listar subcategorias
export const useSubcategoriesList = () => {
  const { 
    subcategories, 
    loading, 
    fetchSubcategories
  } = useSubcategories();

  return {
    subcategories,
    loading,
    refresh: fetchSubcategories
  };
};

// Hook para subcategorias de uma categoria específica
export const useSubcategoriesByCategory = (categoryId) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { getToken } = useAuth();
  const toast = useToast();

  const fetchSubcategories = useCallback(async () => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const data = await subcategoryService.fetchSubcategoriesByCategory(categoryId, token);
      setSubcategories(data);
    } catch (err) {
      console.error('❌ Erro ao carregar subcategorias:', err);
      const errorMessage = err.message || 'Erro ao carregar subcategorias';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [categoryId, getToken, toast]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  return {
    subcategories,
    loading,
    error,
    refresh: fetchSubcategories,
    isEmpty: !loading && subcategories.length === 0
  };
};