import { 
  Home, ShoppingBag, Users, Settings, Package, FileText, ShoppingCart, 
  BarChart2, CreditCard, TrendingUp
} from 'lucide-react';

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
