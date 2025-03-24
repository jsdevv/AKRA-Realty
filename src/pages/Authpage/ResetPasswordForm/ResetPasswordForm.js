import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../../../Redux/Slices/resetPasswordSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ResetPasswordForm.css';

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.resetPassword);

  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const emailFromUrl = query.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => navigate('/'), 2000);
    }
  }, [success, navigate]);

  if (!token || !emailFromUrl) {
    return <p className="reset-password-error">Missing token or email. Please try again.</p>;
  }

  // Yup validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(10, 'Password must be at least 10 characters')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Must contain at least one lowercase letter')
      .matches(/\d/, 'Must contain at least one number')
      .matches(/[!@#$%^&*]/, 'Must contain at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Confirm Password is required'),
  });

  return (
    <div className="reset-password-container">
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(resetPassword({ 
            password: values.password, 
            confirmPassword: values.confirmPassword, 
            email: emailFromUrl, 
            token: encodeURIComponent(token) 
          }));
        }}
      >
        {({ isSubmitting }) => (
          <Form className="reset-password-form">
            <h2 className="reset-password-heading">Reset Your Password</h2>

            {/* Password Input */}
            <div className="reset-password-input-container">
              <Field
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="reset-password-input"
                placeholder="Enter new password"
              />
              <span 
                className="reset-password-eye-icon" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <ErrorMessage name="password" component="p" className="reset-password-error" />

            {/* Confirm Password Input */}
            <div className="reset-password-input-container">
              <Field
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="reset-password-input"
                placeholder="Confirm new password"
              />
              <span 
                className="reset-password-eye-icon" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <ErrorMessage name="confirmPassword" component="p" className="reset-password-error" />

            {/* Submit Button */}
            <button 
              type="submit" 
              className="reset-password-button" 
              disabled={isSubmitting || loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            {/* Success & Error Messages */}
            {showSuccessMessage && (
              <p className="reset-password-success" aria-live="assertive">
                Password reset successfully! Redirecting to login...
              </p>
            )}

            {error && <p className="reset-password-error">{error}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
