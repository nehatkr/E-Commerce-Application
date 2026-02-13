import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productsReducer from "./productsSlice";
import cartReducer from './cartSlice';
import vendorProductsReducer from '../redux/vendorProductsSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    vendorProducts: vendorProductsReducer,
  },
});