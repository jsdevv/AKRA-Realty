// ScheduleTourForm.js
import React from 'react';
import DatePicker from 'react-datepicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { scheduleTour } from '../../../Redux/Slices/scheduleTourSlice';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify for notifications
import 'react-toastify/dist/ReactToastify.css';
import "./ScheduleTourForm.css"

const ScheduleTourForm = () => {
  const dispatch = useDispatch();
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const { status, error } = useSelector((state) => state.scheduleTour);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      scheduleAt: new Date(),
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('First Name is required'),
      lastName: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Last Name is required'),
      mobile: Yup.string()
        .matches(/^\d{10,15}$/, 'Must be a valid phone number')
        .required('Mobile number is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      scheduleAt: Yup.date().required('Schedule date is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
        const payload = {
          FirstName: values.firstName,
          LastName: values.lastName,
          Mobile: values.mobile,
          Email: values.email,
          ScheduledAt: values.scheduleAt.toISOString().split('T')[0],
        };
        try {
          // Dispatch scheduleTour action
          await dispatch(scheduleTour({ bearerToken, payload })).unwrap();
      
          // Reset form fields after successful submission
          resetForm();
      
        } catch (err) {
          // Use error from the store if exists
          console.log(err,"error");
    
        }
      },
      
  });

  return (
    <form onSubmit={formik.handleSubmit} className="tour-form">
  
      <div className='mb-15'>
        <input
          type="text"
          name="firstName"
          placeholder="Enter Your First Name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.firstName && formik.errors.firstName ? 'error mb-0' : 'mb-0'}
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <div className="error-message">{formik.errors.firstName}</div>
        )}
      </div>
      <div className='mb-15'>
        <input
          type="text"
          name="lastName"
          placeholder="Enter Your Last Name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.lastName && formik.errors.lastName ? 'error mb-0' : 'mb-0'}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <div className="error-message">{formik.errors.lastName}</div>
        )}
      </div>
      <div className='mb-15'>
        <input
          type="tel"
          name="mobile"
          placeholder="Enter Your Phone Number"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.mobile && formik.errors.mobile ? 'error mb-0' : 'mb-0'}
        />
        {formik.touched.mobile && formik.errors.mobile && (
          <div className="error-message">{formik.errors.mobile}</div>
        )}
      </div>
      <div className='mb-15'>
        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.email && formik.errors.email ? 'error mb-0' : 'mb-0'}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error-message">{formik.errors.email}</div>
        )}
      </div>
      <div>
        <DatePicker
          className="date-picker"
          selected={formik.values.scheduleAt}
          onChange={(date) => formik.setFieldValue('scheduleAt', date)}
       
          placeholderText="Enter Date"
        />
        {formik.touched.scheduleAt && formik.errors.scheduleAt && (
          <div className="error-message">{formik.errors.scheduleAt}</div>
        )}
      </div>
      <button
        type="submit"
        className="schedule-btn"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Scheduling...' : 'Schedule A Tour'}
      </button>
    </form>
  );
};

export default ScheduleTourForm;
