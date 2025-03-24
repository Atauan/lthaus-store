import React from 'react';
import { NavLink } from './NavLink';
import { NavigationCategories } from './navigationItems';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r bg-white p-4 hidden lg:block overflow-y-auto">
      <div className="space-y-1">
        {NavigationCategories.map((category, index) => (
          <NavCategory key={index} category={category} />
        ))}
      </div>
    </aside>
  );
}

interface NavCategoryProps {
  category: {
    label: string;
    icon: React.ReactNode;
    path?: string;
    items: {
      path: string;
      icon: React.ReactNode;
      label: string;
    }[];
  };
}

function NavCategory({ category }: NavCategoryProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const location = useLocation();
  
  const hasActiveItem = category.items.some(item => 
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );
  
  if (category.path && category.items.length === 0) {
    return (
      <NavLink
        path={category.path}
        icon={category.icon}
        label={category.label}
      />
    );
  }
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full gap-3 px-3 py-2 rounded-md transition-colors
          ${hasActiveItem ? 'text-primary font-medium' : 'text-gray-700'}
          hover:bg-gray-100
        `}
      >
        <div className="flex items-center gap-3">
          {category.icon}
          <span>{category.label}</span>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
