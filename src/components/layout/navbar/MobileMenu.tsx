
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavLink } from './NavLink';
import { NavigationItems } from './navigationItems';

export function MobileMenu() {
  return (
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
          {NavigationItems.map((link) => (
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
  );
}
