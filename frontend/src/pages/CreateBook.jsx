import React, { useState } from 'react';
// Import axios for making HTTP requests
import axios from 'axios';
// useNavigate hook from react-router-dom to programmatically navigate
import { useNavigate } from 'react-router-dom';
// useSnackbar hook from notistack for showing notification messages
import { useSnackbar } from 'notistack';
// Import the BackButton component to navigate to the previous page
import BackButton from '../components/BackButton';
// Import Spinner component to show a loading indicator
import Spinner from '../components/Spinner';

// Define API URL from environment variables or localhost
const API_URL = 'http://localhost:3000';

// Reusable InputField component for form fields
const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div className='my-4'>
    <label className='text-xl mr-4 text-gray-500'>{label}</label>
    <input
      type={type}  // Set input type (e.g., 'text', 'number')
      value={value}  // Bind the input value to the state variable
      onChange={onChange}  // Update the state when input changes
      className='border-2 border-gray-500 px-4 py-2 w-full'/>
  </div>
);

const CreateBook = () => {
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

  // Function to handle saving the book
  const handleSaveBook = async () => {
    // Basic validation to ensure all fields are filled
    // Show warning if any field is empty
    if (!title || !author || !publishYear) {
      enqueueSnackbar('All fields are required', { variant: 'warning' });
      return;
    }

    // Validation to ensure publishYear is a valid number
    // Show warning for invalid publish year
    if (isNaN(publishYear) || publishYear < 0) {
      enqueueSnackbar('Publish Year must be a valid positive number', { variant: 'warning' });
      return;
    }

    // Create the data object with form values
    // Set loading to true to show the spinner
    const data = { title, author, publishYear };
    setLoading(true);

    try {
      // Make POST request to create the new book
      await axios.post(`${API_URL}/books`, data);
      // Display success notification
      enqueueSnackbar('Book Created Successfully.', { variant: 'success' });
      // After success, reset form fields and navigate to the home page
      setTitle('');
      setAuthor('');
      setPublishYear('');
      navigate('/');
    } catch (error) {
      // Error handling: Display error message if the request fails
      const errorMessage = error.response?.data?.message || 'Error creating the book';
      // Display error noticiation
      enqueueSnackbar(errorMessage, { variant: 'error' });
      // Log error to the console for debugging
      console.log(error);
    } finally {
      // Set loading to false to hide the spinner
      setLoading(false);
    }
  };

  return (
    <div className='p-4'>
      {/* BackButton component allows user to navigate back to the previous page */}
      <BackButton/>

      {/* Page title */}
      <h1 className='text-3xl my-4'>Create Book</h1>

      {/* Show spinner when loading */}
      {loading && <Spinner/>}

      {/* Form container with styling using Tailwind CSS */}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        {/* Input fields for book title, author, and publish year using reusable InputField component */}
        <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <InputField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)}/>
        <InputField label="Publish Year" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} type="number"/>
        {/* Save button, disabled when loading to prevent multiple requests */}
        <button
          className='p-2 bg-sky-300 m-8'
          onClick={handleSaveBook}
          disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default CreateBook;