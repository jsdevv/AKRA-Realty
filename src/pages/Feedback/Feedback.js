import React, { useEffect, useState } from 'react';
import { fetchFeedbackRefID } from '../../API/api';
import './Feedback.css';
import { useSelector } from 'react-redux';

const Feedback = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState(''); // Renamed state variable

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFeedbackRefID(bearerToken);
        setFeedbackData(response || []);
      } catch (err) {
        setError('Unable to fetch feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bearerToken]);

  // Filter feedbackData based on the filterText
  const filteredFeedbackData = feedbackData.filter((item) => {
    return (
      (item.FeedbackID?.toString().toLowerCase().includes(filterText.toLowerCase())) ||  // Filter by ID
      (item.Comment?.toLowerCase().includes(filterText.toLowerCase())) ||               // Filter by Feedback
      (item.UserEmail?.toLowerCase().includes(filterText.toLowerCase())) ||               // Filter by User
      (item.SubmittedDate && new Date(item.SubmittedDate).toLocaleString().toLowerCase().includes(filterText.toLowerCase())) || // Filter by Date
      (item.FeedbackPage?.toLowerCase().includes(filterText.toLowerCase()))            // Filter by Page Name
    );
  });

  if (loading) {
    return <div className="bug-feedback-loading">Loading...</div>;
  }

  if (error) {
    return <div className="bug-feedback-error">{error}</div>;
  }

  return (
    <div className="bug-feedback-container">
       <h1 className="bug-feedback-header">Feedback Details</h1>
           {/* Search input */}
           <div className="bug-feedback-search">
        <input
          type="text"
          placeholder="Search feedback..."
          value={filterText}  // Updated to filterText
          onChange={(e) => setFilterText(e.target.value)}  // Updated to setFilterText
          className="bug-feedback-search-input"
        />
      </div>
     
      <div className="bug-feedback-table-wrapper">
      <table className="bug-feedback-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Feedback</th>
            <th>Email</th>
            <th>Name</th>
            <th>Date</th>
            <th>Page Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbackData.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-results-message">No results found</td>
            </tr>
          ) : (
            filteredFeedbackData.map((item) => (
              <tr key={item.FeedbackID}>
                <td>{item.FeedbackID}</td>
                <td>{item.Comment || 'No comment provided'}</td>
                <td>{item.UserEmail || 'N/A'}</td>
                <td>{item.LastName} {item.FirstName}</td>
                <td>
                  {item.SubmittedDate
                    ? new Date(item.SubmittedDate).toLocaleString()
                    : 'Invalid date'}
                </td>
                <td>{item.FeedbackPage || 'Unknown'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
   
    </div>
  );
};

export default Feedback;
