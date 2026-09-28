import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

export const ProtectedRoute = (): React.JSX.Element => {
  // Получаем из Redux данные текущего пользователя.
  const user = useSelector((state) => state.user.user);

  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
