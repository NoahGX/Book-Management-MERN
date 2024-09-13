import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { useSnackbar } from 'notistack'; // useSnackbar hook from notistack for showing notification messages
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate allows navigation, useParams fetches route parameters
import BackButton from '../components/BackButton'; // Import the BackButton component to navigate to the previous page
import Spinner from '../components/Spinner'; // Import Spinner component to show a loading indicator

// Use environment variable for API URL or fallback to localhost during development
const API_URL = 'http://localhost:3000';

// Reusable component for form input fields
// Props: label (the name of the input), value (input value), onChange (handler to update the value), type (input type, default is 'text')
const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div className='my-4'>
    <label className='text-xl mr-4 text-gray-500'>{label}</label> {/* Label for the input field */}
    <input
      type={type} // Set the type of input (text, number, etc.)
      value={value} // Bind the input value to the state
      onChange={onChange} // Update the state when the user types
      className='border-2 border-gray-500 px-4 py-2 w-full' // Styling for the input field
    />
  </div>
);

const EditBook = () => {
  // Define state variables for book details and loading status
  const [title, setTitle] = useState(''); // State to store the title of the book
  const [author, setAuthor] = useState(''); // State to store the author name
  const [publishYear, setPublishYear] = useState(''); // State to store the publish year
  const [loading, setLoading] = useState(false); // State to track loading status (true while fetching or saving data)

  // Hook to navigate programmatically after successful save (e.g., to redirect to the homepage)
  const navigate = useNavigate();

  // Hook to extract the book `id` from the URL parameters
  const { id } = useParams();

  // useSnackbar hook for showing notifications (success or error) to the user
  const { enqueueSnackbar } = useSnackbar();

  // Fetch the book details when the component first renders (on mount)
  useEffect(() => {
    // Define async function to fetch the book data by id
    const fetchBook = async () => {
      setLoading(true); // Set loading to true to show the spinner while fetching data
      try {
        // Make GET request to fetch book details from the API using the book's id
        const response = await axios.get(`${API_URL}/books/${id}`);
        // Update the state variables with the fetched data
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setPublishYear(response.data.publishYear);
      } catch (error) {
        // If there's an error during the API call, show an error notification
        enqueueSnackbar('Failed to load book details. Please try again.', { variant: 'error' });
        console.log(error); // Log the error for debugging purposes
      } finally {
        setLoading(false); // Stop loading once the API request completes
      }
    };

    fetchBook(); // Call the fetchBook function to load book data on component mount
  }, [id]); // Dependency array contains `id`, meaning the effect will run again if `id` changes

  // Function to handle form submission when the user saves the edited book
  const handleEditBook = () => {
    // Basic validation: Check if all fields are filled out
    if (!title || !author || !publishYear) {
      enqueueSnackbar('All fields are required', { variant: 'warning' }); // Show warning notification if any field is empty
      return; // Exit the function if validation fails
    }

    // Validate that `publishYear` is a valid positive number
    if (isNaN(publishYear) || publishYear < 0) {
      enqueueSnackbar('Publish Year must be a valid positive number', { variant: 'warning' }); // Show warning if publish year is invalid
      return; // Exit the function if validation fails
    }

    // Create a data object with the updated book details
    const data = { title, author, publishYear };

    setLoading(true); // Set loading to true to indicate the form is being submitted

    // Make PUT request to update the book details on the server
    axios
      .put(`${API_URL}/books/${id}`, data) // Send the updated data to the server
      .then(() => {
        setLoading(false); // Stop loading when the request is successful
        enqueueSnackbar('Book Edited Successfully', { variant: 'success' }); // Show success notification
        navigate('/'); // Navigate back to the homepage or book list after successful edit
      })
      .catch((error) => {
        setLoading(false); // Stop loading if there's an error during the request
        enqueueSnackbar('Failed to edit the book. Please try again.', { variant: 'error' }); // Show error notification
        console.log(error); // Log the error for debugging purposes
      });
  };

  return (
    <div className='p-4'>
      {/* Render BackButton to allow the user to navigate back to the previous page */}
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
          
          {/* Save button, disabled while the form is being submitted */}
          <button
            className='p-2 bg-sky-300 m-8'
            onClick={handleEditBook}
            disabled={loading} // Disable the button while loading to prevent multiple submissions
          >
            {loading ? 'Saving...' : 'Save'} {/* Show 'Saving...' while the form is being submitted */}
          </button>
        </div>
      )}
    </div>
  );
};

export default EditBook;