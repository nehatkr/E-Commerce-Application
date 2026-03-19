import { createSlice } from "@reduxjs/toolkit";

const getProductImage = (product) => {
  if (product?.images?.length > 0) {
    const first = product.images[0];

    if (typeof first === "string") return first;
    return first.imageUrl || first.url || "";
  }

  if (product?.image?.length > 0) {
    const first = product.image[0];

    if (typeof first === "string") return first;
    return first.imageUrl || first.url || "";
  }

  return (
    product.imageUrl ||
    product.image_url ||
    product.thumbnail ||
    product.img ||
    ""
  );
};

const getVendorId = (product) => {
  return (
    product.vendorId ??
    product.vendor_id ??
    product.vendor?.id ??
    product.product?.vendorId ??
    product.product?.vendor_id ??
    product.product?.vendor?.id ??
    null
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      console.log("ADD TO CART payload:", product);

      const existingItem = state.items.find((item) => item.id === product.id);

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
        quantity: 1,
        imageUrl: getProductImage(product),
        images: product.images || product.image || [],
        vendorId: getVendorId(product), // important
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