import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from './Components/loginFile/LoginPage';
import SignUpPage from './Components/SignUpFile/SignUpPage';
import HomePage from './Components/HomeFile/HomePage';
import ShoppingListsPage from './Components/ShoppingListFile/ShoppingListPage';
import AddToCartPage from "./Components/AddToCartFile/AddToCartPage";
import ProfilePage from "./Components/ProfileFile/ProfilePage";


import './App.css'

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/shopping-lists" element={<ShoppingListsPage />} />
        <Route path="/cart" element={<AddToCartPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
