import React, { useEffect, useState } from "react";
import "./ShoppingListPage.css";
import "./NavbarShop.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../StoreFile/Store";
import NavBarShop from "../ShoppingListFile/NavbarShop";
import {
  fetchShoppingLists,
  addShoppingListAsync,
  deleteShoppingListAsync,
  editShoppingListAsync
} from "../redux/shoppingListsSlice";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ShoppingListsPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { lists, status, error } = useSelector((state: RootState) => state.shoppingLists);
  const { items } = useSelector((state: RootState) => state.shopping); // ✅ get items to display inside lists

  useEffect(() => {
    dispatch(fetchShoppingLists() as any);
  }, [dispatch]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [editingList, setEditingList] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const saveNewList = () => {
    const newList = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      items: []
    };
    dispatch(addShoppingListAsync(newList));
    setShowAddModal(false);
    setNewTitle("");
    setNewDescription("");
  };

  const handleEdit = (list: any) => {
    setEditingList(list);
    setEditTitle(list.title);
    setEditDescription(list.description);
  };

  const saveEdit = () => {
    if (editingList) {
      dispatch(editShoppingListAsync({
        ...editingList,
        title: editTitle,
        description: editDescription
      }));
      setEditingList(null);
    }
  };

  const removeItemFromList = (list: any, itemId: number) => {
    const updatedList = {
      ...list,
      items: list.items.filter((id: number) => id !== itemId)
    };
    dispatch(editShoppingListAsync(updatedList));
  };

  return (
    <div className="shopping-lists-container">
      <header className="page-header">
        <NavBarShop/>
      </header>

       <h2 className="section-header">Shopping Lists</h2>
        <div className="controls1">
        <button className="back-btn" onClick={() => navigate("/home")}>Back to Home</button>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>Add Shopping List</button>
        </div>
      

      {status === "loading" && <p>Loading lists...</p>}
      {status === "failed" && <p className="error">{error}</p>}

      <div className="items-grid">
        {lists.length ? (
          lists.map(list => {
            const listItems = items.filter(item => list.items.includes(item.id));
            return (
              <div key={list.id} className="card">
                <h3>{list.title}</h3>
                <p>{list.description}</p>
                <p><strong>Items:</strong> {listItems.length}</p>
                <ul>
                  {listItems.map(item => (
                    <li key={item.id}>
                      {item.name} – R {item.price}
                      <button
                        className="remove-btn"
                        onClick={() => removeItemFromList(list, item.id)}
                      >
                        Remove from List
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="card-actions">
                  <button onClick={() => handleEdit(list)}><FaEdit /> Edit</button>
                  <button onClick={() => dispatch(deleteShoppingListAsync(list.id))}><FaTrash /> Delete</button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No shopping lists yet.</p>
        )}
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Shopping List</h3>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <label>Description</label>
            <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            <div className="modal-actions">
              <button onClick={saveNewList}>Add</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingList && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Shopping List</h3>
            <label>Title</label>
            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <label>Description</label>
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            <div className="modal-actions">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingList(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListsPage;
