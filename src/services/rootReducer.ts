import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { newOrderReducer } from './slices/newOrderSlice';
import { orderReducer } from './slices/orderSlice';
import { profileOrdersReducer } from './slices/profileOrdersSlice';
import { userReducer } from './slices/userSlice';

//единое Redux-хранилище.
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorReducer,
  feed: feedReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer,
  newOrder: newOrderReducer,
  user: userReducer,
});
