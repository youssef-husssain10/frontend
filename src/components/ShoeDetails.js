import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ShoeDetails.css';

const ShoeDetails = ({ userId, isAdmin }) => {
  const { shoeId } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShoeDetails();
  }, [shoeId]);

  const fetchShoeDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5555/shoes/${shoeId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch shoe details');
      }
      
      const data = await response.json();
      setShoe(data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!userId) {
      sessionStorage.setItem('redirectUrl', window.location.pathname);
      navigate('/login');
      return;
    }

    try {
      const addResponse = await fetch('http://localhost:5555/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customer_id: userId,
          shoe_id: parseInt(shoeId),
          quantity: 1
        }),
      });

      if (!addResponse.ok) {
        const errorData = await addResponse.json();
        if (errorData.error && errorData.error.includes('Not enough stock')) {
          alert('Sorry, this item is currently out of stock or not available in the requested quantity.');
          return;
        }
        throw new Error(errorData.error || 'Failed to add to cart');
      }

      alert('Cart added successfully');
    } catch (err) {
      setError(err.message);
      alert(err.message);
      console.error('Cart error:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!shoe) return <div className="error-message">Shoe not found</div>;

  return (
    <div className="shoe-details-page">
      <div className="shoe-details-card">
        <h2>{shoe.NAME}</h2>
        <div className="shoe-info">
          <div className="info-group">
            <label>Description:</label>
            <span>{shoe.DESCRIPTION}</span>
          </div>
          <div className="info-group">
            <label>Brand:</label>
            <span>{shoe.BRAND}</span>
          </div>
          <div className="info-group">
            <label>Size:</label>
            <span>{shoe.SIZE}</span>
          </div>
          <div className="info-group">
            <label>Color:</label>
            <span>{shoe.COLOR}</span>
          </div>
          <div className="info-group">
            <label>Price:</label>
            <span>${shoe.PRICE}</span>
          </div>
        </div>
        <button 
          onClick={addToCart}
          className="add-to-cart-btn"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ShoeDetails;
