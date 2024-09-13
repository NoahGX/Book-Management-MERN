import React, { useEffect, useState, useMemo } from 'react';
// Import axios for making HTTP requests
import axios from 'axios';
// useParams allows us to retrieve dynamic URL parameters like book id
import { useParams } from 'react-router-dom';
// Import the BackButton component to navigate to the previous page
import BackButton from '../components/BackButton';
// Import Spinner component to show a loading indicator
import Spinner from '../components/Spinner';

// Define API URL from environment variables or localhost
const API_URL = 'http://localhost:3000';

// Custom hook for fetching book details
const useBookDetails = (id) => {
  // State variable for storing the book data
  const [book, setBook] = useState({});
  // Loading state to show spinner while fetching data
  const [loading, setLoading] = useState(false);
  // Error state to handle and display error messages
  const [error, setError] = useState(null);

  // useEffect hook to fetch book details when component mounts or when 'id' changes
  useEffect(() => {
    // Function to fetch book details
    const fetchBook = async () => {
      // Start loading before making the API request
      setLoading(true);
      try {
        // Make GET request to fetch book details using 'id'
        // Set the book data on successful response
        const response = await axios.get(`${API_URL}/books/${id}`);
        setBook(response.data);
      } catch (error) {
        // Set error message if request fails
        setError('Failed to load book details. Please try again later.');
        // Log error for debugging
        console.log(error);
      } finally {
        // Stop loading spinner after the request completes
        setLoading(false);
      }
    };
    
    // Call the fetchBook function to load book data on component mount
    // Dependency array contains `id`, meaning the effect will run again if `id` changes
    fetchBook();
  }, [id]);

  // Return book details, loading, and error states
  return { book, loading, error, setError };
};

// Component for displaying individual book detail with a label and value
const BookDetail = ({ label, value }) => (
  <div className='my-4'>
    <span className='text-xl mr-4 text-gray-500'>{label}</span>
    <span>{value}</span>
  </div>
);

const ShowBook = () => {
  // Extract the 'id' parameter from the URL using useParams
  const { id } = useParams(); 
  // Use the custom hook to get the book details, loading state, and error state
  const { book, loading, error, setError } = useBookDetails(id);
  // Memoize the formatted creation and update dates to avoid recalculating on every render
  const formattedCreatedAt = useMemo(() => new Date(book.createdAt).toString(), [book.createdAt]);
  const formattedUpdatedAt = useMemo(() => new Date(book.updatedAt).toString(), [book.updatedAt]);

  // Function to retry fetching book details in case of an error
  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className='p-4'>
      {/* BackButton component allows user to navigate back to the previous page */}
      <BackButton />

      {/* Page title */}
      <h1 className='text-3xl my-4'>Show Book</h1>

      {/* Conditional rendering: Show error message or loading spinner */}
      {error ? (
        <div className='text-red-500'>
          {error}
          {/* Retry button allows user to try fetching the book details again */}
          <button className='text-blue-500 underline' onClick={handleRetry}>
            Retry
          </button>
        </div>
      ) : loading ? (
        // Show spinner while data is being fetched
        <Spinner/>
      ) : (
        // Show book details when loading is complete and there is no error
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
          {/* Using the BookDetail component to display book details */}
          <BookDetail label="ID" value={book._id || 'N/A'}/>
          <BookDetail label="Title" value={book.title || 'N/A'}/>
          <BookDetail label="Author" value={book.author || 'N/A'}/>
          <BookDetail label="Publish Year" value={book.publishYear || 'N/A'}/>
          <BookDetail label="Create Time" value={formattedCreatedAt}/>
          <BookDetail label="Last Update Time" value={formattedUpdatedAt}/>
        </div>
      )}
    </div>
  );
};

export default ShowBook;