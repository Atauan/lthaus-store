
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { NavLink } from './NavLink';
import { navigationItems } from './navigationItems';
import { useLocation } from 'react-router-dom';

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
        <div className="py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {navigationItems.map((category, index) => (
            <MobileNavCategory key={index} category={category} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileNavCategoryProps {
  category: {
    title: string;
    icon?: React.ComponentType;
    path?: string;
    items: {
      path: string;
      icon: React.ComponentType;
      label: string;
    }[];
  };
}

function MobileNavCategory({ category }: MobileNavCategoryProps) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  
  const hasActiveItem = category.items.some(item => 
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );
  
  if (category.path && category.items.length === 0) {
    return (
      <NavLink
        path={category.path}
        icon={category.icon}
        label={category.title}
        isMobile={true}
      />
    );
  }
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full gap-3 px-4 py-3 transition-colors
          ${hasActiveItem ? 'text-primary font-medium' : 'text-gray-700'}
          hover:bg-gray-100
        `}
      >
        <div className="flex items-center gap-3">
          {category.icon && React.createElement(category.icon, { className: "h-5 w-5" })}
          <span className="text-base">{category.title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="ml-7 border-l pl-3 space-y-1">
          {category.items.map((item) => (
            <NavLink
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={item.label}
              isMobile={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
