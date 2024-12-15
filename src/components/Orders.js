import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = ({ userId, isAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shoes, setShoes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchOrders();
    fetchShoes();
  }, [userId, navigate]);

  const fetchShoes = async () => {
    try {
      const response = await fetch('http://localhost:5555/shoes', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch shoes');
      const shoesData = await response.json();
      const shoesMap = {};
      shoesData.forEach(shoe => {
        shoesMap[shoe.ID] = shoe;
      });
      setShoes(shoesMap);
    } catch (err) {
      console.error('Error fetching shoes:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const url = isAdmin 
        ? 'http://localhost:5555/orders'
        : `http://localhost:5555/orders/customer/${userId}`;

      const response = await fetch(url, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!isAdmin) return;
    
    try {
      const response = await fetch(`http://localhost:5555/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      // Refresh orders after deletion
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="orders-container">
      <h2>{isAdmin ? 'All Orders' : 'My Orders'}</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const shoe = shoes[order.SHOE_ID] || {};
            return (
              <div key={order.ID} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.ID}</h3>
                  {isAdmin && (
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteOrder(order.ID)}
                    >
                      Delete Order
                    </button>
                  )}
                </div>
                <div className="order-details">
                  <div className="shoe-info">
                    <h4>{shoe.NAME || 'Unknown Shoe'}</h4>
                    <p><strong>Brand:</strong> {shoe.BRAND || 'N/A'}</p>
                    <p><strong>Size:</strong> {shoe.SIZE || 'N/A'}</p>
                    <p><strong>Color:</strong> {shoe.COLOR || 'N/A'}</p>
                  </div>
                  <div className="order-summary">
                    <p><strong>Quantity:</strong> {order.QUANTITY}</p>
                    <p><strong>Price per item:</strong> ${shoe.PRICE || 0}</p>
                    <p className="total"><strong>Total:</strong> ${((shoe.PRICE || 0) * order.QUANTITY).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
