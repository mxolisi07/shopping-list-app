import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addItemAsync } from "./shoppingSlice";

interface ShoppingList {
  id?: number | string;
  title: string;
  description: string;
  items: (string | number)[];
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

export const deleteShoppingListAsync = createAsyncThunk("shoppingLists/delete", async (id: string | number) => {
  await fetch(`http://localhost:5000/shoppingLists/${id}`, { method: "DELETE" });
  return id;
});

export const addItemToListAsync = createAsyncThunk(
  "shoppingLists/addItemToList",
  async ({ listId, itemData }: { listId: number | string, itemData: any }, { dispatch, getState }) => {

    const addedItemAction = await dispatch(addItemAsync(itemData));
    const newItem = addedItemAction.payload as { id: string | number }; 
    

    const state = getState() as any;
    const currentList = state.shoppingLists.lists.find((l: any) => String(l.id) === String(listId));

    if (!currentList) {
      console.error("List not found");
      return null;
    }
   
    const updatedList = {
      ...currentList,
      items: [...(currentList.items || []), newItem.id]
    };



    const response = await fetch(`http://localhost:5000/shoppingLists/${listId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedList),
    });

    return (await response.json());
  }
);

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
      .addCase(deleteShoppingListAsync.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.lists = state.lists.filter(list => list.id !== action.payload);
      })

      .addCase(addItemToListAsync.fulfilled, (state, action) => {
        const updatedList = action.payload;
        if (updatedList) {
          const index = state.lists.findIndex(list => list.id === updatedList.id);
          if (index !== -1) state.lists[index] = updatedList;
        }
      })
  },
});

export default shoppingListsSlice.reducer;
