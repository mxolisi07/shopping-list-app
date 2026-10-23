import React, { useEffect, useState } from "react";
import "./ShoppingListPage.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../StoreFile/Store";
import {
  fetchShoppingLists,
  addShoppingListAsync,
  deleteShoppingListAsync,
  editShoppingListAsync
} from "../redux/shoppingListsSlice";
import { FaTrash, FaEdit } from "react-icons/fa";

const ShoppingListsPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { lists, status, error } = useSelector((state: RootState) => state.shoppingLists);


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

  return (
    <div className="shopping-lists-container">
      <h2 className="section-header">Shopping Lists</h2>
      <button className="add-btn" onClick={() => setShowAddModal(true)}>Add Shopping List</button>

      {status === "loading" && <p>Loading lists...</p>}
      {status === "failed" && <p className="error">{error}</p>}

      <div className="shopping-lists-grid">
        {lists.map(list => (
          <div key={list.id} className="list-card">
            <h3>{list.title}</h3>
            <p>{list.description}</p>
            <p><strong>Items:</strong> {list.items?.length || 0}</p>
            <div className="list-actions">
              <button onClick={() => handleEdit(list)}><FaEdit /> Edit</button>
              <button onClick={() => dispatch(deleteShoppingListAsync(list.id))}><FaTrash /> Delete</button>
            </div>
            </div>
          ))}
         : (
          <p>No shopping lists yet.</p>
        )
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

      {/* Edit Modal */}
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
