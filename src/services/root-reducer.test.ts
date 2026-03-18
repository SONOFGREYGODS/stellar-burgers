import { rootReducer } from './store';
import { initialState as ingredientsInitialState } from './slices/ingredientsSlice';
import { initialState as constructorInitialState } from './slices/constructorSlice';
import { initialState as orderInitialState } from './slices/orderSlice';
import { initialState as userInitialState } from './slices/userSlice';
import { initialState as feedInitialState } from './slices/feedSlice';
import { initialState as userOrdersInitialState } from './slices/userOrdersSlice';

describe('Проверка rootReducer', () => {
  it('должен возвращать начальное состояние при инициализации', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      order: orderInitialState,
      user: userInitialState,
      feed: feedInitialState,
      userOrders: userOrdersInitialState
    });
  });
});