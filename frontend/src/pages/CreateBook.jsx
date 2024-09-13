import React, { useState } from 'react';
import axios from 'axios';  // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';  // useNavigate hook from react-router-dom to programmatically navigate
import { useSnackbar } from 'notistack';  // useSnackbar hook from notistack for showing notification messages
import BackButton from '../components/BackButton';  // Import the BackButton component to navigate to the previous page
import Spinner from '../components/Spinner';  // Import Spinner component to show a loading indicator

// Define API URL from environment variables or localhost
const API_URL = 'http://localhost:3000';

// Reusable InputField component for form fields
const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div className='my-4'>
    <label className='text-xl mr-4 text-gray-500'>{label}</label> {/* Display the label */}
    <input
      type={type}  // Input type (e.g., 'text', 'number')
      value={value}  // Bind the input value to the corresponding state variable
      onChange={onChange}  // Update the state when input changes
      className='border-2 border-gray-500 px-4 py-2 w-full'
    />
  </div>
);

const CreateBook = () => {
  // State variables for form fields (title, author, and publishYear)
  const [title, setTitle] = useState('');  // State for book title
  const [author, setAuthor] = useState('');  // State for book author
  const [publishYear, setPublishYear] = useState('');  // State for publish year
  const [loading, setLoading] = useState(false);  // State to manage loading state
  const navigate = useNavigate();  // useNavigate hook to programmatically navigate to another page
  const { enqueueSnackbar } = useSnackbar();  // useSnackbar hook to show notification messages

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
    const data = { title, author, publishYear };
    setLoading(true);  // Set loading to true to show the spinner

    try {
      // Make POST request to create the new book
      await axios.post(`${API_URL}/books`, data);
      enqueueSnackbar('Book Created Successfully.', { variant: 'success' });  // Show success notification
      setTitle('');  // Reset form fields after success
      setAuthor('');
      setPublishYear('');
      navigate('/');  // Navigate to the home page after successful book creation
    } catch (error) {
      // Error handling: Display error message if the request fails
      const errorMessage = error.response?.data?.message || 'Error creating the book';
      enqueueSnackbar(errorMessage, { variant: 'error' });  // Show error notification
      console.log(error);  // Log error to the console for debugging
    } finally {
      setLoading(false);  // Set loading to false to hide the spinner
    }
  };

  return (
    <div className='p-4'>
      {/* BackButton component allows user to navigate back */}
      <BackButton />

      {/* Page title */}
      <h1 className='text-3xl my-4'>Create Book</h1>

      {/* Show spinner when loading */}
      {loading && <Spinner />}

      {/* Form container with styling using Tailwind CSS */}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        {/* Input fields for book title, author, and publish year using reusable InputField component */}
        <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <InputField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <InputField label="Publish Year" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} type="number" />

        {/* Save button, disabled when loading */}
        <button
          className='p-2 bg-sky-300 m-8'
          onClick={handleSaveBook}
          disabled={loading}  // Disable button while loading
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default CreateBook;