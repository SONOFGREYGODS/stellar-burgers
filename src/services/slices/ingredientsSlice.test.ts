import reducer, { fetchIngredients, initialState } from './ingredientsSlice';

describe('Тестирование слайса ingredients (асинхронные экшены)', () => {
  const mockIngredients = [
    {
      _id: '1',
      name: 'Ингредиент 1',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 10,
      price: 100,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  it('должен устанавливать isLoading в true при запросе fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записывать ингредиенты и отключать isLoading при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('должен записывать ошибку и отключать isLoading при fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка сервера';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});