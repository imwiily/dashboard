/**
 * Componente StatsCards
 * Cards de estatísticas para o dashboard
 */

import React from 'react';
import { Tag, Activity, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { useCategoryStats } from '../../hooks/useCategories';
import { StatsGridSkeleton } from '../common/LoadingSkeleton';

// Configurações dos cards de estatística
const statsConfig = [
  {
    id: 'total',
    title: 'Total de Categorias',
    icon: Tag,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    getValue: (stats) => stats.total,
    format: (value) => value.toString()
  },
  {
    id: 'active',
    title: 'Categorias Ativas',
    icon: Activity,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
    getValue: (stats) => stats.active,
    format: (value) => value.toString()
  },
  {
    id: 'inactive',
    title: 'Categorias Inativas',
    icon: Package,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600',
    getValue: (stats) => stats.inactive,
    format: (value) => value.toString()
  },
  {
    id: 'percentage',
    title: 'Taxa de Ativação',
    icon: TrendingUp,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-600',
    getValue: (stats) => stats.activePercentage,
    format: (value) => `${value}%`
  }
];

// Componente individual de card de estatística
const StatCard = ({ config, value, loading = false }) => {
  const IconComponent = config.icon;
  const formattedValue = config.format(value);
  const textColor = config.textColor || 'text-gray-900';

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className={`w-12 h-12 ${config.bgColor} rounded-lg animate-pulse`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{config.title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{formattedValue}</p>
        </div>
        <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

// Componente principal dos cards de estatísticas
const StatsCards = ({ className = '' }) => {
  const { stats, loading, hasData } = useCategoryStats();

  // Se não há dados e não está carregando, mostrar estado vazio
  if (!loading && !hasData) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        <div className="col-span-full bg-white rounded-xl p-8 border border-gray-200 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum Dado Disponível</h3>
          <p className="text-gray-500">Crie sua primeira categoria para ver as estatísticas aqui.</p>
        </div>
      </div>
    );
  }

  // Se está carregando, mostrar skeleton
  if (loading) {
    return (
      <div className={className}>
        <StatsGridSkeleton cards={4} />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statsConfig.map((config) => (
        <StatCard
          key={config.id}
          config={config}
          value={config.getValue(stats)}
          loading={loading}
        />
      ))}
    </div>
  );
};

// Componente simplificado para estatística única
export const SingleStatCard = ({ 
  title, 
  value, 
  icon: IconComponent = Tag, 
  bgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  textColor = 'text-gray-900',
  formatter = (val) => val.toString(),
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 border border-gray-200 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-lg animate-pulse`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{formatter(value)}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

// Componente de mini estatística (para sidebar ou outras áreas)
export const MiniStatCard = ({ 
  title, 
  value, 
  icon: IconComponent = Tag,
  color = 'purple',
  className = ''
}) => {
  const colorConfig = {
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-600' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', text: 'text-green-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-600' }
  };

  const colors = colorConfig[color] || colorConfig.purple;

  return (
    <div className={`flex items-center gap-3 p-3 ${colors.bg} rounded-lg ${className}`}>
      <div className="flex-shrink-0">
        <IconComponent className={`w-5 h-5 ${colors.icon}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-600">{title}</p>
        <p className={`text-lg font-bold ${colors.text}`}>{value}</p>
      </div>
    </div>
  );
};

// Hook para usar estatísticas customizadas
export const useStatsCards = () => {
  const { stats, loading, hasData } = useCategoryStats();

  const getStatValue = (statId) => {
    const config = statsConfig.find(c => c.id === statId);
    if (!config) return 0;
    return config.getValue(stats);
  };

  const getFormattedValue = (statId) => {
    const config = statsConfig.find(c => c.id === statId);
    if (!config) return '0';
    return config.format(config.getValue(stats));
  };

  return {
    stats,
    loading,
    hasData,
    getStatValue,
    getFormattedValue,
    totalCategories: stats.total || 0,
    activeCategories: stats.active || 0,
    inactiveCategories: stats.inactive || 0,
    activationRate: stats.activePercentage || 0
  };
};

export default StatsCards;