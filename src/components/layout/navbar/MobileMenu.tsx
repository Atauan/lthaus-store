import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Home, PackageOpen, Users, Settings, Menu, X, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { navigationItems } from './navigationItems';

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const navigationMappings = [
    {
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/',
      items: navigationItems[0].items.map(item => ({
        path: item.href,
        icon: <item.icon className="h-5 w-5" />,
        label: item.title
      }))
    },
    {
      label: 'Vendas',
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/sales',
      items: navigationItems[1].items.map(item => ({
        path: item.href,
        icon: <item.icon className="h-5 w-5" />,
        label: item.title
      }))
    },
    {
      label: 'Produtos',
      icon: <PackageOpen className="h-5 w-5" />,
      path: '/products',
      items: navigationItems[2].items.map(item => ({
        path: item.href,
        icon: <item.icon className="h-5 w-5" />,
        label: item.title
      }))
    },
    {
      label: 'Clientes',
      icon: <Users className="h-5 w-5" />,
      path: '/customers',
      items: []
    },
    {
      label: 'Configurações',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings',
      items: []
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-2">
            <span className="font-bold text-lg">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="py-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="mt-2">
              <p className="font-semibold">User Name</p>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>

          <Separator />

          <div className="flex-grow py-4 space-y-2">
            {navigationMappings.map((section, index) => (
              <div key={index}>
                <Button variant="ghost" className="w-full justify-start font-normal" onClick={() => navigateTo(section.path)}>
                  {section.icon}
                  <span className="ml-2">{section.label}</span>
                </Button>
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className="w-full justify-start font-normal pl-8"
                    onClick={() => navigateTo(item.path)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                ))}
              </div>
            ))}
          </div>

          <Separator />

          <div className="py-4">
            <Button variant="ghost" className="w-full justify-start font-normal">
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Sair</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
