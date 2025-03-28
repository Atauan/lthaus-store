
import React, { ReactNode } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, ShoppingCart, Plus } from "lucide-react";
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { navigationItems } from './navigationItems';

interface MobileMenuProps {
  className?: string;
}

const MobileMenu = ({ className }: MobileMenuProps) => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t lg:hidden py-2">
      <div className="flex items-center justify-around">
        <Link to="/" className="flex flex-col items-center p-2">
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link to="/sales" className="flex flex-col items-center p-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="text-xs">Vendas</span>
        </Link>
        
        <Link to="/sales/new" className="flex flex-col items-center p-2">
          <div className="bg-primary rounded-full p-2">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs">Nova Venda</span>
        </Link>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('flex flex-col items-center p-2', className)}
              aria-label="Open main menu"
            >
              <Menu className="h-5 w-5" />
              <span className="text-xs">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="grid gap-4 py-4">
              <div className="px-3 py-1">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Menu
                </h2>
                <div className="space-y-1">
                  {navigationItems.map((group, i) => (
                    <div key={i} className="py-2">
                      <h3 className="mb-2 px-4 text-sm font-medium">{group.label}</h3>
                      <div className="space-y-1">
                        {group.items.map((item, j) => (
                          <Link
                            key={j}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "group flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              isActivePath(item.path) ? "bg-accent" : "transparent"
                            )}
                          >
                            {typeof item.icon === 'function' 
                              ? React.createElement(item.icon as any, { className: "mr-2 h-4 w-4" }) 
                              : item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileMenu;
