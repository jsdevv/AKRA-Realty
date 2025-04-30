import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css';
import { useDispatch } from 'react-redux';
import { setBearerToken, setUserDetails } from '../../../Redux/Slices/authSlice';

const LoginForm = ({handleLogin,toggleForgotPassword}) => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState('');
  const API_URL = 'https://imsdev.akrais.com:8444/AKRARealityAPI/api/auth/token/';

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is Required'),
    password: Yup.string().required('Password is Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Email: values.email, Password: values.password }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Login failed');
        }

        const data = await response.json();
        dispatch(setBearerToken(data.BearerToken));
        console.log(data.BearerToken,"data");
        dispatch(setUserDetails({
          UserEmail: data.Email,
          Id:data.Id,
          firstName: data.FirstName, 
          lastName: data.LastName,
        }));
        handleLogin(data.BearerToken);
        resetForm();

        // Set success message after successful login
        setSuccessMessage('Login successful!');
        setTimeout(() => {
          setSuccessMessage(''); // Clear the success message after a delay
        }, 2000); // Clears after 3 seconds (adjust as needed)
      } catch (error) {
        if (error.message) {
          try {
            const errorData = JSON.parse(error.message); // Parse the response into a JSON object
            if (errorData.Errors && errorData.Errors.length > 0) {
              const errorMessage = errorData.Errors[0].Message; // Extract the error message
              setStatus(errorMessage); 
            }
          } catch (parseError) {
            setStatus('An unknown error occurred. Please try again.');
          }
        }
      }
    },
  });

  return (
    <div className="login-container">
       <span>Please log in to continue</span>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-container">
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
            aria-describedby="emailError"
          />
          {formik.touched.email && formik.errors.email && (
            <span id="emailError" className="loginerror-msg">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="input-container">
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your password"
            aria-describedby="passwordError"
          />
          {formik.touched.password && formik.errors.password && (
            <span id="passwordError" className="loginerror-msg">
              {formik.errors.password}
            </span>
          )}
        </div>



        <button className='login-submit' type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {formik.status && (
          <div aria-live="polite" className="loginerror-msg">
            {formik.status}
          </div>
        )}

      {successMessage && <div className="loginsuccess-msg">{successMessage}</div>}

     <p className="footer-link" onClick={toggleForgotPassword}>
            Forgot Password?
          </p>

       
    </div>
  );
};

export default LoginForm;
