
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface NavLinkProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  isMobile?: boolean;
  onClick?: () => void; // Added onClick prop for closing sidebar on mobile
}

export function NavLink({ path, icon, label, isMobile = false, onClick }: NavLinkProps) {
  const location = useLocation();
  // Make isActive more robust for nested routes if necessary
  const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path) && path.length > 1);


  return (
    <Link
      to={path}
      onClick={onClick} // Added onClick handler
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md transition-colors
        ${isActive
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
}
