import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  Home,
  LogOut,
  Package,
  Search,
  Truck,
  UserCircle,
  Users,
  X,
  Menu,
  Store,
  BarChart2,
  Settings,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/products', icon: <Package className="h-5 w-5" />, label: 'Produtos' },
    { path: '/inventory', icon: <BarChart2 className="h-5 w-5" />, label: 'Estoque' },
    { path: '/sales', icon: <ShoppingCart className="h-5 w-5" />, label: 'Vendas' },
    { path: '/sales/new', icon: <Store className="h-5 w-5" />, label: 'Nova Venda' },
    { path: '/suppliers', icon: <Truck className="h-5 w-5" />, label: 'Fornecedores' },
    // { path: '/users', icon: <Users className="h-5 w-5" />, label: 'Usuários' },
    { path: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Configurações' },
  ];

  const NavLink = ({ path, icon, label, isMobile = false }: { path: string; icon: React.ReactNode; label: string; isMobile?: boolean }) => (
    <Link
      to={path}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md transition-colors
        ${isActive(path)
          ? 'bg-primary text-white'
          : 'hover:bg-gray-100 text-gray-700'
        }
        ${isMobile ? 'text-base py-3' : ''}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {/* Top Nav Bar - fixed at top */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 px-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      path={link.path}
                      icon={link.icon}
                      label={link.label}
                      isMobile={true}
                    />
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-xl hidden sm:inline">
                Lthaus Imports
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </form>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(user.firstName || user.email || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 text-red-600"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="flex items-center gap-2"
              >
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Side Nav - fixed at left */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 border-r bg-white p-4 hidden lg:block">
        <div className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              path={link.path}
              icon={link.icon}
              label={link.label}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
