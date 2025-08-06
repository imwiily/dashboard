/**
 * Página de Produtos
 * Página completa de gerenciamento de produtos
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Package, 
  Activity, 
  Upload,
  X,
  Check,
  AlertTriangle,
  Eye,
  Tag,
  DollarSign
} from 'lucide-react';
import Sidebar, { useSidebar } from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { AuthLayout } from '../components/common/ProtectedRoute';
import { CategoryListSkeleton, LoadingWithText } from '../components/common/LoadingSkeleton';
import { InlineNotification } from '../components/common/Toast';
import { useProducts } from '../hooks/useProducts';
import { getImageUrl } from '../utils/config';
import { 
  STATUS_FILTERS, 
  TOAST_TYPES, 
  CSS_CLASSES, 
  MESSAGES 
} from '../utils/constants';
import { 
  validateImageFile, 
  createImagePreview,
  formatCurrency
} from '../utils/helpers';

// Componente de filtros
const ProductFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  onRefresh,
  loading 
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[150px]"
        >
          <option value={STATUS_FILTERS.ALL}>Todos</option>
          <option value={STATUS_FILTERS.ACTIVE}>Apenas Ativos</option>
          <option value={STATUS_FILTERS.INACTIVE}>Apenas Inativos</option>
        </select>
      </div>

      <div className="relative">
        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[180px]"
        >
          <option value="all">Todas as Categorias</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.nome || category.name}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white border border-purple-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <Activity className="w-4 h-4" />
        <span className="hidden sm:inline">Atualizar</span>
      </button>
    </div>
  </div>
);

// Componente de linha da tabela
const ProductTableRow = ({ product, onEdit, onDelete }) => {
  const productName = product?.nome || product?.name || 'Sem nome';
  const isActive = product?.ativo !== false;
  const price = product?.preco || product?.price || 0;
  const discountPrice = product?.precoDesconto || product?.discountPrice;
  const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < price;
  
  // Agora temos o nome da categoria diretamente
  const categoryName = product?.categoria || product?.category || product?.categoriaNome || product?.categoryName;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 text-gray-600">#{product.id}</td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            {product.imageUrl || product.imageURL ? (
              <img 
                src={getImageUrl(product.imageUrl || product.imageURL)} 
                alt={productName}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <Package 
              className="w-5 h-5 text-white" 
              style={{ display: (product.imageUrl || product.imageURL) ? 'none' : 'block' }}
            />
          </div>
          <div>
            <span className="font-medium text-gray-900">{productName}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isActive ? 'Ativo' : 'Inativo'}
              </span>
              {/* Mostrar tags se existirem */}
              {product.tags && product.tags.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  #{product.tags[0]}
                  {product.tags.length > 1 && ` +${product.tags.length - 1}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col">
          {hasDiscount ? (
            <>
              <span className="font-semibold text-green-600">
                {formatCurrency(discountPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(price)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-gray-900">
              {formatCurrency(price)}
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <div>
          {categoryName && categoryName !== 'Sem categoria' ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <Tag className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-600">{categoryName}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Categoria não encontrada</span>
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Editar produto"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Excluir produto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Modal de produto
const ProductModal = ({ 
  isOpen, 
  onClose, 
  product = null, 
  categories,
  onSave, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nome: product?.nome || product?.name || '',
    descricao: product?.descricao || product?.description || '',
    descricaoCompleta: product?.descricaoCompleta || product?.completeDescription || '',
    preco: product?.preco || product?.price || '',
    precoDesconto: product?.precoDesconto || product?.discountPrice || '',
    categoriaId: product?.categoriaId || '',
    ingredientes: product?.ingredientes || product?.ingredients || [],
    tags: product?.tags || [],
    modoUso: product?.modoUso || product?.howToUse || '',
    ativo: product?.ativo !== false
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  
  // Estados para campos dinâmicos
  const [newIngredient, setNewIngredient] = useState('');
  const [newTag, setNewTag] = useState('');

  const isEditing = !!product;

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          nome: product.nome || product.name || '',
          descricao: product.descricao || product.description || '',
          descricaoCompleta: product.descricaoCompleta || product.completeDescription || '',
          preco: product.preco || product.price || '',
          precoDesconto: product.precoDesconto || product.discountPrice || '',
          categoriaId: product.categoriaId || product.categoryId || '',
          ingredientes: product.ingredientes || product.ingredients || [],
          tags: product.tags || [],
          modoUso: product.modoUso || product.howToUse || '',
          ativo: product.ativo !== false
        });
      } else {
        setFormData({ 
          nome: '', 
          descricao: '', 
          descricaoCompleta: '',
          preco: '', 
          precoDesconto: '',
          categoriaId: '', 
          ingredientes: [],
          tags: [],
          modoUso: '',
          ativo: true 
        });
      }
      setSelectedImage(null);
      setImagePreview(null);
      setNewIngredient('');
      setNewTag('');
      setError('');
    }
  }, [isOpen, product]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSelectedImage(file);
    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setError('');
    } catch (err) {
      setError('Erro ao criar preview da imagem');
    }
  };

  // Adicionar ingrediente
  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredientes.includes(newIngredient.trim())) {
      setFormData({
        ...formData,
        ingredientes: [...formData.ingredientes, newIngredient.trim()]
      });
      setNewIngredient('');
    }
  };

  // Remover ingrediente
  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredientes: formData.ingredientes.filter((_, i) => i !== index)
    });
  };

  // Adicionar tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Remover tag
  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.nome.trim()) {
      setError(MESSAGES.PRODUCT.NAME_REQUIRED);
      return;
    }
    if (!formData.descricao.trim()) {
      setError(MESSAGES.PRODUCT.DESCRIPTION_REQUIRED);
      return;
    }
    if (!formData.categoriaId) {
      setError(MESSAGES.PRODUCT.CATEGORY_REQUIRED);
      return;
    }
    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      setError(MESSAGES.PRODUCT.PRICE_REQUIRED);
      return;
    }
    if (!isEditing && !selectedImage) {
      setError(MESSAGES.PRODUCT.IMAGE_REQUIRED);
      return;
    }

    const productData = {
      ...formData,
      preco: parseFloat(formData.preco),
      precoDesconto: formData.precoDesconto ? parseFloat(formData.precoDesconto) : null,
      categoriaId: parseInt(formData.categoriaId),
      ...(isEditing && { id: product.id })
    };

    try {
      await onSave(productData, selectedImage);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar produto');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção Básica */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className={CSS_CLASSES.INPUT.DEFAULT}
                  placeholder="Ex: Shampoo Nutritivo de Argan"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={(e) => setFormData({...formData, preco: e.target.value})}
                  className={CSS_CLASSES.INPUT.DEFAULT}
                  placeholder="99.90"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço com Desconto (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoDesconto}
                  onChange={(e) => setFormData({...formData, precoDesconto: e.target.value})}
                  className={CSS_CLASSES.INPUT.DEFAULT}
                  placeholder="79.90 (opcional)"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
                  className={CSS_CLASSES.INPUT.DEFAULT}
                  disabled={loading}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.nome || category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.ativo}
                  onChange={(e) => setFormData({...formData, ativo: e.target.value === 'true'})}
                  className={CSS_CLASSES.INPUT.DEFAULT}
                  disabled={loading}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção de Descrições */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Descrições</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Curta</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  rows={2}
                  className={`${CSS_CLASSES.INPUT.DEFAULT} resize-none`}
                  placeholder="Descrição breve do produto..."
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Completa</label>
                <textarea
                  value={formData.descricaoCompleta}
                  onChange={(e) => setFormData({...formData, descricaoCompleta: e.target.value})}
                  rows={4}
                  className={`${CSS_CLASSES.INPUT.DEFAULT} resize-none`}
                  placeholder="Descrição detalhada do produto, benefícios, características..."
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modo de Uso</label>
                <textarea
                  value={formData.modoUso}
                  onChange={(e) => setFormData({...formData, modoUso: e.target.value})}
                  rows={3}
                  className={`${CSS_CLASSES.INPUT.DEFAULT} resize-none`}
                  placeholder="Como usar o produto..."
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Seção de Ingredientes */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Ingredientes</h4>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite um ingrediente..."
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={loading}
                >
                  Adicionar
                </button>
              </div>

              {formData.ingredientes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.ingredientes.map((ingrediente, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {ingrediente}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-green-600 hover:text-green-800"
                        disabled={loading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seção de Tags */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite uma tag..."
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  Adicionar
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={loading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seção de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Produto
            </label>
            
            {isEditing && product && (product.imageUrl || product.imageURL) && !imagePreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Imagem atual:</p>
                <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg border-2 border-gray-200">
                  <img 
                    src={getImageUrl(product.imageUrl || product.imageURL)} 
                    alt={formData.nome}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="flex flex-col items-center justify-center text-gray-400" style={{display: 'none'}}>
                    <Package className="w-8 h-8 mb-1" />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {isEditing ? 'Nova imagem:' : 'Preview:'}
                    </p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    {isEditing ? 'Manter imagem atual' : 'Remover imagem'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <label className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium">
                      {isEditing ? 'Clique para alterar imagem' : 'Clique para fazer upload'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-1">
                      PNG, JPG até 10MB
                      {isEditing && <br />}
                      {isEditing && <span className="text-xs">Deixe vazio para manter a imagem atual</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>
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
              disabled={loading || !formData.nome.trim() || !formData.descricao.trim() || !formData.categoriaId || !formData.preco || (!isEditing && !selectedImage)}
              className={`${CSS_CLASSES.BUTTON.PRIMARY} flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-5 h-5" />
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
const DeleteModal = ({ isOpen, product, onConfirm, onCancel, loading = false }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Produto</h3>
          <p className="text-gray-600 mb-2">
            Tem certeza que deseja excluir o produto
          </p>
          <p className="font-semibold text-gray-900 mb-4">
            "{product.nome || product.name}"?
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

// Página principal de produtos
const ProductsPage = () => {
  const sidebar = useSidebar();
  const {
    filteredProducts,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategoryById
  } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  // Handlers
  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleSave = async (productData, imageFile) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(productData, imageFile);
      } else {
        await createProduct(productData, imageFile);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setSaving(true);
    try {
      await deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          {/* Header */}
          <Header 
            onMenuClick={sidebar.open}
            onCreateClick={handleCreate}
          />

          {/* Content */}
          <main className="flex-1 px-4 py-6 lg:px-8">
            <div className="space-y-6">
              {/* Filtros */}
              <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                onRefresh={fetchProducts}
                loading={loading}
              />

              {/* Tabela de Produtos */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">ID</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Produto</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Preço</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Categoria</th>
                        <th className="text-right py-4 px-6 font-medium text-gray-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <CategoryListSkeleton rows={5} />
                      ) : (
                        filteredProducts.map(product => (
                          <ProductTableRow
                            key={product.id}
                            product={product}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                  
                  {/* Estado vazio */}
                  {filteredProducts.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">
                        {searchTerm ? 'Nenhum produto encontrado para sua busca' : 'Nenhum produto cadastrado'}
                      </p>
                      <button 
                        onClick={handleCreate}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Criar Produto
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={editingProduct}
        categories={categories}
        onSave={handleSave}
        loading={saving}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        loading={saving}
      />
    </AuthLayout>
  );
};

export default ProductsPage;