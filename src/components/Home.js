import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome to YS Shoe Store</h1>
      </div>

      <div className="about-section">
        <h2>About Us</h2>
        <p>
          YS Shoe Store is your premier destination for quality footwear. We specialize in casual and comfort shoes,
          offering a wide selection that prioritizes both style and comfort for your everyday needs.
        </p>
      </div>

      <div className="contact-section">
        <h2>Contact Information</h2>
        <div className="contact-details">
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>45 El-Tahrir Street, Cairo, Egypt</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <p>+20 2 2345-6789</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <p>contact@ysshoestore.eg</p>
          </div>
        </div>
      </div>

      <div className="hours-section">
        <h2>Business Hours</h2>
        <div className="hours-details">
          <p>Thursday - Saturday: 10:00 AM - 10:00 PM</p>
          <p>Sunday - Wednesday: 2:00 PM - 10:00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
