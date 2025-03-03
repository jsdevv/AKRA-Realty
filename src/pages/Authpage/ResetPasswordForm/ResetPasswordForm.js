import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../../Redux/Slices/resetPasswordSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ResetPasswordForm.css';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.resetPassword);

  const query = new URLSearchParams(useLocation().search);
  console.log(query,"query");
  const token = query.get('token');
  const emailFromUrl = query.get('email');

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const showMessageWithDelay = () => {
    setTimeout(() => {
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation regex (at least 10 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError('Password must contain at least 10 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
      return;
    }

    if (password === confirmPassword) {
      const encodedToken = encodeURIComponent(token);
      dispatch(resetPassword({ password, confirmPassword, email, token: encodedToken }));
    } else {
      setPasswordError('Passwords do not match!');
    }
  };

  useEffect(() => {
    if (success) {
      showMessageWithDelay();
    }
  }, [success]);
  console.log(success,"success");

  if (!token || !emailFromUrl) {
    return <p className="reset-password-error">Missing token or email. Please try again.</p>;
    
  }

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h2 className="reset-password-heading">Reset Your Password</h2>

        <div className="reset-password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            className="reset-password-input"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            aria-describedby="password-error"
          />
          <span
            className="reset-password-eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="reset-password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="reset-password-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            aria-describedby="password-error"
          />
          <span
            className="reset-password-eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="reset-password-button" disabled={loading || password !== confirmPassword}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {/* Display success or error message */}
        {showSuccessMessage && (
          <p className="reset-password-success" aria-live="assertive">
            Password reset successfully! Redirecting to login...
          </p>
        )}

        {passwordError && (
          <p id="password-error" className="reset-password-error" aria-live="assertive">
            {passwordError}
          </p>
        )}

        {error && (
          <p className="reset-password-error" aria-live="assertive">{error}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordForm;
