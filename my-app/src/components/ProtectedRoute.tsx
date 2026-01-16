import { type FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;      // Требуется ли просто авторизация
  requireModerator?: boolean; // Требуется ли модератор
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,       // По умолчанию требуется авторизация
  requireModerator = false  // По умолчанию модератор не требуется
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  // Если требуется авторизация и пользователь не авторизован
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/403" replace />;
  }

  // Если требуется модератор, но пользователь не модератор
  if (requireModerator && (!user || !user.is_moderator)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};