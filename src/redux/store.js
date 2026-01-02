import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import inventoryReducer from './inventorySlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    cart: cartReducer,
  },
});