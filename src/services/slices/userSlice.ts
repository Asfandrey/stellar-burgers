import { getUserApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TUser } from '@utils-types';

// Состояние текущего пользователя.
type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: Error | null;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
};

// Проверяем текущую авторизацию пользователя.
export const getUser = createAsyncThunk('user/getUser', getUserApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Начали проверять авторизацию.
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })

      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;

        state.isAuthChecked = true;

        // Авторизованного пользователя нет.
        state.user = null;

        state.error = new Error(
          action.error.message ?? 'Не удалось получить данные пользователя'
        );
      });
  },
});

export const userReducer = userSlice.reducer;
