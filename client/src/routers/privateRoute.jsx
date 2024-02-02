import { useLocation, Navigate, Outlet } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';
import { Spinner } from '@/components/ui';
import { useErrorContext } from '@/context/ErrorProvider';

const PrivateRoute = () => {
  const { errors, addError, removeError } = useErrorContext();
  const { auth, initAuth } = useAuth();
  const location = useLocation();

  return initAuth ? (
    auth?.email ? (
      <Outlet />
    ) : (
      <>
        {addError({
          title: 'Not Authorized',
          text: 'Go login.',
          variant: 'red',
        })}
        <Navigate to="/login" state={{ from: location }} replace />
      </>
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
