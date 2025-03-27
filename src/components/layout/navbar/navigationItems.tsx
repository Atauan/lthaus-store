
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
import React from "react";

// Define the type for a navigation item
export type NavigationItem = {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
};

// Define the type for a navigation category
export type NavigationCategory = {
  title: string;
  icon?: React.ComponentType<any>;
  path?: string;
  items: NavigationItem[];
};

// Export the type for the navigation categories array
export type NavigationCategories = Array<NavigationCategory>;

export const navigationItems: NavigationCategories = [
  {
    title: "Painel",
    icon: LayoutDashboard,
    items: [
      {
        path: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
    ],
  },
  {
    title: "Vendas",
    icon: ShoppingBag,
    items: [
      {
        path: "/analytics",
        icon: Gauge,
        label: "Dashboard de Vendas",
      },
      {
        path: "/sales/new",
        icon: ShoppingBag,
        label: "Nova Venda",
      },
      {
        path: "/sales",
        icon: ListChecks,
        label: "Lista de Vendas",
      },
    ],
  },
  {
    title: "Produtos",
    icon: Package,
    items: [
      {
        path: "/products",
        icon: Package,
        label: "Lista de Produtos",
      },
    ],
  },
  {
    title: "Clientes",
    icon: Users,
    items: [
      {
        path: "/customers",
        icon: Users,
        label: "Lista de Clientes",
      },
      {
        path: "/customers/new",
        icon: User,
        label: "Novo Cliente",
      },
    ],
  },
  {
    title: "Financeiro",
    icon: CreditCard,
    items: [
      {
        path: "/financial/bills-to-pay",
        icon: CreditCard,
        label: "Contas a Pagar",
      },
      {
        path: "/financial/bills-to-receive",
        icon: CreditCard,
        label: "Contas a Receber",
      },
    ],
  },
  {
    title: "Loja",
    icon: Building2,
    items: [
      {
        path: "/store",
        icon: Building2,
        label: "Informações da Loja",
      },
    ],
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    items: [
      {
        path: "/schedules",
        icon: Calendar,
        label: "Lista de Agendamentos",
      },
    ],
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    items: [
      {
        path: "/reports",
        icon: BarChart3,
        label: "Relatórios de Vendas",
      },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    items: [
      {
        path: "/settings",
        icon: Settings,
        label: "Configurações da Loja",
      },
    ],
  },
];
