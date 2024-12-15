import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = ({ userId, isAdmin }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Admin status:', isAdmin); // Add this for debugging
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'users') {
        const response = await fetch('http://localhost:5555/users', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } else if (activeTab === 'shoes') {
        const response = await fetch('http://localhost:5555/shoes', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch shoes');
        const data = await response.json();
        setShoes(data);
      } else if (activeTab === 'orders') {
        const response = await fetch('http://localhost:5555/orders', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5555/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete user');
      }
      await fetchData();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
    }
  };

  const handleDeleteShoe = async (shoeId) => {
    try {
      const response = await fetch(`http://localhost:5555/shoes/${shoeId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete shoe');
      }
      await fetchData();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting shoe:', err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5555/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete order');
      }
      await fetchData();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting order:', err);
    }
  };

  const renderTabs = () => (
    <div className="admin-tabs">
      <button 
        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        Users
      </button>
      <button 
        className={`tab-btn ${activeTab === 'shoes' ? 'active' : ''}`}
        onClick={() => setActiveTab('shoes')}
      >
        Shoes
      </button>
      <button 
        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => setActiveTab('orders')}
      >
        Orders
      </button>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-table">
      <h3>Users Management</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.ID}>
              <td>{user.ID}</td>
              <td>{user.NAME}</td>
              <td>{user.EMAIL}</td>
              <td>{user.ISADMIN ? 'Admin' : 'User'}</td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.ID)}
                  disabled={user.ID === userId}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderShoes = () => (
    <div className="admin-table">
      <h3>Shoes Management</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Size</th>
            <th>Color</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shoes.map(shoe => (
            <tr key={shoe.ID}>
              <td>{shoe.ID}</td>
              <td>{shoe.NAME}</td>
              <td>{shoe.BRAND}</td>
              <td>{shoe.SIZE}</td>
              <td>{shoe.COLOR}</td>
              <td>${shoe.PRICE}</td>
              <td>{shoe.QUANTITY}</td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteShoe(shoe.ID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-table">
      <h3>Orders Management</h3>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Shoe ID</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.ID}>
              <td>{order.ID}</td>
              <td>{order.CUSTOMER_ID}</td>
              <td>{order.SHOE_ID}</td>
              <td>{order.QUANTITY}</td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteOrder(order.ID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {error && <div className="error-message">{error}</div>}
      {renderTabs()}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="admin-content">
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'shoes' && renderShoes()}
          {activeTab === 'orders' && renderOrders()}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
