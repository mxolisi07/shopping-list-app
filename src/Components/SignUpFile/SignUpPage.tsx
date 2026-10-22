import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../authSliceFile/authSlice";
import type { AppDispatch } from "../StoreFile/Store";
import "./SignUpPage.css";

function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (!/^\d{10}$/.test(contactNumber)) {
      newErrors.contactNumber = "Enter a valid 10-digit number.";
    }
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Confirm Password is required.";
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      alert("Please make sure to have inserted valid data");
      return;
    }

    try {
      await dispatch(registerUser({ 
        name, email, contactNumber, 
        password, confirmPassword })).unwrap();
      alert("Sign up successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Error creating account.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1 className="logo-text2">DB Shop</h1>
      </div>
      <p className="welcome-text">Create your account to get started.</p>

      <div className="signup-form">

        <label>Enter Name</label>
        <input type="text" placeholder="Enter full name" value={name} onChange={e => setName(e.target.value)} />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Enter Email</label>
        <input type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Contact Number</label>
        <input type="text" placeholder="Enter contact number" value={contactNumber} onChange={e => setContactNumber(e.target.value)} />
        {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}

        <label>Password</label>
        <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
        {errors.password && <span className="error">{errors.password}</span>}

        <label>Confirm Password</label>
        <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

        <div className="signup-links">
          <a href="/login">Already have an account? Login</a>
        </div>

        <div className="signup-buttons">
          <button className="cancel-btn" onClick={() => navigate("/")}>CANCEL</button>
          <button className="signup-btn" onClick={handleSignUp}>SIGN UP</button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;