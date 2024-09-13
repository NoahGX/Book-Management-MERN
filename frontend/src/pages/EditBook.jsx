import React, { useState, useEffect } from 'react';
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

// Reusable component for form input fields
const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div className='my-4'>
    <label className='text-xl mr-4 text-gray-500'>{label}</label>
    <input
      type={type}  // Set input type (e.g., 'text', 'number')
      value={value}  // Bind the input value to the state variable
      onChange={onChange}  // Update the state when the user types
      className='border-2 border-gray-500 px-4 py-2 w-full'
    />
  </div>
);

const EditBook = () => {
  // State variable to store the title of the book
  const [title, setTitle] = useState('');
  // State variable to store the author name
  const [author, setAuthor] = useState('');
  // State variableto store the publish year
  const [publishYear, setPublishYear] = useState('');
  // State variable to track loading status (true while fetching or saving data)
  const [loading, setLoading] = useState(false);
  // useNavigate hook to navigate to another page
  const navigate = useNavigate();
  // useSnackbar hook to show notification messages
  const { enqueueSnackbar } = useSnackbar();
  // Hook to extract the book `id` from the URL parameters
  const { id } = useParams();

  // Fetch the book details when the component first renders (on mount)
  useEffect(() => {
    // Define async function to fetch the book data by id
    const fetchBook = async () => {

      // Set loading to true to show the spinner while fetching data
      setLoading(true);
      
      try {
        // Make GET request to fetch book details from the API using the book's id
        const response = await axios.get(`${API_URL}/books/${id}`);
        // Update the state variables with the fetched data
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setPublishYear(response.data.publishYear);
      } catch (error) {
        // If there's an error during the API call, show error notification
        // Log error to the console for debugging
        enqueueSnackbar('Failed to load book details. Please try again.', { variant: 'error' });
        console.log(error);
      } finally {
        // Set loading to false to hide the spinner
        setLoading(false);
      }
    };

    // Call the fetchBook function to load book data on component mount
    // Dependency array contains `id`, meaning the effect will run again if `id` changes
    fetchBook();
  }, [id]);

  // Function to handle form submission when the user saves the edited book
  const handleEditBook = () => {
    // Basic validation: Check if all fields are filled out
    if (!title || !author || !publishYear) {
      // Show warning notification if any field is empty
      // Exit the function if validation fails
      enqueueSnackbar('All fields are required', { variant: 'warning' });
      return;
    }

    // Validate that `publishYear` is a valid positive number
    if (isNaN(publishYear) || publishYear < 0) {
      // Show warning if publish year is invalid
      // Exit the function if validation fails
      enqueueSnackbar('Publish Year must be a valid positive number', { variant: 'warning' });
      return;
    }

    // Create a data object with the updated book details
    const data = { title, author, publishYear };
    // Set loading to true to indicate the form is being submitted
    setLoading(true);

    // Make PUT request to update the book details on the server
    // Send the updated data to the server
    axios.put(`${API_URL}/books/${id}`, data)
      .then(() => {
        // Stop loading when the request is successful
        setLoading(false);
        // Show success notification
        enqueueSnackbar('Book Edited Successfully', { variant: 'success' });
        // Navigate back to the homepage
        navigate('/');
      }).catch((error) => {
        // Stop loading if there's an error during the request
        setLoading(false);
        // Show error notification
        enqueueSnackbar('Failed to edit the book. Please try again.', { variant: 'error' });
        // Log the error for debugging purposes
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      {/* BackButton component allows user to navigate back to the previous page */}
      <BackButton />
      
      {/* Page title */}
      <h1 className='text-3xl my-4'>Edit Book</h1>
      
      {/* Conditional rendering: Show spinner while loading, otherwise show the form */}
      {loading ? <Spinner /> : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
          
          {/* Input fields for title, author, and publish year */}
          <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <InputField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <InputField label="Publish Year" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} type="number" />
          
          {/* Save button, disabled when loading to prevent multiple requests */}
          <button
            className='p-2 bg-sky-300 m-8'
            onClick={handleEditBook}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EditBook;