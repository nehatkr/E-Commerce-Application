import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ API CALL
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await axios.get(
      "https://intern-app-ecommerce-production.up.railway.app/api/product"
    );
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 Normalize backend data for frontend
        state.items = action.payload.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          shortDescription: p.description,
          price: p.originalPrice,
          discountedPrice: p.discountPrice,
          discountPercentage: p.discount,
          sizes: p.sizes ? p.sizes.split(",") : [],
          images: p.images || [],
          addToCartEnabled: p.quantity > 0,
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
