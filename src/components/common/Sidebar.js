/**
 * Componente Sidebar
 * Menu lateral de navegação da aplicação
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  List, 
  Package,
  Settings, 
  LogOut, 
  Tag,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { config } from '../../utils/config';
import { ROUTES } from '../../utils/constants';

// Itens de navegação
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    route: ROUTES.DASHBOARD,
    description: 'Visão geral do sistema'
  },
  {
    id: 'categories',
    label: 'Categorias',
    icon: List,
    route: ROUTES.CATEGORIES,
    description: 'Gerenciar categorias'
  },
  {
    id: 'products',
    label: 'Produtos',
    icon: Package,
    route: ROUTES.PRODUCTS,
    description: 'Gerenciar produtos'
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    route: ROUTES.SETTINGS,
    description: 'Configurações do sistema',
    disabled: true,
    badge: 'Em breve'
  }
];

// Componente de item de navegação
const NavigationItem = ({ 
  item, 
  isActive, 
  onClick, 
  disabled = false 
}) => {
  const IconComponent = item.icon;
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
        ${isActive 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
      title={item.description}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium flex-1">{item.label}</span>
      
      {item.badge && (
        <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {item.badge}
        </span>
      )}
    </button>
  );
};

// Componente principal do Sidebar
const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Verificar item ativo baseado na rota atual
  const getActiveItem = () => {
    return navigationItems.find(item => location.pathname === item.route)?.id || null;
  };

  // Navegar para rota
  const handleNavigation = (route) => {
    navigate(route);
    if (onClose) {
      onClose(); // Fechar sidebar em mobile
    }
  };

  // Fazer logout
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    if (onClose) {
      onClose();
    }
  };

  const activeItem = getActiveItem();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Gestão</h1>
                <p className="text-xs text-gray-500">v{config.dashboard.version}</p>
              </div>
            </div>

            {/* Botão fechar (mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navegação Principal */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={() => handleNavigation(item.route)}
                disabled={item.disabled}
              />
            ))}

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Seção adicional futura */}
            <div className="text-xs text-gray-400 px-4 py-2 uppercase tracking-wider font-semibold">
              Estatísticas
            </div>
            
            {/* Mini estatísticas na sidebar */}
            <div className="px-4 space-y-2">
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                <List className="w-4 h-4 text-purple-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Categorias</p>
                  <p className="text-sm font-bold text-purple-600">-</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Produtos</p>
                  <p className="text-sm font-bold text-blue-600">-</p>
                </div>
              </div>
            </div>
          </nav>

          {/* Footer com Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Componente simplificado para desktop apenas
export const DesktopSidebar = ({ className = '' }) => {
  return (
    <Sidebar 
      isOpen={true} 
      onClose={() => {}} 
      className={`hidden lg:flex ${className}`} 
    />
  );
};

// Componente para mobile
export const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <div className="lg:hidden">
      <Sidebar isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

// Hook para controlar estado do sidebar
export const useSidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

export default Sidebar;