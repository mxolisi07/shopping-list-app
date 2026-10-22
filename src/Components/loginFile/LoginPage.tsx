import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../authSliceFile/authSlice";
import type { RootState, AppDispatch } from "../StoreFile/Store";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error, status, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      alert("Please make sure that your data is correct.");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      alert("Login successful!");
      navigate("/home");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="logo-text2">DB Shop</h1>
      </div>
      <p className="welcome-text">Welcome back!!! Login to continue.</p>

      <div className="login-form">
        <label>Username</label>
        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Password</label>
        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <span className="error">{errors.password}</span>}

        {status === "failed" && <span className="error">{error}</span>}

        <div className="login-links">
          <a className="link-forgot" href="/forgot">Forgotten Password?</a>
          <a className="new-user" href="/signup">New User? Click Here</a>
        </div>

        <div className="login-buttons">
          <button className="cancel-btn" onClick={() => navigate("/")}>CANCEL</button>
          <button className="login-btn" onClick={handleLogin}>LOGIN</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
