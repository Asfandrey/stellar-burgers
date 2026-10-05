import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

// Состояние истории заказов авторизованного пользователя.
type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: unknown;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

// Получаем историю заказов текущего пользователя.
export const getProfileOrders = createAsyncThunk(
  'profileOrders/getProfileOrders',
  getOrdersApi
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Запрос начался.
      .addCase(getProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // История заказов успешно получена.
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })

      // При загрузке произошла ошибка.
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const profileOrdersReducer = profileOrdersSlice.reducer;
