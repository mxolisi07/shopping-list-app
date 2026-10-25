import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../StoreFile/Store";
import { logoutUser, updateUserDetailsAsync, updateUserCredentialsAsync } from "../authSliceFile/authSlice";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);


  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isCredentialsModalOpen, setCredentialsModalOpen] = useState(false);

  const [detailsForm, setDetailsForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: user?.profilePic || "",
  });

  const [credentialsForm, setCredentialsForm] = useState({
    email: user?.email || "",
    password: "",
    newPassword: "",
  });

  const handleLogout = () => { 
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files?.[0]) {
      setDetailsForm({ ...detailsForm, profilePic: URL.createObjectURL(files[0]) });
    } else {
      setDetailsForm({ ...detailsForm, [name]: value });
    }
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentialsForm({ ...credentialsForm, [name]: value });
  };

  const saveDetails = () => {
    dispatch(updateUserDetailsAsync(detailsForm));
    setDetailsModalOpen(false);
  };

  const saveCredentials = () => {
    dispatch(updateUserCredentialsAsync(credentialsForm));
    setCredentialsModalOpen(false);
  };

  return (
    <div className="profile-page">
      <nav className="navbar">
        <Link className="profile-info" to="/profile">
        
        <img
            src={user?.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="profile-avatar"
        />
        <div className="profile-text">
            <span className="profile-name">{user?.name}</span>
            <span className="profile-email">{user?.email}</span>
        </div>
        </Link>
        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
      </nav>

      <div className="profile-card">
        <img
          src={detailsForm.profilePic || "/default-avatar.png"}
          alt="Profile"
          className="profile-pic"
        />
        <h2>{user?.name}</h2>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Contact Number: {user?.contactNumber}</p>


        <div className="profile-actions">
          <button onClick={() => setDetailsModalOpen(true)}>Update Profile</button>
          <button onClick={() => setCredentialsModalOpen(true)}>Update Credentials</button>
          <button onClick={()=> navigate("/home")}>Back to Home</button>
        </div>
      </div>

      {isDetailsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Profile</h3>
            <input type="text" name="name" value={detailsForm.name} onChange={handleDetailsChange} />
            <input type="email" name="email" value={detailsForm.email} onChange={handleDetailsChange} />
            <input type="file" name="profilePic" accept="image/*" onChange={handleDetailsChange} />
            <div className="modal-actions">
              <button onClick={saveDetails}>Save</button>
              <button onClick={() => setDetailsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {isCredentialsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Credentials</h3>
            <input type="email" name="email" value={credentialsForm.email} onChange={handleCredentialsChange} />
            <input type="password" name="password" placeholder="Current Password" onChange={handleCredentialsChange} />
            <input type="password" name="newPassword" placeholder="New Password" onChange={handleCredentialsChange} />
            <div className="modal-actions">
              <button onClick={saveCredentials}>Save</button>
              <button onClick={() => setCredentialsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
