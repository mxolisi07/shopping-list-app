import React, { useEffect, useState } from "react";
import "./HomePage.css";
import NavBar from "../Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../StoreFile/Store";
import { addItemAsync, deleteItemAsync, editItemAsync, fetchItems } from "../redux/shoppingSlice";
import { FaCartPlus, FaShareAlt, FaEdit, FaTrash } from "react-icons/fa";
import { addItemToListAsync, fetchShoppingLists } from "../redux/shoppingListsSlice";

const HomePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as
    | { name?: string }
    | null
    | undefined;
  const { items, status, error } = useSelector((state: RootState) => state.shopping);
  const lists = useSelector((state: RootState) => state.shoppingLists.lists);
  const dispatch = useDispatch<any>();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("");

  const [selectedListId, setSelectedListId] = useState<string | number | null>(null);
  

  useEffect(() => {
    dispatch(fetchItems() as any);
    dispatch(fetchShoppingLists() as any);
  }, [dispatch]);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditDescription(item.description);
    setEditImage(item.image);
    setEditCategory(item.category);
  };

  const saveEdit = () => {
    if (editingItem) {
      dispatch(editItemAsync({
        ...editingItem,
        name: editName,
        price: editPrice,
        description: editDescription,
        image: editImage,
        category: editCategory,
      }));
      setEditingItem(null);
    }
  };

  const saveNewItem = () => {
    const newItemData = {
      name: newName,
      price: newPrice,
      description: newDescription,
      image: newImage || "/assets/default.jpg",
      category: newCategory,
    };

    if (selectedListId) {
    dispatch(addItemToListAsync({ 
      listId: selectedListId, 
      itemData: newItemData 
    }));
  } else {
    // If no list is selected, add it to global items
    dispatch(addItemAsync(newItemData as any));
  }

    setShowAddModal(false);
    setNewName(""); setNewPrice(0); setNewDescription("");
    setNewImage(""); setNewCategory(""); setSelectedListId(null);

  };

  const filteredItems = items
  .filter(item => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = filterCategory
      ? (item as typeof item & { category?: string }).category?.toLowerCase() === filterCategory.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    if (sortOption === "Name")
      return a.name.localeCompare(b.name);
    if (sortOption === "Category") {
      const aCategory = (a as typeof a & { category?: string }).category || "";
      const bCategory = (b as typeof b & { category?: string }).category || "";
      return aCategory.localeCompare(bCategory);
    }
    if (sortOption === "Date Added") {
      return a.id - b.id; 
    }
    return 0;
  });

  return (
    <div className="home-container">
      <NavBar/>
      <h2 className="welcome-text">Hey, {user?.name || "Guest"}!</h2>
        <p className="mini-text">Welcome to your home screen</p>
        <div className="controls">
          <div className="search-add">
            <input 
              type="text" 
              placeholder="Search List" 
              className="search-bar" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              />
            <button className="add-btn" onClick={() => setShowAddModal(true)}>
              Add Item
            </button>
          </div>

          <div className="categories">
            <button onClick={() => setFilterCategory("Phones")}>Phones</button>
            <button onClick={() => setFilterCategory("Laptops")}>Laptops</button>
            <button onClick={() => setFilterCategory("Keyboard")}>Keyboard</button>
            <select 
              className="sort-dropdown"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="Name">Name</option>
              <option value="Category">Category</option>
              <option value="Date Added">Date Added</option>
            </select>
          </div>
        </div>

      {status === "loading" && <p>Loading items...</p>}
      {status === "failed" && <p className="error">{error}</p>}

      <h2 className="section-header">Items</h2>
      <div className="items-grid">
        {filteredItems.length ? (
          filteredItems.map(item => (
            <div key={item.id} className="card">
              <img src={item.image} alt={item.name} className="card-img" />
              <h3>{item.name}</h3>
              <p>Price: R {item.price}</p>
              <p>{item.description}</p>
              <p><strong>Category:</strong> {item.category}</p>
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
            <label>Category</label>
            <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
            <div className="modal-actions">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

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
            <label>Category</label>
            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <label>Assign to List</label>
            <select value={selectedListId ?? ""} onChange={(e) => { const val = e.target.value; 
              setSelectedListId(val === "" ? null : val)}}>
              <option value="">None</option>
              {lists.map(list => (
                <option key={list.id} value={list.id}>{list.title}</option>
              ))}
            </select>
            
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
