import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,

  reducers: {
    // Добавление ингредиента в конструктор.
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid(),
        },
      }),

      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        // Булку храним отдельно.
        //
        // Если булка уже была выбрана, новая просто заменит старую.
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }

        // Все остальные ингредиенты добавляем в массив.
        state.ingredients.push(action.payload);
      },
    },

    // Удаляем конкретный экземпляр ингредиента
    // по его уникальному id.
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    // Перемещаем ингредиент на одну позицию вверх.
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      // Первый элемент выше переместить невозможно.
      if (index <= 0) {
        return;
      }

      const currentIngredient = state.ingredients[index];
      const previousIngredient = state.ingredients[index - 1];

      state.ingredients[index - 1] = currentIngredient;
      state.ingredients[index] = previousIngredient;
    },

    // Перемещаем ингредиент на одну позицию вниз.
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      // Последний элемент ниже переместить невозможно.
      if (index >= state.ingredients.length - 1) {
        return;
      }

      const currentIngredient = state.ingredients[index];
      const nextIngredient = state.ingredients[index + 1];

      state.ingredients[index + 1] = currentIngredient;
      state.ingredients[index] = nextIngredient;
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredientUp, moveIngredientDown } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
