import { 
  Home, ShoppingBag, Users, Settings, Package, FileText, ShoppingCart, 
  BarChart2, CreditCard, TrendingUp
} from 'lucide-react';

// Define the navigation categories
export const NavigationCategories = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
      },
      {
        title: "Análise de Vendas",
        href: "/analytics",
        icon: TrendingUp,
      }
    ]
  },
  {
    title: "Operations",
    items: [
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
    ]
  },
  {
    title: "Management",
    items: [
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
