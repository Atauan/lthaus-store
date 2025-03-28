
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Menu, 
  User,
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function TopNav() {
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3"
        >
          <span className="font-bold">Lthaus Imports</span>
        </Link>
      </div>
      
      <div className="hidden items-center gap-2 md:gap-4 lg:flex">
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3"
        >
          <span className="font-bold">Lthaus Imports</span>
        </Link>
      </div>
      
      <div className="relative flex-1">
        <div className="hidden lg:block w-full max-w-[600px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar produtos, vendas, clientes..."
              className="w-full bg-background pl-8 md:w-2/3 lg:w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="shrink-0">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="relative rounded-full h-9 w-9 p-0 overflow-hidden"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
