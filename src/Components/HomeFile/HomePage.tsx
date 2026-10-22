import React, { useEffect, useState } from "react";
import "./HomePage.css";
import NavBar from "../Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../StoreFile/Store";
import { addItemAsync, deleteItemAsync, editItemAsync, fetchItems } from "../redux/shoppingSlice";
import { FaCartPlus, FaShareAlt, FaEdit, FaTrash } from "react-icons/fa";

const HomePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as
    | { name?: string }
    | null
    | undefined;
  const { items, status, error } = useSelector((state: RootState) =>
    (state as RootState & {
      shopping: { items: any[]; status: string; error: string | null };
    }).shopping
  );
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(fetchItems() as any);
  }, [dispatch]);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditDescription(item.description);
    setEditImage(item.image);
  };

  const saveEdit = () => {
    if (editingItem) {
      dispatch(editItemAsync({
        ...editingItem,
        name: editName,
        price: editPrice,
        description: editDescription,
        image: editImage
      }));
      setEditingItem(null);
    }
  };

  const saveNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: newName,
      price: newPrice,
      description: newDescription,
      image: newImage || "/assets/default.jpg",
    };
    dispatch(addItemAsync(newItem));
    setShowAddModal(false);
    setNewName("");
    setNewPrice(0);
    setNewDescription("");
    setNewImage("");
  };

  return (
    <div className="home-container">
      <NavBar/>
      <h2 className="welcome-text">Hey, {user?.name || "Guest"}!</h2>

      <div className="search-add">
        <input type="text" placeholder="Search List" className="search-bar" />
        <button className="add-btn" onClick={() => setShowAddModal(true)}>Add Shopping List</button>
      </div>

      <div className="categories">
        <button>Phones</button>
        <button>Laptops</button>
        <button>Keyboard</button>
        <select className="sort-dropdown">
          <option>Sort By</option>
          <option>Name</option>
          <option>Category</option>
          <option>Date Added</option>
        </select>
      </div>

      {status === "loading" && <p>Loading items...</p>}
      {status === "failed" && <p className="error">{error}</p>}

      <div className="shopping-list">
        {items?.length ? (
          items.map(item => (
            <div key={item.id} className="card">
              <img src={item.image} alt={item.name} className="card-img" />
              <h3>{item.name}</h3>
              <p>Price: R {item.price}</p>
              <p>{item.description}</p>
              <div className="card-actions">
                <button><FaCartPlus /> Add to Cart</button>
                <button><FaShareAlt /> Share</button>
                <button onClick={() => handleEdit(item)}><FaEdit /> Edit</button>
                <button onClick={() => dispatch(deleteItemAsync(item.id))}><FaTrash /> Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No items yet.</p>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Item</h3>
            <label>Name</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <label>Price</label>
            <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} />
            <label>Description</label>
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            <label>Image</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setEditImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} />
            <div className="modal-actions">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Item</h3>
            <label>Name</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <label>Price</label>
            <input type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} />
            <label>Description</label>
            <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            <label>Image</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setNewImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} />
            <div className="modal-actions">
              <button onClick={saveNewItem}>Add</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
