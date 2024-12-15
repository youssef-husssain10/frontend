import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShoeList.css';

const ShoeList = ({ userId, addToCart }) => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShoes();
  }, []);

  const fetchShoes = async () => {
    try {
      const response = await fetch('http://localhost:5555/shoes', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch shoes');
      }
      const data = await response.json();
      const transformedData = data.map(shoe => ({
        ...shoe,
        PRICE: parseFloat(shoe.PRICE) || 0
      }));
      setShoes(transformedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="shoe-list">Loading...</div>;
  }

  if (error) {
    return <div className="shoe-list">Error: {error}</div>;
  }

  return (
    <div className="shoe-list">
      <div className="shoe-list-header">
        <h2>Our Collection</h2>
        <p>Discover our carefully curated selection of premium footwear.</p>
      </div>

      <div className="shoes-grid">
        {shoes.map((shoe) => (
          <div key={shoe.ID} className="shoe-card">
            <div className="shoe-details">
              <h3>{shoe.NAME}</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Brand:</span>
                  <span className="value">{shoe.BRAND}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Size:</span>
                  <span className="value">{shoe.SIZE}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Color:</span>
                  <span className="value">{shoe.COLOR}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Price:</span>
                  <span className="value">${typeof shoe.PRICE === 'number' ? shoe.PRICE.toFixed(2) : '0.00'}</span>
                </div>
              </div>
              <div className="card-actions">
                <button
                  onClick={() => addToCart(shoe)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoeList;
