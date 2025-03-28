
import {
  BarChart,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Home,
  CreditCard,
  LineChart,
  Truck,
  UserCircle
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
    label: "Configurações",
    items: [
      {
        label: "Configurações",
        path: "/settings",
        icon: Settings
      }
    ]
  }
];
