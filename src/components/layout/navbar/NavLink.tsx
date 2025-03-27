import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface NavLinkProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  isMobile?: boolean;
}

export function NavLink({ path, icon, label, isMobile = false }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
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
