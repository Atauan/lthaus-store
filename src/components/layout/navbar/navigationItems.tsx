
import {
  BarChart3,
  Building2,
  Calendar,
  CreditCard,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Package,
  Settings,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Painel",
    icon: LayoutDashboard,
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        label: "Dashboard",
      },
    ],
  },
  {
    title: "Vendas",
    icon: ShoppingBag,
    items: [
      {
        title: "Dashboard de Vendas",
        href: "/analytics",
        icon: Gauge,
        path: "/analytics",
        label: "Dashboard de Vendas",
      },
      {
        title: "Nova Venda",
        href: "/sales/new",
        icon: ShoppingBag,
        path: "/sales/new",
        label: "Nova Venda",
      },
      {
        title: "Lista de Vendas",
        href: "/sales",
        icon: ListChecks,
        path: "/sales",
        label: "Lista de Vendas",
      },
    ],
  },
  {
    title: "Produtos",
    icon: Package,
    items: [
      {
        title: "Lista de Produtos",
        href: "/products",
        icon: Package,
        path: "/products",
        label: "Lista de Produtos",
      },
    ],
  },
  {
    title: "Clientes",
    icon: Users,
    items: [
      {
        title: "Lista de Clientes",
        href: "/customers",
        icon: Users,
        path: "/customers",
        label: "Lista de Clientes",
      },
      {
        title: "Novo Cliente",
        href: "/customers/new",
        icon: User,
        path: "/customers/new",
        label: "Novo Cliente",
      },
    ],
  },
  {
    title: "Financeiro",
    icon: CreditCard,
    items: [
      {
        title: "Contas a Pagar",
        href: "/financial/bills-to-pay",
        icon: CreditCard,
        path: "/financial/bills-to-pay",
        label: "Contas a Pagar",
      },
      {
        title: "Contas a Receber",
        href: "/financial/bills-to-receive",
        icon: CreditCard,
        path: "/financial/bills-to-receive",
        label: "Contas a Receber",
      },
    ],
  },
  {
    title: "Loja",
    icon: Building2,
    items: [
      {
        title: "Informações da Loja",
        href: "/store",
        icon: Building2,
        path: "/store",
        label: "Informações da Loja",
      },
    ],
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    items: [
      {
        title: "Lista de Agendamentos",
        href: "/schedules",
        icon: Calendar,
        path: "/schedules",
        label: "Lista de Agendamentos",
      },
    ],
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    items: [
      {
        title: "Relatórios de Vendas",
        href: "/reports",
        icon: BarChart3,
        path: "/reports",
        label: "Relatórios de Vendas",
      },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    items: [
      {
        title: "Configurações da Loja",
        href: "/settings",
        icon: Settings,
        path: "/settings",
        label: "Configurações da Loja",
      },
    ],
  },
];

// Define the type for a navigation category
export type NavigationCategory = {
  title: string;
  icon: React.ComponentType;
  items: Array<{
    title: string;
    href: string;
    icon: React.ComponentType;
    path: string;
    label: string;
  }>;
};

// Export the type for the navigation categories array
export type NavigationCategories = Array<NavigationCategory>;
