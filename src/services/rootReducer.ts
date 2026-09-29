import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './slices/constructorSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { userReducer } from './slices/userSlice';

//единое Redux-хранилище.
export const rootReducer = combineReducers({
  // Данные ингредиентов.
  ingredients: ingredientsReducer,
  constructorItems: constructorReducer,
  // Данные текущего пользователя и состояние проверки авторизации.
  user: userReducer,
});
