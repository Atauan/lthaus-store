
import React from 'react';
import {
  Home,
  Package,
  Truck,
  Users,
  Store,
  BarChart2,
  Settings,
  ShoppingCart,
  UserPlus,
  Layers
} from 'lucide-react';

// Main navigation categories
export const NavigationCategories = [
  {
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    path: '/',
    items: []
  },
  {
    label: 'Produtos',
    icon: <Package className="h-5 w-5" />,
    items: [
      { path: '/products', icon: <Package className="h-5 w-5" />, label: 'Produtos' },
      { path: '/inventory', icon: <BarChart2 className="h-5 w-5" />, label: 'Estoque' },
    ]
  },
  {
    label: 'Vendas',
    icon: <ShoppingCart className="h-5 w-5" />,
    items: [
      { path: '/sales', icon: <ShoppingCart className="h-5 w-5" />, label: 'Vendas' },
      { path: '/sales/new', icon: <Store className="h-5 w-5" />, label: 'Nova Venda' },
    ]
  },
  {
    label: 'Usuários',
    icon: <Users className="h-5 w-5" />,
    items: [
      { path: '/customers', icon: <UserPlus className="h-5 w-5" />, label: 'Clientes' },
      { path: '/suppliers', icon: <Truck className="h-5 w-5" />, label: 'Fornecedores' },
    ]
  },
  {
    label: 'Configurações',
    icon: <Settings className="h-5 w-5" />,
    path: '/settings',
    items: []
  },
];

// Flatten the navigation categories for use in components that need a flat list
export const NavigationItems = NavigationCategories.flatMap(category => 
  category.items.length > 0 
    ? category.items 
    : [{ path: category.path, icon: category.icon, label: category.label }]
);
