import { expect, test } from '@playwright/test';

test.describe('add ingredients to constructor works correctly', function () {
  test.beforeEach(async ({ page }) => {
    // Мокаем получение списка ингредиентов.
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    // Мокаем запрос текущего пользователя и создание заказа.
    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/{auth/user,orders}',
      update: false,
    });

    // До открытия приложения создаём фиктивные токены авторизации.
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token; path=/';
    });

    await page.goto('/');
  });

  test('adds bun and ingredient to constructor', async ({ page }) => {
    const bunName = 'Краторная булка N-200i';
    const ingredientName = 'Биокотлета из марсианской Магнолии';

    // Находим карточку конкретной булки по её названию.
    const bunCard = page.locator('li').filter({
      hasText: bunName,
    });

    // Нажимаем «Добавить» именно внутри найденной карточки.
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    // Находим карточку конкретной начинки.
    const ingredientCard = page.locator('li').filter({
      hasText: ingredientName,
    });

    // Добавляем начинку в конструктор.
    await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

    // Проверяем верхнюю булку.
    await expect(page.getByTestId('constructor-bun-1')).toContainText(bunName);

    // Проверяем нижнюю булку.
    await expect(page.getByTestId('constructor-bun-2')).toContainText(bunName);

    // Проверяем, что начинка появилась в центральной части конструктора.
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      ingredientName
    );
  });

  test('opens ingredient modal, displays ingredient data and closes it', async ({
    page,
  }) => {
    const bunName = 'Краторная булка N-200i';

    // Находим карточку конкретной булки.
    const bunCard = page.locator('li').filter({
      hasText: bunName,
    });

    // Нажимаем по названию ингредиента — React Router открывает
    // страницу ингредиента поверх текущей страницы в модальном окне.
    await bunCard.getByText(bunName).click();

    // Находим контейнер, в котором React рендерит модальные окна.
    const modal = page.locator('#modals');

    // Проверяем, что открылось содержимое именно выбранного ингредиента.
    await expect(modal.getByRole('heading', { name: bunName })).toBeVisible();

    // Проверяем характеристики только внутри модального окна.
    await expect(modal.getByText('Калории, ккал')).toBeVisible();
    await expect(modal.getByText('420')).toBeVisible();

    await expect(modal.getByText('Белки, г')).toBeVisible();
    await expect(modal.getByText('80')).toBeVisible();

    await expect(modal.getByText('Жиры, г')).toBeVisible();
    await expect(modal.getByText('24')).toBeVisible();

    await expect(modal.getByText('Углеводы, г')).toBeVisible();
    await expect(modal.getByText('53')).toBeVisible();

    // Закрываем модальное окно через кнопку с aria-label="Закрыть".
    await modal.getByRole('button', { name: 'Закрыть' }).click();

    // После закрытия содержимое модального окна должно исчезнуть.
    await expect(modal.getByRole('heading', { name: bunName })).not.toBeVisible();
  });

  test('closes ingredient modal by clicking overlay', async ({ page }) => {
    const bunName = 'Краторная булка N-200i';

    // Находим карточку конкретной булки.
    const bunCard = page.locator('li').filter({
      hasText: bunName,
    });

    // Открываем модальное окно ингредиента.
    await bunCard.getByText(bunName).click();

    // Находим контейнер модальных окон.
    const modal = page.locator('#modals');

    // Модальное окно действительно открылось?
    await expect(modal.getByRole('heading', { name: bunName })).toBeVisible();

    // Нажимаем на overlay.
    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 },
    });

    // Проверяем, что после клика модальное окно закрылось.
    await expect(modal.getByRole('heading', { name: bunName })).not.toBeVisible();
  });

  test('creates order and clears constructor', async ({ page }) => {
    const bunName = 'Краторная булка N-200i';
    const ingredientName = 'Биокотлета из марсианской Магнолии';

    // Находим карточку булки.
    const bunCard = page.locator('li').filter({
      hasText: bunName,
    });

    // Добавляем булку в конструктор.
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    // Находим карточку начинки.
    const ingredientCard = page.locator('li').filter({
      hasText: ingredientName,
    });

    // Добавляем начинку.
    await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

    // Заполнен ли конструктор?
    await expect(page.getByTestId('constructor-bun-1')).toContainText(bunName);

    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      ingredientName
    );

    // Оформляем заказ.
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Ожидаем наш фиксированный номер заказа.
    await expect(page.getByTestId('order-number')).toHaveText('12345');

    // После успешного заказа выбранная булка должна исчезнуть из конструктора.
    await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);

    // Выбранная начинка тоже должна исчезнуть.
    await expect(
      page.getByTestId('constructor-ingredients').getByText(ingredientName)
    ).toHaveCount(0);

    // Закрываем модальное окно заказа.
    const modal = page.locator('#modals');

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    // Проверяем, что данные заказа исчезли вместе с модальным окном.
    await expect(page.getByTestId('order-number')).not.toBeVisible();
  });
});
