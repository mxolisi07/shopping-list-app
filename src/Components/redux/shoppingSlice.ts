import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface ShoppingState {
  items: Item[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ShoppingState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchItems = createAsyncThunk("shopping/fetchItems", async () => {
  const response = await fetch("http://localhost:5000/shoppingLists");
  return (await response.json()) as Item[];
});

export const addItemAsync = createAsyncThunk("shopping/addItem", async (newItem: Item) => {
  const response = await fetch("http://localhost:5000/shoppingLists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  });
  return await response.json();
});

export const editItemAsync = createAsyncThunk("shopping/editItem", async (updatedItem: Item) => {
  const response = await fetch(`http://localhost:5000/shoppingLists/${updatedItem.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedItem),
  });
  return await response.json();
});

export const deleteItemAsync = createAsyncThunk("shopping/deleteItem", async (id: number) => {
  await fetch(`http://localhost:5000/shoppingLists/${id}`, { method: "DELETE" });
  return id;
});

const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    editItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(addItemAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editItemAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteItemAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
      
  },
});

export const { addItem, deleteItem, editItem } = shoppingSlice.actions;
export default shoppingSlice.reducer;