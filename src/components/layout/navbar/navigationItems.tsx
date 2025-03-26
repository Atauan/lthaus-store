
import { 
  Home, ShoppingBag, Users, Settings, Package, FileText, ShoppingCart, 
  BarChart2, CreditCard, TrendingUp
} from 'lucide-react';
import React from 'react';

// Define the navigation categories
export const NavigationCategories = [
  {
    label: "Main",
    icon: <Home className="h-4 w-4" />,
    items: [
      {
        path: "/dashboard",
        icon: <Home className="h-4 w-4" />,
        label: "Dashboard",
      },
      {
        path: "/analytics",
        icon: <TrendingUp className="h-4 w-4" />,
        label: "Análise de Vendas",
      }
    ]
  },
  {
    label: "Operations",
    icon: <ShoppingBag className="h-4 w-4" />,
    items: [
      {
        path: "/sales",
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Vendas",
      },
      {
        path: "/products",
        icon: <Package className="h-4 w-4" />,
        label: "Produtos",
      },
      {
        path: "/reports",
        icon: <FileText className="h-4 w-4" />,
        label: "Relatórios",
      },
    ]
  },
  {
    label: "Management",
    icon: <Settings className="h-4 w-4" />,
    items: [
      {
        path: "/users",
        icon: <Users className="h-4 w-4" />,
        label: "Usuários",
      },
      {
        path: "/settings",
        icon: <Settings className="h-4 w-4" />,
        label: "Configurações",
      },
    ]
  }
];

// Keep the original flat list for components that still use it
export const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Análise de Vendas",
    href: "/analytics",
    icon: TrendingUp,
  },
  {
    title: "Vendas",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Produtos",
    href: "/products",
    icon: Package,
  },
  {
    title: "Relatórios",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Usuários",
    href: "/users",
    icon: Users,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];
