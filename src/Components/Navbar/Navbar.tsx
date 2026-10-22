import React, { useState } from 'react';
import './Navbar.css';
import { FaBars, FaTimes, FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "../authSliceFile/authSlice";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">DB Shop</div>

      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes size={25} color="white" /> : <FaBars size={25} color="white" />}
      </div>

      <div className={`navbar-links ${isOpen ? "active" : ""}`}>
        <NavLink to="/home" className="nav-item">Home</NavLink>
        <NavLink to="/shopping-lists" className="nav-item">Shopping Lists</NavLink>
        <NavLink to="/cart" className="nav-item"><FaShoppingCart color="white" /></NavLink>
        <NavLink to="/profile" className="nav-item"><FaUser color="white" /></NavLink>
        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
      </div>
    </nav>
  );
};

export default Navbar;
