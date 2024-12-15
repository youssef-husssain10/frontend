import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ShoeList from './components/ShoeList';
import ShoeDetails from './components/ShoeDetails';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Orders from './components/Orders';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserId(null);
    setCart([]); // Clear cart on logout
    // Clear any stored tokens or session data
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const addToCart = async (shoe) => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:5555/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customer_id: userId,
          shoe_id: shoe.ID,
          quantity: 1
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add item to cart');
      }

      // Update local cart state
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.ID === shoe.ID);
        if (existingItem) {
          return prevCart.map(item =>
            item.ID === shoe.ID
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { ...shoe, quantity: 1 }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/shoes" 
              element={
                <ShoeList 
                  userId={userId} 
                  addToCart={addToCart}
                  isLoggedIn={isLoggedIn}
                />
              } 
            />
            <Route 
              path="/shoes/:shoeId" 
              element={<ShoeDetails userId={userId} isAdmin={isAdmin} />} 
            />
            <Route 
              path="/login" 
              element={
                <Login 
                  setIsLoggedIn={setIsLoggedIn} 
                  setIsAdmin={setIsAdmin}
                  setUserId={setUserId}
                />
              } 
            />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/cart" 
              element={
                isLoggedIn ? 
                <Cart userId={userId} cart={cart} setCart={setCart} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/orders" 
              element={
                isLoggedIn ? (
                  <Orders 
                    userId={userId} 
                    isAdmin={isAdmin}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAdmin ? (
                  <AdminPanel 
                    userId={userId} 
                    isAdmin={isAdmin}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
