import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://intern-app-ecommerce-production.up.railway.app";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await axios.get(`${BASE_URL}/api/product`);
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

        state.items = action.payload.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          shortDescription: p.description,
          price: p.originalPrice,
          discountedPrice: p.discountPrice,
          discountPercentage: p.discount,
          sizes: p.sizes ? p.sizes.split(",") : [],
          images: (p.images || [])
            .filter((img) => img.imageUrl)
            .map((img) => ({
              ...img,
              imageUrl: img.imageUrl.startsWith("http")
                ? img.imageUrl
                : `${BASE_URL}${img.imageUrl}`,
            })),
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
