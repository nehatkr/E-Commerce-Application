import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/constants";



export const fetchVendorProducts = createAsyncThunk(
  "products/fetchVendorProducts",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/product/vendor/${vendorId}`, // ✅ correct endpoint
      );
      return res.data; // ✅ axios way
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
   reducers: {
    removeProduct: (state, action) => {
      state.items = state.items.filter(
        (product) => product.id !== action.payload
      );
    },
  },
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
          shortDescription: p.description,
          price: p.originalPrice,
          quantity: p.quantity,
          discountedPrice: p.discountPrice,
          discountPercentage: p.discount,
          sizes: p.sizes ? p.sizes.split(",") : [],
          images: (p.images || []).map((img) => ({
            id: img.id,
            imageUrl: `${BASE_URL}${img.imageUrl}`, // ✅ VERY IMPORTANT
            contentType: img.contentType,
          })),

          vendorId: p.vendor?.id,
          addToCartEnabled: p.quantity > 0,
        }));
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
       state.items = []; 
      });
  },
});

export const { removeProduct } = productSlice.actions;
export default productSlice.reducer;
