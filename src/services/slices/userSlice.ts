import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';

const ACCESS_TOKEN_COOKIE = 'accessToken';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
      setCookie(ACCESS_TOKEN_COOKIE, response.accessToken, {
      secure: true,
      sameSite: 'Strict'
    });
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
      setCookie(ACCESS_TOKEN_COOKIE, response.accessToken, {
      secure: true,
      sameSite: 'Strict'
    });
    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async () => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      localStorage.removeItem('refreshToken');
      deleteCookie(ACCESS_TOKEN_COOKIE);
      throw error;
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  try {
    await logoutApi();
  } finally {
    localStorage.removeItem('refreshToken');
    deleteCookie(ACCESS_TOKEN_COOKIE);
  }
});

interface UserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  error: string | null;
}

const initialState: UserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export default userSlice.reducer;