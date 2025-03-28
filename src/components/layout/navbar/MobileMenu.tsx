
import React, { ReactNode } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('md:hidden', className)}
          aria-label="Open main menu"
        >
          <Menu />
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
  );
};

export default MobileMenu;
