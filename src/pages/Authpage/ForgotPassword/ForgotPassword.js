import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetState } from '../../../Redux/Slices/forgotPasswordSlice';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector((state) => state.forgotPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email)); // Dispatch forgotPassword action
  };

  const handleReset = () => {
    dispatch(resetState());
    setEmail('');
  };

  // UseEffect to navigate when success is true
  useEffect(() => {
    if (success) {
      // Show success message but do not navigate
      console.log("Reset password email sent successfully.");
    }
  }, [success]);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);
  
  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h5>Forgot Password</h5>
        <input
          type="email"
          className="forgot-password-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="forgot-password-button" disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
        
        {/* Display success or error message */}
        {success && (
          <p className="forgot-password-success" aria-live="assertive">
                Password reset email sent successfully! Please check your email for the reset link.
            <button onClick={handleReset} className="reset-button">Reset</button>
          </p>
        )}

        {error && (
          <p className="forgot-password-error" aria-live="assertive">
            {error || 'Failed to send reset email. Please try again later.'}
            <button onClick={handleReset} className="reset-button">Try Again</button>
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
