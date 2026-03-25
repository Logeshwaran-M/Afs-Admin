import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, 
  FaTags, FaStar, FaSignOutAlt, FaList, FaUserCircle,
  FaBars, FaTimes, FaImages
} from 'react-icons/fa';
import { useFirebase } from '../context/FirebaseContext';
import '../styles/sidebar.css';
import afslogo from "../images/afs logo.jpeg";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/products', name: 'Products', icon: <FaBox /> },
    { path: '/orders', name: 'Orders', icon: <FaShoppingBag /> },
    { path: '/users', name: 'Users', icon: <FaUsers /> },
    { path: '/categories', name: 'Categories', icon: <FaTags /> },
    { path: '/subcategories', name: 'Sub Categories', icon: <FaList /> },

    // ✅ Design
    { path: '/design', name: 'Design', icon: <FaImages /> },

    // ✅ Shapes
    { path: '/shapes', name: 'Shapes', icon: <FaImages /> },

    // ✅ Meterial (NEW 🔥)
    { path: '/material', name: 'Meterial', icon: <FaImages /> },

    { path: '/reviews', name: 'Reviews', icon: <FaStar /> },
     { path: '/sizes', name: 'Sizes', icon: <FaStar /> },

    // ✅ Gallery
    { path: '/gallery', name: 'Gallery', icon: <FaImages /> },

    { path: '/profile', name: 'Profile', icon: <FaUserCircle /> }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {!isOpen && (
        <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
          <FaBars />
        </button>
      )}

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>

        <div className="sidebar-header">
          <img src={afslogo} alt="AFS Logo" className="sidebar-logo" />
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;