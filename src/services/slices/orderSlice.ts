import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

// Состояние для работы с одним конкретным заказом.
type TOrderState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: unknown;
};

const initialState: TOrderState = {
  orderData: null,
  isLoading: false,
  error: null,
};

// Получаем конкретный заказ по его номеру.
export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    // API возвращает массив orders,
    // но нужен один конкретный заказ.
    // Поэтому берём первый элемент.
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Запрос начался.
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Заказ успешно получен.
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })

      // Запрос завершился ошибкой.
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.orderData = null;
        state.error = action.error;
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
