
import { 
  BarChart, Home, ShoppingCart, Package, Users, Settings, 
  LineChart, TrendingUp, LayoutDashboard, Clipboard
} from 'lucide-react';

export const navigationItems = [
  {
    label: "Principal",
    items: [
      {
        label: "Dashboard",
        path: "/",
        icon: Home
      },
      {
        label: "Vendas",
        path: "/sales",
        icon: ShoppingCart
      },
      {
        label: "Produtos",
        path: "/products",
        icon: Package
      },
      {
        label: "Clientes",
        path: "/customers",
        icon: Users
      }
    ]
  },
  {
    label: "Análises",
    items: [
      {
        label: "Relatórios",
        path: "/reports",
        icon: BarChart
      },
      {
        label: "Estoque",
        path: "/inventory",
        icon: Clipboard
      },
      {
        label: "Financeiro",
        path: "/financial",
        icon: TrendingUp
      }
    ]
  },
  {
    label: "Sistema",
    items: [
      {
        label: "Configurações",
        path: "/settings",
        icon: Settings
      }
    ]
  }
];
