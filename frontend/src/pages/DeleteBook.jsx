import React, { useState } from 'react';
import BackButton from '../components/BackButton'; // Import BackButton component for navigating back to the previous page
import Spinner from '../components/Spinner'; // Import Spinner component to show a loading indicator during asynchronous operations
import axios from 'axios'; // Import axios for making HTTP requests (DELETE in this case)
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate allows programmatic navigation, useParams fetches route parameters like the book ID
import { useSnackbar } from 'notistack'; // useSnackbar hook from notistack for displaying notifications (success/error messages)

// Environment variable for API URL (with fallback to localhost during development)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const DeleteBook = () => {
  // State to track the loading status. Initially false (not loading), true when deletion process is in progress.
  const [loading, setLoading] = useState(false);
  
  // Hook to navigate programmatically. Used to redirect the user after successful deletion.
  const navigate = useNavigate();
  
  // Destructure the `id` parameter from the URL using useParams. This ID corresponds to the book being deleted.
  const { id } = useParams();
  
  // Destructure enqueueSnackbar from useSnackbar to display feedback messages to the user.
  const { enqueueSnackbar } = useSnackbar();

  // Function that handles the deletion of the book
  const handleDeleteBook = () => {
    // Confirmation dialog to avoid accidental deletion of the book.
    const confirmation = window.confirm("Are you sure you want to delete this book?");
    if (!confirmation) return; // If the user cancels, exit the function without proceeding with deletion.

    // Set loading state to true to show the spinner and disable UI interactions while the request is being processed.
    setLoading(true);

    // Send DELETE request to the server to delete the book with the given ID.
    axios
      .delete(`${API_URL}/books/${id}`) // Dynamically inject the book ID into the API URL
      .then(() => {
        // Once the deletion is successful:
        setLoading(false); // Stop the loading spinner
        enqueueSnackbar('Book Deleted Successfully.', { variant: 'success' }); // Show success notification using Snackbar
        navigate('/'); // Redirect the user to the home page or book list after successful deletion
      })
      .catch((error) => {
        // If an error occurs during the request:
        setLoading(false); // Stop the loading spinner
        const errorMessage = error.response?.data?.message || 'An error occurred while deleting the book.'; // Use specific error message if available, otherwise fallback to a generic one
        enqueueSnackbar(errorMessage, { variant: 'error' }); // Display an error notification using Snackbar
        console.log(error); // Log the error details to the console for debugging
      });
  };

  return (
    <div className='p-4'>
      {/* Render BackButton to allow the user to navigate back to the previous page */}
      <BackButton />
      
      {/* Heading for the delete confirmation page */}
      <h1 className='text-3xl my-4'>Delete Book</h1>
      
      {/* Conditional rendering: Show spinner while the deletion is in progress */}
      {loading ? <Spinner /> : null} 

      {/* Confirmation UI: Contains the confirmation text and delete button */}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        {/* Confirmation message asking the user if they're sure about deleting the book */}
        <h3 className='text-2xl'>Are You Sure?</h3>

        {/* Delete button, triggers the handleDeleteBook function on click */}
        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteBook}
          disabled={loading} // Disable the button while the deletion process is ongoing to prevent multiple requests
        >
          {loading ? 'Deleting...' : 'Yes, Delete'} {/* Show "Deleting..." while the book is being deleted, otherwise show "Yes, Delete" */}
        </button>
      </div>
    </div>
  );
};

export default DeleteBook; // Export the DeleteBook component so it can be used elsewhere in the application