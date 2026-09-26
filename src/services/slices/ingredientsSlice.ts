import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils-types';

// Описываем, какие данные об ингредиентах будут храниться в Redux.
type TIngredientsState = {
  // Массив ингредиентов, полученных с сервера.
  ingredients: TIngredient[];
  isLoading: boolean;
  error: Error | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

// Асинхронное действие для получения ингредиентов с сервера.
export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // 1. Запрос начался.
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // 2. Запрос успешно завершился.
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;

        // action.payload — результат getIngredientsApi(),
        // то есть массив TIngredient[].
        state.ingredients = action.payload;
      })

      // 3. Запрос завершился ошибкой.
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;

        // createAsyncThunk помещает информацию об ошибке
        // в action.error.
        state.error = new Error(
          action.error.message ?? 'Не удалось загрузить ингредиенты'
        );
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
