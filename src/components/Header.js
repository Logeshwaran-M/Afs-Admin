import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useFirebase();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Screen size change aagum pothu check panna
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "12px 20px" : "18px 30px", // Mobile-la padding kammi
    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    boxSizing: "border-box",
  };

  const leftStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const welcomeText = {
    margin: 0,
    fontSize: isMobile ? "16px" : "20px", // Mobile-la chinna font
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: isMobile ? "150px" : "none", // Name romba perusa irundha cut aagum
  };

  const subText = {
    fontSize: isMobile ? "11px" : "13px",
    opacity: "0.85",
  };

  const profileWrapper = {
    position: "relative",
    cursor: "pointer",
  };

  const profileIcon = {
    fontSize: isMobile ? "28px" : "32px",
  };

  const dropdown = {
    position: "absolute",
    top: isMobile ? "40px" : "45px",
    right: "0",
    background: "white",
    color: "#333",
    borderRadius: "8px",
    width: "140px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    overflow: "hidden",
  };

  const dropdownItem = {
    padding: "12px 15px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  };

  const logoutStyle = {
    padding: "12px 15px",
    cursor: "pointer",
    fontSize: "14px",
    color: "red",
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header style={headerStyle}>
      <div style={leftStyle}>
        <h2 style={welcomeText}>
          {user?.email?.split("@")[0] || "Admin"}
        </h2>
        <span style={subText}>Admin Dashboard</span>
      </div>

      <div style={profileWrapper}>
        <FaUserCircle
          style={profileIcon}
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div style={dropdown}>
            <div
              style={dropdownItem}
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
            >
              Profile
            </div>

            <div
              style={logoutStyle}
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;