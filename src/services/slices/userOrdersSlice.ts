import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'userOrders/fetchUserOrders',
  () => getOrdersApi()
);

interface UserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export default userOrdersSlice.reducer;