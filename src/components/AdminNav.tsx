import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Box, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AdminNav() {
  const { user } = useAuth();

  const navItems = [
    {
      to: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['admin']
    },
    {
      to: '/admin/users',
      icon: Users,
      label: 'Usuários',
      roles: ['admin']
    },
    {
      to: '/admin/prototypes',
      icon: Box,
      label: 'Produtos',
      roles: ['admin', 'member']
    },
    {
      to: '/admin/pmf',
      icon: TrendingUp,
      label: 'Análise PMF',
      roles: ['admin', 'member']
    }
  ];

  const allowedItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <nav className="bg-white shadow-md px-4 py-2 mb-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        {allowedItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-2 px-4 py-2 rounded-md transition-colors
              ${isActive 
                ? 'bg-itau-orange text-white' 
                : 'text-itau-gray-600 hover:bg-itau-gray-100'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}