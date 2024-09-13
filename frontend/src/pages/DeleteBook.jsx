import React, { useState } from 'react';
// Import axios for making HTTP requests
import axios from 'axios';
// useSnackbar hook from notistack for showing notification messages
import { useSnackbar } from 'notistack';
// useNavigate allows navigation, useParams fetches route parameters
import { useNavigate, useParams } from 'react-router-dom';
// Import the BackButton component to navigate to the previous page
import BackButton from '../components/BackButton';
// Import Spinner component to show a loading indicator
import Spinner from '../components/Spinner';

// Define API URL from environment variables or localhost
const API_URL = 'http://localhost:3000';

const DeleteBook = () => {
  // State to track the loading status.
  const [loading, setLoading] = useState(false);
  // Hook to navigate programmatically, redirects the user after successful deletion
  const navigate = useNavigate();
  // Destructure the `id` parameter, ID corresponds to the book being deleted
  const { id } = useParams();
  // Destructure enqueueSnackbar from useSnackbar to display feedback messages
  const { enqueueSnackbar } = useSnackbar();

  // Function that handles the deletion of the book
  const handleDeleteBook = () => {
    // Confirmation dialog to avoid accidental deletion of the book
    // If the user cancels, exit the function without proceeding with deletion
    const confirmation = window.confirm("Are you sure you want to delete this book?");
    if (!confirmation) return;

    // Set loading state to true
    // This will show spinner and disable UI interactions while request is processed
    setLoading(true);

    // Send DELETE request to the server to delete the book with the given ID
    axios.delete(`${API_URL}/books/${id}`)
      .then(() => {
        // Once the deletion is successful:
        // Stop the loading spinner
        setLoading(false);
        // Show success notification
        enqueueSnackbar('Book Deleted Successfully.', { variant: 'success' });
        // Redirect the user to the home page
        navigate('/');
      }).catch((error) => {
        // If an error occurs during the request:
        // Stop the loading spinner
        setLoading(false);
        // Use specific or custom error message
        const errorMessage = error.response?.data?.message || 'An error occurred while deleting the book.';
        // Display an error notification
        enqueueSnackbar(errorMessage, { variant: 'error' });
        // Log the error details to the console for debugging
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      {/* BackButton component allows user to navigate back to the previous page */}
      <BackButton/>
      
      {/* Heading for the delete confirmation page */}
      <h1 className='text-3xl my-4'>Delete Book</h1>
      
      {/* Conditional rendering: Show spinner while the deletion is in progress */}
      {loading ? <Spinner/> : null} 

      {/* Confirmation UI: Contains the confirmation text and delete button */}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        {/* Confirmation message asking the user if they're sure about deleting the book */}
        <h3 className='text-2xl'>Are You Sure?</h3>
        {/* Delete button, triggers the handleDeleteBook function on click */}
        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteBook}
          // Disable button while process is ongoing to prevent multiple requests
          disabled={loading}>
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;