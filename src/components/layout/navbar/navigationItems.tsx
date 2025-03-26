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
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Vendas",
    items: [
      {
        title: "Dashboard de Vendas",
        href: "/sales-dashboard",
        icon: Gauge,
      },
      {
        title: "Nova Venda",
        href: "/sales/new",
        icon: ShoppingBag,
      },
      {
        title: "Lista de Vendas",
        href: "/sales",
        icon: ListChecks,
      },
    ],
  },
  {
    title: "Produtos",
    items: [
      {
        title: "Lista de Produtos",
        href: "/products",
        icon: Package,
      },
    ],
  },
  {
    title: "Clientes",
    items: [
      {
        title: "Lista de Clientes",
        href: "/customers",
        icon: Users,
      },
      {
        title: "Novo Cliente",
        href: "/customers/new",
        icon: User,
      },
    ],
  },
  {
    title: "Financeiro",
    items: [
      {
        title: "Contas a Pagar",
        href: "/financial/bills-to-pay",
        icon: CreditCard,
      },
      {
        title: "Contas a Receber",
        href: "/financial/bills-to-receive",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Loja",
    items: [
      {
        title: "Informações da Loja",
        href: "/store",
        icon: Building2,
      },
    ],
  },
  {
    title: "Agendamentos",
    items: [
      {
        title: "Lista de Agendamentos",
        href: "/schedules",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Relatórios",
    items: [
      {
        title: "Relatórios de Vendas",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Configurações",
    items: [
      {
        title: "Configurações da Loja",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
