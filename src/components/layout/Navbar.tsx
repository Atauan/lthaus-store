
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Package, 
  BarChart3, 
  ShoppingBag, 
  Truck, 
  Menu, 
  X,
  Home
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ to, icon, label, isActive, onClick }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-all duration-200",
      "hover:bg-primary/5 hover:text-primary",
      isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground/80"
    )}
    onClick={onClick}
  >
    <div className={cn(
      "w-9 h-9 flex items-center justify-center rounded-full",
      isActive ? "bg-primary text-white" : "bg-muted"
    )}>
      {icon}
    </div>
    <span>{label}</span>
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', icon: <Home size={18} />, label: 'Dashboard' },
    { path: '/products', icon: <Package size={18} />, label: 'Produtos' },
    { path: '/inventory', icon: <ShoppingBag size={18} />, label: 'Estoque' },
    { path: '/sales', icon: <BarChart3 size={18} />, label: 'Vendas' },
    { path: '/suppliers', icon: <Truck size={18} />, label: 'Fornecedores' },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Mobile menu toggle */}
      <button 
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-background shadow-soft lg:hidden" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile navigation */}
      <div className={cn(
        "fixed inset-0 z-40 glass-effect lg:hidden",
        "transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="pt-16 px-6 h-full overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Accessory Stock</h1>
            <p className="text-muted-foreground">Gestão de loja</p>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:shadow-soft z-20">
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Accessory Stock</h1>
          <p className="text-muted-foreground">Gestão de loja</p>
        </div>
        <div className="flex-1 px-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => {}}
              />
            ))}
          </nav>
        </div>
        <div className="p-4 border-t mt-auto">
          <p className="text-xs text-muted-foreground text-center">
            Accessory Stock Master v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
