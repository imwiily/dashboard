/**
 * Página Dashboard
 * Página principal com visão geral do sistema
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar, { useSidebar } from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatsCards from '../components/dashboard/StatsCards';
import RecentCategories from '../components/dashboard/RecentCategories';
import Toast from '../components/common/Toast';
import SystemStatus from '../components/common/SystemStatus';
import { AuthLayout } from '../components/common/ProtectedRoute';
import { DashboardPageSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../hooks/useToast';
import { useCategories } from '../hooks/useCategories';
import { ROUTES } from '../utils/constants';

const DashboardPage = () => {
  const navigate = useNavigate();
  const sidebar = useSidebar();
  const toast = useToast();
  const { loading: categoriesLoading } = useCategories();

  // Handlers
  const handleCreateCategory = () => {
    console.log('📝 Redirecionando para criação de categoria');
    navigate(ROUTES.CATEGORIES);
  };

  const handleCategoryClick = (category) => {
    console.log('👁️ Visualizando categoria:', category.nome || category.name);
    navigate(ROUTES.CATEGORIES);
  };

  // Se ainda está carregando dados iniciais
  if (categoriesLoading) {
    return (
      <AuthLayout>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

          {/* Main content loading */}
          <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
            <Header onMenuClick={sidebar.open} />
            <main className="flex-1 px-4 py-6 lg:px-8">
              <DashboardPageSkeleton />
            </main>
          </div>
        </div>
      </AuthLayout>
    );
  }

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
            onCreateClick={handleCreateCategory}
          />

          {/* Toast Container */}
          <Toast toasts={toast.toasts} onRemove={toast.removeToast} />

          {/* Content */}
          <main className="flex-1 px-4 py-6 lg:px-8">
            <div className="space-y-6">
              {/* Cards de Estatísticas */}
              <StatsCards />

              {/* Seção de Categorias Recentes */}
              <RecentCategories 
                onCategoryClick={handleCategoryClick}
                onCreateClick={handleCreateCategory}
              />

              {/* Seção de Resumo/Insights (futuro) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card de Atividade Recente */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Sistema iniciado com sucesso</span>
                      <span className="ml-auto text-xs">Agora</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Dashboard carregado</span>
                      <span className="ml-auto text-xs">Agora</span>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        As atividades aparecerão aqui conforme você usar o sistema.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card de Ações Rápidas */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleCreateCategory}
                      className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">+</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Criar Nova Categoria</p>
                        <p className="text-sm text-gray-500">Adicione uma nova categoria de produtos</p>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate(ROUTES.CATEGORIES)}
                      className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-bold">📋</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Gerenciar Categorias</p>
                        <p className="text-sm text-gray-500">Visualizar e editar categorias existentes</p>
                      </div>
                    </button>

                    <div className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg opacity-50">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm font-bold">⚙️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Configurações</p>
                        <p className="text-sm text-gray-400">Em breve - configurações do sistema</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé com informações do sistema */}
              <SystemStatus />
            </div>
          </main>
        </div>
      </div>
    </AuthLayout>
  );
};

// Componente simplificado do dashboard (para embarcamento)
export const SimpleDashboard = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`space-y-6 ${className}`}>
      <StatsCards />
      <RecentCategories 
        limit={3}
        showViewAll={false}
        onCategoryClick={() => navigate(ROUTES.CATEGORIES)}
      />
    </div>
  );
};

// Hook para lógica do dashboard
export const useDashboard = () => {
  const navigate = useNavigate();
  const { categories, loading, stats } = useCategories();

  const quickActions = [
    {
      id: 'create-category',
      title: 'Criar Categoria',
      description: 'Adicionar nova categoria',
      action: () => navigate(ROUTES.CATEGORIES),
      color: 'purple'
    },
    {
      id: 'manage-categories',
      title: 'Gerenciar',
      description: 'Ver todas as categorias',
      action: () => navigate(ROUTES.CATEGORIES),
      color: 'blue'
    }
  ];

  const systemStatus = {
    isOnline: true,
    lastUpdate: new Date(),
    categoriesCount: categories.length,
    activeCategories: stats.active || 0
  };

  return {
    categories,
    loading,
    stats,
    quickActions,
    systemStatus,
    navigate
  };
};

export default DashboardPage;