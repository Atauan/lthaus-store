
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  Settings,
  BarChart3,
  Building,
  Inbox,
  Truck,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarNavProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed }: SidebarNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="hidden lg:flex h-full w-64 flex-col gap-4 bg-background fixed top-0 pt-16 bottom-0 overflow-y-auto z-20 left-0 border-r">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 md:px-4 gap-1">
          {/* Dashboard */}
          <Link to="/" className="no-underline">
            <Button
              variant={currentPath === "/" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
              {!isCollapsed && <span>Dashboard</span>}
            </Button>
          </Link>
          
          {/* Sales */}
          <Link to="/sales" className="no-underline">
            <Button
              variant={currentPath.startsWith("/sales") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              {!isCollapsed && <span>Vendas</span>}
            </Button>
          </Link>
          
          {/* Products */}
          <Link to="/products" className="no-underline">
            <Button
              variant={currentPath.startsWith("/products") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <Package className="h-5 w-5" />
              {!isCollapsed && <span>Produtos</span>}
            </Button>
          </Link>
          
          {/* Stock */}
          <Link to="/stock" className="no-underline">
            <Button
              variant={currentPath.startsWith("/stock") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <Inbox className="h-5 w-5" />
              {!isCollapsed && <span>Estoque</span>}
            </Button>
          </Link>
          
          {/* Suppliers */}
          <Link to="/suppliers" className="no-underline">
            <Button
              variant={currentPath.startsWith("/suppliers") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <Truck className="h-5 w-5" />
              {!isCollapsed && <span>Fornecedores</span>}
            </Button>
          </Link>
          
          {/* Customers */}
          <Link to="/customers" className="no-underline">
            <Button
              variant={currentPath.startsWith("/customers") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <Users className="h-5 w-5" />
              {!isCollapsed && <span>Clientes</span>}
            </Button>
          </Link>
          
          {/* Reports */}
          <Link to="/reports" className="no-underline">
            <Button
              variant={currentPath.startsWith("/reports") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <BarChart3 className="h-5 w-5" />
              {!isCollapsed && <span>Relatórios</span>}
            </Button>
          </Link>
          
          {/* Analytics */}
          <Link to="/analytics" className="no-underline">
            <Button
              variant={currentPath.startsWith("/analytics") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <PieChart className="h-5 w-5" />
              {!isCollapsed && <span>Análises</span>}
            </Button>
          </Link>
          
          {/* Companies */}
          <Link to="/companies" className="no-underline">
            <Button
              variant={currentPath.startsWith("/companies") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <Building className="h-5 w-5" />
              {!isCollapsed && <span>Empresas</span>}
            </Button>
          </Link>
          
          {/* Categories */}
          <Link to="/categories" className="no-underline">
            <Button
              variant={currentPath.startsWith("/categories") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <Tag className="h-5 w-5" />
              {!isCollapsed && <span>Categorias</span>}
            </Button>
          </Link>
          
          {/* Settings */}
          <Link to="/settings" className="no-underline">
            <Button
              variant={currentPath.startsWith("/settings") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <Settings className="h-5 w-5" />
              {!isCollapsed && <span>Configurações</span>}
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
