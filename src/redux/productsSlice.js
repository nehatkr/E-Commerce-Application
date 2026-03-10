import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

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
          shortDescription: p.description || "",
          description: p.description || "",
          price: p.originalPrice ?? p.price ?? 0,
          originalPrice: p.originalPrice ?? p.price ?? 0,
          quantity: p.quantity ?? 0,
          discountedPrice: p.discountPrice ?? p.discountedPrice ?? p.price ?? 0,
          discountPrice: p.discountPrice ?? p.discountedPrice ?? p.price ?? 0,
          discountPercentage: p.discount ?? 0,
          sizes: p.sizes ? p.sizes.split(",") : [],
          images: (p.images || [])
            .filter((img) => img?.imageUrl || img?.url)
            .map((img) => ({
              ...img,
              imageUrl: (img.imageUrl || img.url).startsWith("http")
                ? img.imageUrl || img.url
                : `${BASE_URL}${img.imageUrl || img.url}`,
            })),
          imageUrl:
            p.imageUrl ||
            p.image_url ||
            (p.images?.[0]?.imageUrl
              ? p.images[0].imageUrl.startsWith("http")
                ? p.images[0].imageUrl
                : `${BASE_URL}${p.images[0].imageUrl}`
              : ""),
          addToCartEnabled: (p.quantity ?? 0) > 0,
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;