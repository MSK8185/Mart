import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { auth } from "../firebaseConfig";

const API_URL = "http://localhost:3000/wishlist";

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async () => {
  const userEmail = auth.currentUser?.email || "";
  
  if (!userEmail) {
    throw new Error("User email is missing");
  }

  const response = await axios.get(`${API_URL}/${userEmail}`);
  return response.data;
});


export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async (product) => {
  const userEmail = auth.currentUser?.email || null;

  if (!userEmail) {
    throw new Error("User email is required.");
  }

  const response = await axios.post(`${API_URL}/add`, { ...product, email: userEmail });

  return response.data.wishlist;
});

export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (productId) => {
  const userEmail = auth.currentUser?.email || null;

  if (!userEmail) {
    throw new Error("User email is required.");
  }

  const response = await axios.post(`${API_URL}/remove`, { email: userEmail, productId });

  return response.data.wishlist;
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
