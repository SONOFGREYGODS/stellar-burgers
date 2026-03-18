import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Импортируем готовую функцию запроса к серверу (проверь, что имя совпадает с тем, что в файле burger-api.ts)
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

// 1. Создаем асинхронный Thunk (курьера) для похода на сервер
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

// Типизация нашей "полки"
interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

// Начальное состояние (пустая полка)
export const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// 2. Создаем сам слайс
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {}, // Обычных экшенов пока нет
  extraReducers: (builder) => {
    builder
      // Когда запрос только отправился
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Когда запрос успешно вернулся с данными
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload; // Кладем ингредиенты на полку
      })
      // Если сервер выдал ошибку
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка получения ингредиентов';
      });
  }
});

export default ingredientsSlice.reducer;