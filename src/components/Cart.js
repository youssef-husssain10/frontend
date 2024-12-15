import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [userId, navigate]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:5555/cart/${userId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      const data = await response.json();
      setCartItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:5555/cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update quantity');
      }

      await fetchCartItems();
    } catch (err) {
      if (err.message.includes('Not enough stock')) {
        alert('Sorry, there is not enough stock available for the requested quantity.');
      } else {
        alert('Failed to update quantity. Please try again.');
      }
      setError(err.message);
    }
  };

  const removeItem = async (cartId) => {
    try {
      const response = await fetch(`http://localhost:5555/cart/${cartId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      await fetchCartItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const checkout = async () => {
    try {
      for (const item of cartItems) {
        const orderResponse = await fetch('http://localhost:5555/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            customer_id: userId,
            shoe_id: item.SHOE_ID,
            quantity: item.CART_QUANTITY,
          }),
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to create order');
        }

        // Remove the item from cart
        await fetch(`http://localhost:5555/cart/${item.ID}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      }

      setOrderSuccess(true);
      setCartItems([]);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.PRICE * item.CART_QUANTITY), 0).toFixed(2);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (orderSuccess) return <div className="success-message">Order placed successfully! Redirecting to orders...</div>;

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.ID} className="cart-item">
                <div className="item-details">
                  <h3>{item.NAME}</h3>
                  <p>Brand: {item.BRAND}</p>
                  <p>Size: {item.SIZE}</p>
                  <p>Color: {item.COLOR}</p>
                  <p>Price: ${item.PRICE}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.ID, Math.max(1, item.CART_QUANTITY - 1))}
                      disabled={item.CART_QUANTITY <= 1}
                    >
                      -
                    </button>
                    <span>{item.CART_QUANTITY}</span>
                    <button 
                      onClick={() => updateQuantity(item.ID, item.CART_QUANTITY + 1)}
                      disabled={item.CART_QUANTITY >= item.STOCK_QUANTITY}
                    >
                      +
                    </button>
                  </div>
                  <button className="remove-button" onClick={() => removeItem(item.ID)}>
                    Remove
                  </button>
                </div>
                <div className="item-total">
                  Total: ${(item.PRICE * item.CART_QUANTITY).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <h3>Total: ${calculateTotal()}</h3>
            </div>
            <button className="checkout-button" onClick={checkout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
