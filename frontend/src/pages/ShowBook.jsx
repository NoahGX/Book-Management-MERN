import React, { useEffect, useState, useMemo } from 'react'; // Import React, useEffect for side effects, useState for state management, and useMemo for memoizing values
import axios from 'axios'; // Import axios to make HTTP requests
import { useParams } from 'react-router-dom'; // useParams allows us to retrieve dynamic URL parameters (e.g., book id)
import BackButton from '../components/BackButton'; // BackButton component to navigate back to the previous page
import Spinner from '../components/Spinner'; // Spinner component to indicate loading state

// Use environment variable for the API URL, with fallback to localhost for development
const API_URL = 'http://localhost:3000';

// Reusable component for displaying a label-value pair for book details
// Props: label (field name), value (field value)
const BookDetail = ({ label, value }) => (
  <div className='my-4'> {/* Adds margin to space out the details */}
    <span className='text-xl mr-4 text-gray-500' aria-label={label}>{label}</span> {/* Display label for the book detail */}
    <span>{value}</span> {/* Display the actual value of the book detail */}
  </div>
);

const ShowBook = () => {
  const [book, setBook] = useState({}); // State to hold the book details (initially an empty object)
  const [loading, setLoading] = useState(false); // State to track the loading status (false initially, true when fetching data)
  const [error, setError] = useState(null); // State to store any error message in case the API call fails
  const { id } = useParams(); // Extract 'id' from the URL parameters using useParams hook. 'id' refers to the book's unique identifier

  // Memoize the formatted creation date to prevent unnecessary recalculations
  const createdAtFormatted = useMemo(() => new Date(book.createdAt).toString(), [book.createdAt]);
  // Memoize the formatted update date to prevent unnecessary recalculations
  const updatedAtFormatted = useMemo(() => new Date(book.updatedAt).toString(), [book.updatedAt]);

  // useEffect to fetch the book details when the component mounts (or when 'id' changes)
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true); // Set loading state to true to show the spinner
      try {
        // Make a GET request to fetch the book details from the API
        const response = await axios.get(`${API_URL}/books/${id}`); // Dynamic URL with the book id from useParams
        setBook(response.data); // Set the fetched book details in the book state
      } catch (error) {
        // If an error occurs, log it and set an error message
        console.log(error); 
        setError('An error occurred while fetching the book details.'); // Set a user-friendly error message
      } finally {
        setLoading(false); // Whether success or error, set loading to false to stop showing the spinner
      }
    };

    fetchBook(); // Call the async function to fetch book data
  }, [id]); // useEffect dependency on 'id' ensures it runs whenever the 'id' changes

  return (
    <div className='p-4'>
      {/* Render BackButton to allow the user to navigate back to the previous page */}
      <BackButton />
      {/* Page title for showing the book details */}
      <h1 className='text-3xl my-4'>Show Book</h1>

      {/* Conditional rendering based on loading and error state */}
      {loading ? (
        // If the component is in loading state, show the spinner
        <Spinner />
      ) : error ? (
        // If there's an error, show the error message in red
        <div className="text-red-500">{error}</div>
      ) : (
        // If no error and not loading, display the book details
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'> {/* Flex column layout, border, padding, rounded corners */}
          {/* Display individual book details using the reusable BookDetail component */}
          <BookDetail label="Id" value={book._id} /> {/* Show the book's unique ID */}
          <BookDetail label="Title" value={book.title} /> {/* Show the book's title */}
          <BookDetail label="Author" value={book.author} /> {/* Show the author's name */}
          <BookDetail label="Publish Year" value={book.publishYear} /> {/* Show the publish year */}
          <BookDetail label="Create Time" value={createdAtFormatted} /> {/* Show the book creation time in a formatted string */}
          <BookDetail label="Last Update Time" value={updatedAtFormatted} /> {/* Show the book last update time in a formatted string */}
        </div>
      )}
    </div>
  );
};

export default ShowBook; // Export the ShowBook component to use in other parts of the app