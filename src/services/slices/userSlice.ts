import { getUserApi, loginUserApi, registerUserApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { setCookie } from '../../utils/cookie';

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

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: { email: string; password: string }) => {
    // Отправляем email и пароль на сервер.
    const response = await loginUserApi(data);

    // Сохраняем его в cookie.
    setCookie('accessToken', response.accessToken);

    localStorage.setItem('refreshToken', response.refreshToken);

    // Возвращаем весь ответ.
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: { email: string; name: string; password: string }) => {
    // Отправляем данные нового пользователя на сервер.
    const response = await registerUserApi(data);

    // После успешной регистрации сервер сразу возвращает токены,
    // поэтому пользователь фактически становится авторизованным.
    setCookie('accessToken', response.accessToken);

    localStorage.setItem('refreshToken', response.refreshToken);

    // Возвращаем ответ в registerUser.fulfilled.
    return response;
  }
);

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

      // Проверка авторизации прошла успешно.
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })

      // Проверка авторизации завершилась ошибкой.
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
        // Пользователь просто не авторизован.
        state.error = null;
      })

      // Начался запрос на вход.
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Вход выполнен успешно.
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })

      // Войти не удалось.
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = new Error(action.error.message ?? 'Не удалось войти');
      })

      // Началась регистрация пользователя.
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Регистрация прошла успешно.
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;

        // После регистрации пользователь уже авторизован,
        // потому что сервер вернул accessToken и refreshToken.
        state.isAuthChecked = true;

        // Сохраняем данные зарегистрированного пользователя в Redux.
        state.user = action.payload.user;
      })

      // Регистрация завершилась ошибкой.
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;

        state.error = new Error(action.error.message ?? 'Не удалось зарегистрироваться');
      });
  },
});

export const userReducer = userSlice.reducer;
