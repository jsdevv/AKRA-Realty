// RequestInfoForm.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequestInfo } from '../../../Redux/Slices/requestInfoSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Requestinfo = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.requestInfo);
  const bearerToken = useSelector((state) => state.auth.bearerToken);

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    YourMessage: Yup.string().required('Message is required'),
    YourEmail: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    YourPhone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        YourMessage: values.YourMessage,
        YourEmail: values.YourEmail,
        YourPhone: values.YourPhone,
      };

      const resultAction = await dispatch(fetchRequestInfo({ bearerToken, payload }));

      if (fetchRequestInfo.fulfilled.match(resultAction)) {
        toast.success('Request info submitted successfully!');
        resetForm(); // Reset form after successful submission
      } else {
        const errorMsg = resultAction.payload || error || 'Failed to submit request.';
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          YourMessage: '',
          YourEmail: '',
          YourPhone: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className='mb-15'>
              <Field
                type="text"
                name="YourMessage"
                placeholder="Your Message"
                aria-label="Message"
                className="mb-0"
              />
              <ErrorMessage name="YourMessage" component="div" className="error-message" />
            </div>
            <div className='mb-15'>
              <Field
                type="email"
                name="YourEmail"
                placeholder="Your Email"
                aria-label="Email address"
                className="mb-0"
              />
              <ErrorMessage name="YourEmail" component="div" className="error-message" />
            </div>
            <div className='mb-15'>
              <Field
                type="tel"
                name="YourPhone"
                placeholder="Your Phone"
                aria-label="Phone number"
                className="mb-0"
              />
              <ErrorMessage name="YourPhone" component="div" className="error-message" />
            </div>
            <button
              type="submit"
              className="schedule-btn"
              aria-label="Request info"
              disabled={isSubmitting || status === 'loading'}
            >
              {isSubmitting || status === 'loading' ? 'Submitting...' : 'Request Info'}
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default Requestinfo;
