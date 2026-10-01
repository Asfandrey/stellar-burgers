import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { selectFeedOrders } from '../../services/selectors';
import { getFeeds } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  // Получаем заказы публичной ленты из Redux.
  const orders = useSelector(selectFeedOrders);

  // При первом открытии страницы запрашиваем ленту заказов.
  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(getFeeds());
  };

  // Пока заказы ещё не получены, показываем загрузчик.
  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
