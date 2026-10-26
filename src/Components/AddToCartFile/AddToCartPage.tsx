import React, { useEffect } from "react";
import "./AddToCartPage.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../StoreFile/Store";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchCartItems, removeFromCartAsync, updateCartItemQuantityAsync } from "../redux/cartSlice"; 
import type { CartItem } from "../redux/cartSlice";

const AddToCartPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
    dispatch(fetchCartItems() as any);
  }, [dispatch]);
  
  const handleRemove = (id: string | number) => {
    dispatch(removeFromCartAsync(id));
  };

  const handleQtyChange = (id: string | number, qty: number) => {
  dispatch(updateCartItemQuantityAsync({ id, quantity: qty }));
};

  return (
    <div className="cart-container">
      <header className="page-header">
        <img src="/assets/logo.png" alt="Logo" className="logo" />
        <button className="back-btn" onClick={() => navigate("/home")}>Back to Home</button>
      </header>

      <h2 className="section-header">Your Cart</h2>

      <div className="items-grid">
        {cartItems.length ? (
          cartItems.map((item: CartItem) => (
            <div key={item.id} className="card">
              <img src={item.image} alt={item.name} className="card-img" />
              <h3>{item.name}</h3>
              <p>Price: R {item.price}</p>
              <p>{item.description}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <div className="qty-row">
                <label htmlFor={`qty-${item.id}`}>Qty</label>
                <select
                    id={`qty-${item.id}`}
                    className="sort-dropdown"
                    value={item.quantity ?? 1}
                    onChange={(e) => handleQtyChange(item.id!, Number(e.target.value))}
                >
                    {[1,2,3,4,5,10].map(n => ( <option key={n} value={n}>{n}</option>))}
                </select>
                </div>
              <div className="card-actions">
                <button onClick={() => handleRemove(item.id!)}><FaTrash /> Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default AddToCartPage;
