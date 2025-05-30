
import React from 'react';
import {
  Home,
  Package,
  Truck,
  Users,
  Store,
  BarChart2,
  Settings,
  ShoppingCart
} from 'lucide-react';

export const NavigationItems = [
  { path: '/', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
  { path: '/products', icon: <Package className="h-5 w-5" />, label: 'Produtos' },
  { path: '/inventory', icon: <BarChart2 className="h-5 w-5" />, label: 'Estoque' },
  { path: '/sales', icon: <ShoppingCart className="h-5 w-5" />, label: 'Vendas' },
  { path: '/sales/new', icon: <Store className="h-5 w-5" />, label: 'Nova Venda' },
  { path: '/suppliers', icon: <Truck className="h-5 w-5" />, label: 'Fornecedores' },
  { path: '/users', icon: <Users className="h-5 w-5" />, label: 'Usuários' },
  { path: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Configurações' },
];
