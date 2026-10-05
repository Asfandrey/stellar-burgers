import {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  constructorReducer,
} from './constructorSlice';

describe('constructorSlice reducer', () => {
  test('returns initial state for unknown action', () => {
    const state = constructorReducer(undefined, {
      type: 'UNKNOWN',
    });

    // Проверяем начальное состояние конструктора.
    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('adds bun to constructor', () => {
    // Тестовая булка.
    const bun = {
      _id: 'bun-1',
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
    };

    // Создаём action через настоящий action creator.
    const action = addIngredient(bun);

    // Передаём action в reducer.
    const state = constructorReducer(undefined, action);

    // Булка должна попасть в отдельное поле bun.
    // Проверяем все исходные данные булки.
    expect(state.bun).toMatchObject(bun);
    expect(typeof state.bun?.id).toBe('string');
    expect(state.bun?.id.length).toBeGreaterThan(0);

    // Булка не должна попасть в массив обычных ингредиентов.
    expect(state.ingredients).toEqual([]);

    // В массив обычных ингредиентов булка попасть не должна.
    expect(state.ingredients).toEqual([]);
  });

  test('adds non-bun ingredient to ingredients array', () => {
    // Создаём тестовый ингредиент типа main.
    const ingredient = {
      _id: 'ingredient-1',
      name: 'Тестовая котлета',
      type: 'main',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 40,
      price: 200,
      image: 'ingredient.png',
      image_mobile: 'ingredient-mobile.png',
      image_large: 'ingredient-large.png',
    };

    // Добавление уникального id.
    const action = addIngredient(ingredient);

    // Передаём action в reducer.
    const state = constructorReducer(undefined, action);

    // Так как это не булка, поле bun должно остаться пустым.
    expect(state.bun).toBeNull();

    // В массиве должен появиться один ингредиент.
    expect(state.ingredients).toHaveLength(1);

    // Проверяем, что свойства исходного ингредиента сохранились.
    expect(state.ingredients[0]).toMatchObject(ingredient);

    // Проверяем, что prepare() добавил уникальный строковый id.
    expect(typeof state.ingredients[0].id).toBe('string');
    expect(state.ingredients[0].id.length).toBeGreaterThan(0);
  });

  test('removes ingredient from constructor by id', () => {
    // Создаём начальное состояние с двумя ингредиентами.
    const initialState = {
      bun: null,
      ingredients: [
        {
          _id: 'ingredient-1',
          id: 'constructor-id-1',
          name: 'Первая котлета',
          type: 'main',
          proteins: 10,
          fat: 20,
          carbohydrates: 30,
          calories: 40,
          price: 200,
          image: 'ingredient-1.png',
          image_mobile: 'ingredient-1-mobile.png',
          image_large: 'ingredient-1-large.png',
        },
        {
          _id: 'ingredient-2',
          id: 'constructor-id-2',
          name: 'Вторая котлета',
          type: 'main',
          proteins: 15,
          fat: 25,
          carbohydrates: 35,
          calories: 45,
          price: 300,
          image: 'ingredient-2.png',
          image_mobile: 'ingredient-2-mobile.png',
          image_large: 'ingredient-2-large.png',
        },
      ],
    };

    // Просим удалить первый ингредиент.
    const action = removeIngredient('constructor-id-1');

    // Передаём текущее состояние и action в reducer.
    const state = constructorReducer(initialState, action);

    // В массиве должен остаться только один ингредиент.
    expect(state.ingredients).toHaveLength(1);

    // Проверяем, что остался именно второй ингредиент.
    expect(state.ingredients[0].id).toBe('constructor-id-2');

    // Дополнительно убеждаемся, что удалённого id больше нет.
    expect(
      state.ingredients.some((ingredient) => ingredient.id === 'constructor-id-1')
    ).toBe(false);
  });

  test('moves ingredient up', () => {
    // Начальное состояние:
    // ingredients[0] → Первый ингредиент
    // ingredients[1] → Второй ингредиент
    const initialState = {
      bun: null,
      ingredients: [
        {
          _id: 'ingredient-1',
          id: 'constructor-id-1',
          name: 'Первый ингредиент',
          type: 'main',
          proteins: 10,
          fat: 20,
          carbohydrates: 30,
          calories: 40,
          price: 200,
          image: 'ingredient-1.png',
          image_mobile: 'ingredient-1-mobile.png',
          image_large: 'ingredient-1-large.png',
        },
        {
          _id: 'ingredient-2',
          id: 'constructor-id-2',
          name: 'Второй ингредиент',
          type: 'main',
          proteins: 15,
          fat: 25,
          carbohydrates: 35,
          calories: 45,
          price: 300,
          image: 'ingredient-2.png',
          image_mobile: 'ingredient-2-mobile.png',
          image_large: 'ingredient-2-large.png',
        },
      ],
    };

    // Передаём индекс 1:
    // переместить второй ингредиент на одну позицию вверх.
    const action = moveIngredientUp(1);

    const state = constructorReducer(initialState, action);

    // После перемещения изменяем порядок.
    expect(state.ingredients[0].id).toBe('constructor-id-2');
    expect(state.ingredients[1].id).toBe('constructor-id-1');
  });

  test('moves ingredient down', () => {
    // Начальное состояние:
    const initialState = {
      bun: null,
      ingredients: [
        {
          _id: 'ingredient-1',
          id: 'constructor-id-1',
          name: 'Первый ингредиент',
          type: 'main',
          proteins: 10,
          fat: 20,
          carbohydrates: 30,
          calories: 40,
          price: 200,
          image: 'ingredient-1.png',
          image_mobile: 'ingredient-1-mobile.png',
          image_large: 'ingredient-1-large.png',
        },
        {
          _id: 'ingredient-2',
          id: 'constructor-id-2',
          name: 'Второй ингредиент',
          type: 'main',
          proteins: 15,
          fat: 25,
          carbohydrates: 35,
          calories: 45,
          price: 300,
          image: 'ingredient-2.png',
          image_mobile: 'ingredient-2-mobile.png',
          image_large: 'ingredient-2-large.png',
        },
      ],
    };

    const action = moveIngredientDown(0);

    const state = constructorReducer(initialState, action);

    expect(state.ingredients[0].id).toBe('constructor-id-2');
    expect(state.ingredients[1].id).toBe('constructor-id-1');
  });

  test('clears constructor', () => {
    // Создаём заполненный конструктор:
    const initialState = {
      bun: {
        _id: 'bun-1',
        id: 'bun-constructor-id',
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
      ingredients: [
        {
          _id: 'ingredient-1',
          id: 'constructor-id-1',
          name: 'Тестовая котлета',
          type: 'main',
          proteins: 10,
          fat: 20,
          carbohydrates: 30,
          calories: 40,
          price: 200,
          image: 'ingredient.png',
          image_mobile: 'ingredient-mobile.png',
          image_large: 'ingredient-large.png',
        },
      ],
    };

    // Создаём action очистки конструктора.
    const action = clearConstructor();

    // Передаём заполненное состояние в reducer.
    const state = constructorReducer(initialState, action);

    // После очистки состояние должно вернуться к пустому состоянию конструктора.
    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
