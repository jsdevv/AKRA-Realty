import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './KYCForm.css';

const KYCForm = () => {
    const [showForm, setShowForm] = useState(true);
    const closeForm = () => setShowForm(false);
    const validationSchema = Yup.object({
        fullName: Yup.string().required('Full Name is required'),
        dob: Yup.date().required('Date of Birth is required'),
        idProof: Yup.string().required('ID Proof is required'),
        aadharNumber: Yup.string().required('Aadhar Number is required').matches(/^[2-9]{1}[0-9]{11}$/, 'Invalid Aadhar number'),
        address: Yup.string().required('Address is required'),
        incomeProof: Yup.string().required('Income Proof is required'),
        documentUpload: Yup.mixed().required('Document upload is required'),
        declaration: Yup.boolean().oneOf([true], 'You must accept the declaration'),
        dateSigned: Yup.date().required('Date Signed is required'),
        applicantName: Yup.string().required('Applicant Name is required'),
        digitalSignature: Yup.string().required('Digital Signature is required')
    });

    const handleSubmit = (values, { resetForm }) => {
        console.log('Form Data:', values);
        toast.success('Form submitted successfully!', { autoClose: 3000 });
        resetForm();
    };

    return (
        <>
            {showForm && (
                <div className='kyc-form-container'>
                    <div className="kyc-form-content">
                        <button className="kyc-close-btn" onClick={closeForm}>×</button>
                        <h2 className="kyc-form-title">AML KYC Form</h2>
                        <Formik
                            initialValues={{
                                fullName: '',
                                dob: '',
                                idProof: '',
                                aadharNumber: '',
                                address: '',
                                incomeProof: '',
                                documentUpload: null,
                                declaration: false,
                                dateSigned: '',
                                applicantName: '',
                                digitalSignature: ''
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue }) => (
                                <Form className="kyc-form-unique">
                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="fullName" className="kyc-form-label">Full Name</label>
                                        <Field name="fullName" type="text" placeholder="Enter your full name" className="kyc-form-input" />
                                        <ErrorMessage name="fullName" component="div" className="kyc-error-message" />
                                    </div>

                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="dob" className="kyc-form-label">Date of Birth</label>
                                        <Field name="dob" type="date" className="kyc-form-input" />
                                        <ErrorMessage name="dob" component="div" className="kyc-error-message" />
                                    </div>

                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="idProof" className="kyc-form-label">ID Proof</label>
                                        <Field name="idProof" as="select" className="kyc-form-select">
                                            <option value="">Select ID Proof</option>
                                            <option value="passport">Passport</option>
                                            <option value="pan">PAN Card</option>
                                        </Field>
                                        <ErrorMessage name="idProof" component="div" className="kyc-error-message" />
                                    </div>

                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="aadharNumber" className="kyc-form-label">Aadhar Number</label>
                                        <Field name="aadharNumber" type="text" placeholder="Enter your Aadhar number" className="kyc-form-input" />
                                        <ErrorMessage name="aadharNumber" component="div" className="kyc-error-message" />
                                    </div>

                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="address" className="kyc-form-label">Address</label>
                                        <Field name="address" type="text" placeholder="Enter your address" className="kyc-form-input" />
                                        <ErrorMessage name="address" component="div" className="kyc-error-message" />
                                    </div>

                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="incomeProof" className="kyc-form-label">Income Proof</label>
                                        <Field name="incomeProof" as="select" className="kyc-form-select">
                                            <option value="">Select Income Proof</option>
                                            <option value="salary_slip">Salary Slip</option>
                                            <option value="itr">ITR (Income Tax Return)</option>
                                        </Field>
                                        <ErrorMessage name="incomeProof" component="div" className="kyc-error-message" />
                                    </div>

                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="documentUpload" className="kyc-form-label">Upload Documents</label>
                                        <input
                                            name="documentUpload"
                                            type="file"
                                            onChange={(event) => setFieldValue('documentUpload', event.target.files[0])}
                                            className="kyc-form-input"
                                        />
                                        <ErrorMessage name="documentUpload" component="div" className="kyc-error-message" />
                                    </div>


                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="dateSigned" className="kyc-form-label">Date Signed</label>
                                        <Field name="dateSigned" type="date" className="kyc-form-input" />
                                        <ErrorMessage name="dateSigned" component="div" className="kyc-error-message" />
                                    </div>

                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="applicantName" className="kyc-form-label">Name of Applicant</label>
                                        <Field name="applicantName" type="text" placeholder="Enter applicant name" className="kyc-form-input" />
                                        <ErrorMessage name="applicantName" component="div" className="kyc-error-message" />
                                    </div>

                                    <div className="kyc-form-group-unique">
                                        <label htmlFor="digitalSignature" className="kyc-form-label">Digital Signature</label>
                                        <Field name="digitalSignature" type="text" placeholder="Enter your digital signature" className="kyc-form-input" />
                                        <ErrorMessage name="digitalSignature" component="div" className="kyc-error-message" />
                                    </div>


                                    <div className="kyc-form-group-unique kyc-form-group-full">
                                        <label htmlFor="declaration" className="kyc-form-declaration">
                                            <Field name="declaration" type="checkbox" className="kyc-form-checkbox" />
                                            I hereby declare that the information given above is true and correct.
                                        </label>
                                        <ErrorMessage name="declaration" component="div" className="kyc-error-message" />
                                    </div>

                                    <button type="submit" className="kyc-submit-btn">Submit</button>

                                </Form>
                            )}
                        </Formik>

                        <ToastContainer />
                    </div>
                </div>
            )}
        </>
    );
};

export default KYCForm;
