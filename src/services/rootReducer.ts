import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices/ingredientsSlice';

// Корневой reducer объединяет все отдельные Redux-слайсы приложения.
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
});
