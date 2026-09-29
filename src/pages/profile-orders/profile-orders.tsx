import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { getProfileOrders } from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  // Получаем историю заказов текущего пользователя из Redux.
  const orders = useSelector((state) => state.profileOrders.orders);

  // Запрашиваем историю заказов пользователя у сервера.
  useEffect(() => {
    void dispatch(getProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
