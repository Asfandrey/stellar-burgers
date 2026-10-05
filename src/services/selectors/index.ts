import type { RootState } from '../store';

export const selectIngredients = (
  state: RootState
): RootState['ingredients']['ingredients'] => state.ingredients.ingredients;

export const selectIngredientsLoading = (
  state: RootState
): RootState['ingredients']['isLoading'] => state.ingredients.isLoading;

export const selectIngredientsError = (
  state: RootState
): RootState['ingredients']['error'] => state.ingredients.error;

export const selectUser = (state: RootState): RootState['user']['user'] =>
  state.user.user;

export const selectIsAuthChecked = (
  state: RootState
): RootState['user']['isAuthChecked'] => state.user.isAuthChecked;

export const selectUserError = (state: RootState): RootState['user']['error'] =>
  state.user.error;

export const selectConstructorItems = (
  state: RootState
): RootState['constructorItems'] => state.constructorItems;

export const selectOrderRequest = (
  state: RootState
): RootState['newOrder']['orderRequest'] => state.newOrder.orderRequest;

export const selectOrderModalData = (
  state: RootState
): RootState['newOrder']['orderModalData'] => state.newOrder.orderModalData;

export const selectOrderData = (state: RootState): RootState['order']['orderData'] =>
  state.order.orderData;

export const selectFeed = (state: RootState): RootState['feed'] => state.feed;

export const selectFeedOrders = (state: RootState): RootState['feed']['orders'] =>
  state.feed.orders;

export const selectProfileOrders = (
  state: RootState
): RootState['profileOrders']['orders'] => state.profileOrders.orders;
