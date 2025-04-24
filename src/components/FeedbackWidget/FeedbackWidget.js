import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSend, FiCheckCircle, FiX } from "react-icons/fi";
import { MdOutlineFeedback } from "react-icons/md";
import { submitFeedback } from "../../Redux/Slices/feedbackSlice";
import "./FeedbackWidget.css";
import { useLocation } from "react-router-dom";

const FeedbackWidget = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const {UserEmail, firstName,lastName } = useSelector((state) => state.auth.userDetails  || {}); 
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [apiResponse, setApiResponse] = useState(null); 

  const location = useLocation();
  const [formData, setFormData] = useState({
    UserEmail: UserEmail,
    FirstName:firstName,
    LastName:lastName,
    Comment: "",
    FeedbackPage: location.pathname
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  // State to manage success message visibility
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.feedback || {});

  useEffect(() => {
    setFormData((prevData) => {
      if (prevData.UserEmail !== UserEmail || prevData.FirstName !== firstName || prevData.LastName !== lastName) {
        return {
          ...prevData,
          UserEmail,
          FirstName: firstName,
          LastName: lastName,
        };
      }
      return prevData;
    });
  }, [UserEmail, firstName, lastName]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      FeedbackPage: location.pathname,  // Update FeedbackPage to current location
    }));
  }, [location.pathname]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300); // Focus after animation
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.Comment.trim() === "") {
      setErrorMessage("Feedback cannot be empty or just whitespace.");
      setTimeout(() => setErrorMessage(""), 5000); // Clear error message after 5 seconds
      return;
    }
    setErrorMessage(""); // Reset error message

    try {
      
  console.log(formData,"forms");
      // Dispatch feedback submission and get the response
      const response = await dispatch(submitFeedback({ bearerToken, formData }));
      setFormData((prev) => ({
        ...prev,
        Comment: "",
        FeedbackPage: "",
      }));
  

      // Close the form
      setIsOpen(false);

      // Assuming the response includes the processMessage
      if (response?.payload?.processMessage) {
        const message = response.payload.processMessage.replace("SUCCESS: ", ""); // Remove "SUCCESS: "
        setApiResponse(message); // Save the extracted message
        setShowSuccessMessage(true);

        // Hide success message after a few seconds
        setTimeout(() => setShowSuccessMessage(false), 4000);
      }
    } catch (error) {
      console.error("Error fetching Reference ID:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
};




  return (
    <div className="feedback-chat-container">


      {/* Feedback Icon */}
      <div
        className="feedback-chat-icon"
        onClick={handleToggle}
        aria-label="Open feedback chat"
      >
        <MdOutlineFeedback size={18} />
      </div>

      {showSuccessMessage && (
        <div className="feedback-chat-success-message">
          <FiCheckCircle size={20} className="success-icon" />
          {`${apiResponse}`}
        </div>
      )}
      {/* Chat Window */}
      {isOpen &&

        <div
          className={`feedback-chat-window ${isOpen ? "feedback-chat-open" : ""}`}
          aria-live="polite"
        >

          {/* Close Icon */}
          <button
            className="feedback-chat-close-btn"
            onClick={handleToggle}
            aria-label="Close feedback form"
          >
            <FiX />
          </button>


          {!showSuccessMessage && (
            <form className="feedback-chat-form" onSubmit={handleSubmit}>
              <div className="feedback-chat-input-container">
                <textarea
                  name="Comment"
                  value={formData.Comment}
                  onChange={handleInputChange}
                  className={`feedback-chat-textarea ${errorMessage ? "error" : ""}`}
                  placeholder="Type your feedback here!"
                  rows="3"
                  required
                  ref={textareaRef}
                ></textarea>

                <button
                  type="submit"
                  className="feedback-chat-send-btn"
                  aria-label="Send feedback message"
                  disabled={isSubmitting} // Disable button while submitting
                >
                  {isSubmitting ? "Sending..." : <FiSend size={20} />}
                </button>

              </div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
          )}
        </div>}
    </div>
  );
};

export default FeedbackWidget;
