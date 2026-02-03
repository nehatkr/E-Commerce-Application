import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://intern-app-ecommerce-production.up.railway.app";

export const fetchVendorProducts = createAsyncThunk(
  "products/fetchVendorProducts",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/product/vendor/${vendorId}` // ✅ correct endpoint
      );
      return res.data; // ✅ axios way
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
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
      .addCase(fetchVendorProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          quantity: p.quantity,
          price: p.originalPrice,
          discountPercentage: p.discount,
          discountedPrice: p.discountPrice,
          sizes: p.sizes ? p.sizes.split(",") : [],
          description: p.description,
          images: p.images || [],
          addToCartEnabled: p.quantity > 0,
        }));
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
