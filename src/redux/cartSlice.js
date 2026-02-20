import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/constants";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
addToCart: (state, action) => {
  const product = action.payload;

  const existingItem = state.items.find(
    (item) => item.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
    return;
  }

  state.items.push({
    id: product.id,
    name: product.name,
    description: product.shortDescription || product.description || "",
    price: Number(
      product.discountedPrice ??
      product.discountPrice ??
      product.originalPrice ??
      product.price ??
      0
    ),
    images: product.images || [],
    quantity: 1,
  });
},

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
