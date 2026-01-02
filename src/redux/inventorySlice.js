import { createSlice } from '@reduxjs/toolkit';

// Dummy Data
const initialProducts = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    quantity: 50,
    originalPrice: 39.99,
    discount: 25,
    discountedPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',
    description: 'Premium cotton t-shirt.'
  },
  {
    id: '2',
    name: 'Denim Jacket',
    category: 'Women',
    sizes: ['S', 'M'],
    quantity: 30,
    originalPrice: 99.99,
    discount: 10,
    discountedPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=500',
    description: 'Vintage style denim.'
  }
];

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    products: initialProducts,
  },
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
  },
});

export const { addProduct } = inventorySlice.actions;
export default inventorySlice.reducer;