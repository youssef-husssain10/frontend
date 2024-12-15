import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">YS Shoe Store</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shoes">Shop</Link>
        {isLoggedIn ? (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
