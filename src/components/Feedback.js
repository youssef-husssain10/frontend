import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feedback.css';

const Feedback = ({ userId }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage('Please login to submit feedback');
      return;
    }

    if (rating === 0) {
      setErrorMessage('Please select a rating');
      return;
    }

    if (!feedback.trim()) {
      setErrorMessage('Please provide feedback');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5555/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customer_id: userId,
          rating,
          comment: feedback
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSuccessMessage('Thank you for your feedback!');
      setFeedback('');
      setRating(0);
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star-button ${star <= rating ? 'active' : ''}`}
        onClick={() => setRating(star)}
        aria-label={`Rate ${star} stars`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h2>Your Feedback Matters</h2>
        <p>Help us improve our service by sharing your experience with YS Shoe Store.</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Rating</label>
          <div className="rating-group">
            <div className="star-rating">
              {renderStars()}
            </div>
            <span>{rating} of 5</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="feedback">Your Feedback</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your experience..."
            required
          />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
