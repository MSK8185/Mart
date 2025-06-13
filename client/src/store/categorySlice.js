
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../Admin/api/api';


export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getCategories();
      return data;
    } catch (error) {
      return rejectWithValue('Error fetching categories');
    }
  }
);

export const addNewCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData, { dispatch, rejectWithValue }) => {
    try {
      // Get the name from FormData
      const name = categoryData.get('name');
      const response = await addCategory(categoryData);
      dispatch(fetchCategories()); // Fetch updated categories after adding
      return `Category "${name}" added successfully!`;
    } catch (error) {
      console.error("Add category error:", error);

      // Extract error message from the API response
      let errorMessage;
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data;
      } else {
        errorMessage = error.message || 'Error adding category';
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateExistingCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { dispatch, rejectWithValue }) => {
    try {
      await updateCategory(id, categoryData);
      dispatch(fetchCategories()); // Fetch updated categories after updating
      return `Category "${categoryData.name}" updated successfully!`;
    } catch (error) {
      return rejectWithValue('Error updating category');
    }
  }
);

export const removeCategory = createAsyncThunk(
  'categories/deleteCategory',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await deleteCategory(id);
      dispatch(fetchCategories()); // Fetch updated categories after deletion
      return `Category "${name}" deleted successfully!`;
    } catch (error) {
      return rejectWithValue('Error deleting category');
    }
  }
);

// Category slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    notification: '',
    error: '',
  },
  reducers: {
    clearNotification: (state) => {
      state.notification = '';
    },
    clearError: (state) => {
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
        state.error = '';
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching categories';
      })

      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.notification = action.payload;
        state.error = '';
      })
      .addCase(addNewCategory.rejected, (state, action) => {
        state.error = action.payload || 'Error adding category';
      })

      .addCase(updateExistingCategory.fulfilled, (state, action) => {
        state.notification = action.payload;
        state.error = '';
      })
      .addCase(updateExistingCategory.rejected, (state, action) => {
        state.error = action.payload || 'Error updating category';
      })

      .addCase(removeCategory.fulfilled, (state, action) => {
        state.notification = action.payload;
        state.error = '';
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.error = action.payload || 'Error deleting category';
      });
  }
});

export const { clearNotification, clearError  } = categorySlice.actions;

export default categorySlice.reducer;
