import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectUser,
} from '../../services/selectors';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { clearNewOrder, createOrder } from '../../services/slices/newOrderSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  // Ингредиенты, которые пользователь добавил в конструктор.
  const constructorItems = useSelector(selectConstructorItems);

  // Данные авторизованного пользователя.
  const user = useSelector(selectUser);

  // Состояние оформления нового заказа.
  const orderRequest = useSelector(selectOrderRequest);

  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = (): void => {
    // Без булки заказ оформить нельзя.
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    // Оформлять заказ может только авторизованный пользователь.
    if (!user) {
      void navigate('/login', {
        state: {
          from: location,
        },
      });

      return;
    }

    // API ожидает массив ID ингредиентов.
    const ingredientIds = [
      constructorItems.bun._id,

      ...constructorItems.ingredients.map((ingredient) => ingredient._id),

      constructorItems.bun._id,
    ];

    // Отправляем заказ на сервер.
    void dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        // Очищаем конструктор.
        dispatch(clearConstructor());
      })
      .catch(() => {
        // Ошибка уже сохранена в newOrderSlice
        // через createOrder.rejected.
      });
  };

  const closeOrderModal = (): void => {
    // Удаляем данные уже оформленного заказа.
    dispatch(clearNewOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
