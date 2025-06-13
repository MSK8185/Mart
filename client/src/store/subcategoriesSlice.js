import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions
export const fetchSubcategories = createAsyncThunk(
  "subcategories/fetchSubcategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://20.40.59.234:3000/api/admin/subcategories"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addSubcategory = createAsyncThunk(
  "subcategories/addSubcategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://20.40.59.234:3000/api/admin/subcategories",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.subcategory;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  "subcategories/updateSubcategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://20.40.59.234:3000/api/admin/subcategories/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSubcategory = createAsyncThunk(
  "subcategories/deleteSubcategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `http://20.40.59.234:3000/api/admin/subcategories/${id}`
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const subcategoriesSlice = createSlice({
  name: "subcategories",
  initialState: {
    subcategories: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add subcategory
      .addCase(addSubcategory.fulfilled, (state, action) => {
        state.subcategories.push(action.payload);
      })
      // Update subcategory
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        const index = state.subcategories.findIndex(
          (sub) => sub._id === action.payload._id
        );
        if (index !== -1) {
          state.subcategories[index] = action.payload;
        }
      })
      // Delete subcategory
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.subcategories = state.subcategories.filter(
          (sub) => sub._id !== action.payload
        );
      });
  },
});

export default subcategoriesSlice.reducer;
