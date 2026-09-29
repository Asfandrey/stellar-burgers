import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

// Состояние оформления нового заказа.
type TNewOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: unknown;
};

const initialState: TNewOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
};

// Создаём новый заказ.
export const createOrder = createAsyncThunk(
  'newOrder/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);

    return response.order;
  }
);

const newOrderSlice = createSlice({
  name: 'newOrder',

  initialState,

  reducers: {
    // Вызываем при закрытии модального окна заказа.
    clearNewOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = null;
        state.error = action.error;
      });
  },
});

export const { clearNewOrder } = newOrderSlice.actions;

export const newOrderReducer = newOrderSlice.reducer;
