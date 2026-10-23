import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ShoppingList {
  id: number;
  title: string;
  description: string;
  items: any[];
}

interface ShoppingListsState {
  lists: ShoppingList[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ShoppingListsState = {
  lists: [],
  status: "idle",
  error: null,
};

export const fetchShoppingLists = createAsyncThunk("shoppingLists/fetch", async () => {
  const response = await fetch("http://localhost:5000/shoppingLists");
  return (await response.json()) as ShoppingList[];
});

export const addShoppingListAsync = createAsyncThunk("shoppingLists/add", async (newList: ShoppingList) => {
  const response = await fetch("http://localhost:5000/shoppingLists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newList),
  });
  return await response.json();
});

export const editShoppingListAsync = createAsyncThunk("shoppingLists/edit", async (updatedList: ShoppingList) => {
  const response = await fetch(`http://localhost:5000/shoppingLists/${updatedList.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedList),
  });
  return await response.json();
});

export const deleteShoppingListAsync = createAsyncThunk("shoppingLists/delete", async (id: number) => {
  await fetch(`http://localhost:5000/shoppingLists/${id}`, { method: "DELETE" });
  return id;
});

const shoppingListsSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchShoppingLists.fulfilled, (state, action: PayloadAction<ShoppingList[]>) => {
        state.lists = action.payload;
        state.status = "succeeded";
      })
      .addCase(addShoppingListAsync.fulfilled, (state, action: PayloadAction<ShoppingList>) => {
        state.lists.push(action.payload);
      })
      .addCase(editShoppingListAsync.fulfilled, (state, action: PayloadAction<ShoppingList>) => {
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) state.lists[index] = action.payload;
      })
      .addCase(deleteShoppingListAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.lists = state.lists.filter(list => list.id !== action.payload);
      });
  },
});

export default shoppingListsSlice.reducer;
