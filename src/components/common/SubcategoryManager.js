/**
 * Componente SubcategoryManager
 * Gerenciador de subcategorias integrado ao formulário de produtos
 */

import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3, Trash2, Tag, ChevronDown, ChevronRight } from 'lucide-react';
import { useSubcategoriesByCategory, useSubcategories } from '../../hooks/useSubcategories';
import { InlineNotification } from './Toast';
import { TOAST_TYPES, CSS_CLASSES, MESSAGES } from '../../utils/constants';

// Componente individual de subcategoria
const SubcategoryItem = ({ 
  subcategory, 
  onEdit, 
  onDelete, 
  onSelect,
  isSelected = false,
  showActions = true 
}) => {
  return (
    <div 
      className={`
        flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer
        ${isSelected 
          ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-500' 
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
        }
      `}
      onClick={() => onSelect && onSelect(subcategory)}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
          <Tag className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">
            {subcategory.name || subcategory.nome}
          </p>
          <p className="text-xs text-gray-500">ID: {subcategory.id}</p>
        </div>
        {isSelected && (
          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex items-center gap-1 ml-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subcategory);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
            title="Editar subcategoria"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subcategory);
            }}
            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
            title="Excluir subcategoria"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

// Modal para criar/editar subcategoria
const SubcategoryModal = ({ 
  isOpen, 
  onClose, 
  subcategory = null, 
  categoryId,
  categoryName,
  onSave, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: subcategory?.name || subcategory?.nome || '',
    categoryId: categoryId
  });
  const [error, setError] = useState('');

  const isEditing = !!subcategory;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (subcategory) {
        setFormData({
          name: subcategory.name || subcategory.nome || '',
          categoryId: subcategory.categoryId || subcategory.categoria_id || categoryId
        });
      } else {
        setFormData({ 
          name: '', 
          categoryId: categoryId 
        });
      }
      setError('');
    }
  }, [isOpen, subcategory, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.name.trim()) {
      setError(MESSAGES.SUBCATEGORY.NAME_REQUIRED);
      return;
    }
    if (!formData.categoryId) {
      setError(MESSAGES.SUBCATEGORY.CATEGORY_REQUIRED);
      return;
    }

    const subcategoryData = {
      ...formData,
      name: formData.name.trim(),
      ...(isEditing && { id: subcategory.id })
    };

    try {
      await onSave(subcategoryData);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar subcategoria');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Editar Subcategoria' : 'Nova Subcategoria'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <InlineNotification
            message={error}
            type={TOAST_TYPES.ERROR}
            showIcon={true}
            showClose={true}
            onClose={() => setError('')}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria Pai
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900">{categoryName}</p>
              <p className="text-xs text-gray-500">ID: {categoryId}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Subcategoria
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={CSS_CLASSES.INPUT.DEFAULT}
              placeholder="Ex: Eletrônicos Portáteis, Roupas Femininas..."
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={CSS_CLASSES.BUTTON.SECONDARY}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className={`${CSS_CLASSES.BUTTON.PRIMARY} flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {isEditing ? 'Atualizar' : 'Criar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de confirmação de exclusão
const DeleteSubcategoryModal = ({ 
  isOpen, 
  subcategory, 
  onConfirm, 
  onCancel, 
  loading = false 
}) => {
  if (!isOpen || !subcategory) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Subcategoria</h3>
          <p className="text-gray-600 mb-2">
            Tem certeza que deseja excluir a subcategoria
          </p>
          <p className="font-semibold text-gray-900 mb-4">
            "{subcategory.name || subcategory.nome}"?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Esta ação não pode ser desfeita.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className={CSS_CLASSES.BUTTON.SECONDARY}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`${CSS_CLASSES.BUTTON.DANGER} flex items-center justify-center gap-2`}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal - Gerenciador de Subcategorias
const SubcategoryManager = ({ 
  categoryId, 
  categoryName,
  selectedSubcategoryId,
  onSubcategorySelect,
  showHeader = true,
  allowManagement = true,
  className = '' 
}) => {
  const { subcategories, loading, refresh } = useSubcategoriesByCategory(categoryId);
  const { createSubcategory, updateSubcategory, deleteSubcategory } = useSubcategories();
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Handlers
  const handleCreate = () => {
    setEditingSubcategory(null);
    setShowModal(true);
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setShowModal(true);
  };

  const handleDelete = (subcategory) => {
    setSubcategoryToDelete(subcategory);
    setShowDeleteModal(true);
  };

  const handleSave = async (subcategoryData) => {
    setSaving(true);
    try {
      if (editingSubcategory) {
        await updateSubcategory(subcategoryData);
      } else {
        await createSubcategory(subcategoryData);
      }
      await refresh(); // Atualizar lista local
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!subcategoryToDelete) return;
    
    setSaving(true);
    try {
      await deleteSubcategory(subcategoryToDelete.id);
      await refresh(); // Atualizar lista local
      setShowDeleteModal(false);
      setSubcategoryToDelete(null);
      
      // Se a subcategoria excluída estava selecionada, limpar seleção
      if (selectedSubcategoryId === subcategoryToDelete.id) {
        onSubcategorySelect && onSubcategorySelect(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (subcategory) => {
    if (onSubcategorySelect) {
      // Se já está selecionada, desselecionar
      if (selectedSubcategoryId === subcategory.id) {
        onSubcategorySelect(null);
      } else {
        onSubcategorySelect(subcategory.id);
      }
    }
  };

  if (!categoryId) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Selecione uma categoria primeiro</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Subcategorias ({subcategories.length})
          </button>
          
          {allowManagement && isExpanded && (
            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
              disabled={loading}
            >
              <Plus className="w-3 h-3" />
              Nova
            </button>
          )}
        </div>
      )}

      {/* Conteúdo */}
      {isExpanded && (
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : subcategories.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {subcategories.map(subcategory => (
                <SubcategoryItem
                  key={subcategory.id}
                  subcategory={subcategory}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                  isSelected={selectedSubcategoryId === subcategory.id}
                  showActions={allowManagement}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
              <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500 mb-2">
                Nenhuma subcategoria encontrada
              </p>
              {allowManagement && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Criar primeira subcategoria
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <SubcategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        subcategory={editingSubcategory}
        categoryId={categoryId}
        categoryName={categoryName}
        onSave={handleSave}
        loading={saving}
      />

      <DeleteSubcategoryModal
        isOpen={showDeleteModal}
        subcategory={subcategoryToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSubcategoryToDelete(null);
        }}
        loading={saving}
      />
    </div>
  );
};

// Componente simplificado para seleção apenas
export const SubcategorySelector = ({ 
  categoryId, 
  selectedSubcategoryId,
  onSubcategorySelect,
  placeholder = "Selecione uma subcategoria...",
  disabled = false,
  className = ''
}) => {
  const { subcategories, loading } = useSubcategoriesByCategory(categoryId);

  if (!categoryId) {
    return (
      <select 
        disabled 
        className={`${CSS_CLASSES.INPUT.DEFAULT} ${className}`}
      >
        <option>Selecione uma categoria primeiro</option>
      </select>
    );
  }

  return (
    <select
      value={selectedSubcategoryId || ''}
      onChange={(e) => onSubcategorySelect && onSubcategorySelect(e.target.value || null)}
      className={`${CSS_CLASSES.INPUT.DEFAULT} ${className}`}
      disabled={disabled || loading}
    >
      <option value="">{loading ? 'Carregando...' : placeholder}</option>
      {subcategories.map(subcategory => (
        <option key={subcategory.id} value={subcategory.id}>
          {subcategory.name || subcategory.nome}
        </option>
      ))}
    </select>
  );
};

// Componente para exibição de subcategoria selecionada
export const SubcategoryDisplay = ({ 
  subcategoryId, 
  subcategories = [],
  showEmpty = true,
  className = '' 
}) => {
  const subcategory = subcategories.find(sub => sub.id === subcategoryId);

  if (!subcategory) {
    return showEmpty ? (
      <span className={`text-sm text-gray-500 ${className}`}>
        Nenhuma subcategoria
      </span>
    ) : null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
        <Tag className="w-2 h-2 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-900">
        {subcategory.name || subcategory.nome}
      </span>
    </div>
  );
};

// Hook para usar subcategorias de forma mais conveniente
export const useSubcategoryManager = (categoryId) => {
  const { subcategories, loading, refresh } = useSubcategoriesByCategory(categoryId);
  const { createSubcategory, updateSubcategory, deleteSubcategory } = useSubcategories();
  
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  // Limpar seleção quando categoria muda
  useEffect(() => {
    setSelectedSubcategoryId(null);
  }, [categoryId]);

  const getSelectedSubcategory = () => {
    return subcategories.find(sub => sub.id === selectedSubcategoryId);
  };

  const handleCreate = async (subcategoryData) => {
    const result = await createSubcategory({
      ...subcategoryData,
      categoryId
    });
    
    if (result.success) {
      await refresh();
    }
    
    return result;
  };

  const handleUpdate = async (subcategoryData) => {
    const result = await updateSubcategory(subcategoryData);
    
    if (result.success) {
      await refresh();
    }
    
    return result;
  };

  const handleDelete = async (subcategoryId) => {
    const result = await deleteSubcategory(subcategoryId);
    
    if (result.success) {
      // Se a subcategoria excluída estava selecionada, limpar seleção
      if (selectedSubcategoryId === subcategoryId) {
        setSelectedSubcategoryId(null);
      }
      await refresh();
    }
    
    return result;
  };

  return {
    subcategories,
    loading,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
    getSelectedSubcategory,
    createSubcategory: handleCreate,
    updateSubcategory: handleUpdate,
    deleteSubcategory: handleDelete,
    refresh
  };
};

export default SubcategoryManager;