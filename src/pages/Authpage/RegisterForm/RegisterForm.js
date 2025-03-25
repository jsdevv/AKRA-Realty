import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser, resetState } from '../../../Redux/Slices/registrationSlice';
import './RegisterForm.css';

const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
];

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.registration);

  console.log(success,"successmsg");

  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetState());
      }, 3000);
    }
  }, [success, dispatch]);

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
      .required('First Name is required')
      .test('no-only-spaces', 'First Name cannot be empty or spaces only', (value) => value && value.trim().length > 0)
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'First Name can only contain alphabets and spaces')
      .min(2, 'First Name must be at least 2 characters')
      .max(50, 'First Name must be at most 50 characters'),
  
    lastName: Yup.string()
      .required('Last Name is required')
      .test('no-only-spaces', 'Last Name cannot be empty or spaces only', (value) => value && value.trim().length > 0)
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Last Name can only contain alphabets and spaces')
      .min(2, 'Last Name must be at least 2 characters')
      .max(50, 'Last Name must be at most 50 characters'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone Number must be 10 digits')
        .required('Phone Number is required'),
      role: Yup.string().required('Please select a user type'),
    }),
    onSubmit: (values) => {
      console.log(values, 'formvalues');
      const payload = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        countryCode: countryCode,
        role: values.role,
      };
      dispatch(registerUser(payload));
    },
  });

  useEffect(() => {
    if (success) {
      formik.resetForm();
      setTimeout(() => {
        dispatch(resetState());
      }, 3000);
    }
  }, [success, dispatch]);

  const handleCancel = () => {
    formik.resetForm();
    dispatch(resetState());
  };

  return (
    <div className="register-form-container">
      <form onSubmit={formik.handleSubmit} className="register-form">
        {/* First Name */}
        <div className="register-form-row">
          <div className="register-form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="register-form-input"
              disabled={loading}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="error-message">{formik.errors.firstName}</div>
            )}
          </div>

          {/* Last Name */}
          <div className="register-form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="register-form-input"
              disabled={loading}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="error-message">{formik.errors.lastName}</div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="register-form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="register-form-input1"
            disabled={loading}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}
        </div>

        {/* Phone Number with Country Code */}
        <div className="register-form-group">
          <div className="phone-group">
            <select
              className="country-code-dropdown"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={loading}
            >
              {countryCodes.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.country} ({item.code})
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phoneNumber"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Phone Number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="register-form-input"
              disabled={loading}
            />
          </div>
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="error-message">{formik.errors.phoneNumber}</div>
          )}
        </div>

        {/* Document Valid ID */}
        <div className="register-form-group">
  <label htmlFor="documentValidId" className="custom-file-upload">
    <span>Upload Document ID</span>
  </label>
  <input
    type="file"
    name="documentValidId"
    id="documentValidId"
    className="register-form-input"
    disabled 
  />
  {/* You can add error messages here if needed */}
  <div className="error-message">
    {/* Error message */}
  </div>
</div>



        {/* User Type */}
        <div className="register-form-group user-type-group">
          <div className="user-type-heading-container">
            <p className="user-type-heading">User Type</p>
            <div className="user-type-options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="User"
                  onChange={formik.handleChange}
                  checked={formik.values.role === 'User'}
                  disabled={loading}
                />
                User
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Agent"
                  onChange={formik.handleChange}
                  checked={formik.values.role === 'Agent'}
                  disabled={loading}
                />
                Agent
              </label>
            </div>
          </div>
          {formik.touched.role && formik.errors.role && (
            <div className="error-message">{formik.errors.role}</div>
          )}
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="register-submit">
          <button className="register-form-submit" type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Register'}
          </button>
          <button className="register-form-cancel" type="button" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && <div className="register-form-success-message">Registration successful!</div>}
        {error && <div className="register-form-error-message">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterForm;
