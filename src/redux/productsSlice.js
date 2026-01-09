import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // single source of truth
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },

    updateProduct: (state, action) => {
      const index = state.items.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.updates,
        };
      }
    },

    deleteProduct: (state, action) => {
      state.items = state.items.filter(
        (p) => p.id !== action.payload
      );
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
