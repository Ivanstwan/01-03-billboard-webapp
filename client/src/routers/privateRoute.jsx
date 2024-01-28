import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Spinner } from '@/components/ui';

const PrivateRoute = () => {
  const { auth, initAuth } = useAuth();
  const location = useLocation();

  return initAuth ? (
    auth?.email ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  ) : (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    </>
  );
};

export default PrivateRoute;
