import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices/ingredientsSlice';
import { userReducer } from './slices/userSlice';

//единое Redux-хранилище.
export const rootReducer = combineReducers({
  // Данные ингредиентов.
  ingredients: ingredientsReducer,
  // Данные текущего пользователя и состояние проверки авторизации.
  user: userReducer,
});
