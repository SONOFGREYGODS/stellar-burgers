import reducer, { addIngredient, initialState } from './constructorSlice';

describe('Тестирование редьюсера addIngredient', () => {
  const mockBun = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 10,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  const mockMain = {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    price: 200,
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 20,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  it('должен добавлять булку (заменять текущую)', () => {
    const state = reducer(initialState, addIngredient(mockBun));
    expect(state.constructorItems.bun).toEqual(
      expect.objectContaining(mockBun)
    );
    expect(state.constructorItems.bun).toHaveProperty('id');
  });

  it('должен добавлять начинку в массив ингредиентов', () => {
    const state = reducer(initialState, addIngredient(mockMain));
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining(mockMain)
    );
    expect(state.constructorItems.ingredients[0]).toHaveProperty('id');
  });
});