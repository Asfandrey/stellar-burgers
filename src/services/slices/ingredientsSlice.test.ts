import { getIngredients, ingredientsReducer } from './ingredientsSlice';

describe('ingredientsSlice reducer', () => {
  test('returns initial state for unknown action', () => {
    // Передаём undefined вместо текущего состояния.
    const state = ingredientsReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('sets loading state when getIngredients is pending', () => {
    // Создаём action
    const action = getIngredients.pending('request-id');

    // Передаём undefined
    // Затем обработает getIngredients.pending.
    const state = ingredientsReducer(undefined, action);

    // Запрос начался → включается состояние загрузки.
    expect(state.isLoading).toBe(true);

    // Ингредиенты ещё не получены.
    expect(state.ingredients).toEqual([]);

    // При начале нового запроса предыдущая ошибка сбрасывается.
    expect(state.error).toBeNull();
  });

  test('saves ingredients when getIngredients is fulfilled', () => {
    // Имитируем данные, которые успешно вернул сервер.
    const ingredients = [
      {
        _id: 'ingredient-1',
        name: 'Тестовая булка',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 40,
        price: 100,
        image: 'bun.png',
        image_mobile: 'bun-mobile.png',
        image_large: 'bun-large.png',
      },
    ];

    // Создаём fulfilled action вручную.
    const action = getIngredients.fulfilled(ingredients, 'request-id');

    // Имитируем состояние во время загрузки.
    const initialState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const state = ingredientsReducer(initialState, action);

    // Запрос завершён — загрузка выключается.
    expect(state.isLoading).toBe(false);

    // Полученные ингредиенты должны сохраниться в Redux.
    expect(state.ingredients).toEqual(ingredients);

    // Ошибки нет.
    expect(state.error).toBeNull();
  });

  test('saves error when getIngredients is rejected', () => {
    // Имитируем состояние приложения во время загрузки.
    const initialState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    // Создаём ошибку, которую якобы получил асинхронный запрос.
    const error = new Error('Ошибка загрузки ингредиентов');

    // Создаём rejected action вручную.
    const action = getIngredients.rejected(error, 'request-id', undefined);

    const state = ingredientsReducer(initialState, action);

    // Запрос завершился, поэтому загрузка должна выключиться.
    expect(state.isLoading).toBe(false);

    // В state должна появиться ошибка.
    expect(state.error).toEqual(new Error('Ошибка загрузки ингредиентов'));

    // Ингредиенты при ошибке не появились.
    expect(state.ingredients).toEqual([]);
  });
});
