import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

interface Props {
  children: React.ReactNode;
  allowedRoles: User['role'][];
}

export function PrivateRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itau-orange"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}