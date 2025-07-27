import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import styled from 'styled-components';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('student' | 'landlord')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size="lg" />
        <p>Loading...</p>
      </LoadingContainer>
    );
  }

  if (!user) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // User doesn't have required role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: ${({ theme }) => theme.spacing.md};

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
  }
`;

export default ProtectedRoute;