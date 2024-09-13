import React, { useEffect, useState, memo } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';

// Environment variable for API URL (fallback to localhost if not set)
const API_URL = 'http://localhost:3000';

// Reusable ToggleButton component for switching between table and card views
// Props: onClick (callback), label (button text), active (boolean to set active state), and loading (to disable button during loading)
const ToggleButton = ({ onClick, label, active, loading }) => (
  <button
    disabled={loading} // Disable button during loading
    className={`px-4 py-1 rounded-lg ${active ? 'bg-sky-600' : 'bg-sky-300 hover:bg-sky-600'}`} // Dynamic class for active/inactive state
    onClick={onClick}
  >
    {label}
  </button>
);

// Memoized BooksTable component to prevent unnecessary re-renders
const MemoizedBooksTable = memo(({ books }) => <BooksTable books={books} />);

// Memoized BooksCard component to prevent unnecessary re-renders
const MemoizedBooksCard = memo(({ books }) => <BooksCard books={books} />);

const Home = () => {
  // State to store the list of books fetched from the API
  const [books, setBooks] = useState([]);
  // Loading state to manage spinner visibility
  const [loading, setLoading] = useState(false);
  // Error state to display errors when data fetching fails
  const [error, setError] = useState(null);
  // State to toggle between 'table' and 'card' view modes
  const [showType, setShowType] = useState('table');

  // useEffect to fetch books data from the API when the component mounts
  // Added cleanup to prevent updating state if the component is unmounted before the fetch completes
  useEffect(() => {
    let isMounted = true; // To check if the component is still mounted

    // Async function to fetch books from the API
    const fetchBooks = async () => {
      setLoading(true); // Set loading to true before fetching data
      setError(null);   // Clear previous errors
      try {
        const response = await axios.get(`${API_URL}/books`); // API call to fetch books
        if (isMounted) {
          setBooks(response.data.data); // Set books data if the component is still mounted
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to fetch books. Please try again later.'); // Set error message if the API request fails
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Turn off loading spinner after the fetch completes
        }
      }
    };

    fetchBooks(); // Invoke the async function to fetch books on component mount

    // Cleanup function to prevent memory leaks by ensuring state is not updated after unmount
    return () => {
      isMounted = false; 
    };
  }, []); // Empty dependency array to ensure this runs only once when the component mounts

  // Function to conditionally render content based on the current state (loading, error, showType)
  const renderContent = () => {
    if (error) {
      return <div className="text-red-500">{error}</div>; // Display error message if the API call failed
    }
    if (loading) {
      return <Spinner />; // Show loading spinner while data is being fetched
    }
    // Conditionally render BooksTable or BooksCard based on the value of showType
    return showType === 'table' ? (
      <MemoizedBooksTable books={books} /> // Render BooksTable in table view
    ) : (
      <MemoizedBooksCard books={books} />  // Render BooksCard in card view
    );
  };

  return (
    <div className='p-4'>
      {/* Buttons to toggle between table and card views */}
      <div className='flex justify-center items-center gap-x-4'>
        <ToggleButton 
          onClick={() => setShowType('table')}  // Set showType to 'table' when this button is clicked
          label="Table"                        // Label for the button
          active={showType === 'table'}        // Set active state based on whether 'table' is currently selected
          loading={loading}                    // Disable button during loading
        />
        <ToggleButton 
          onClick={() => setShowType('card')}   // Set showType to 'card' when this button is clicked
          label="Card"                         // Label for the button
          active={showType === 'card'}         // Set active state based on whether 'card' is currently selected
          loading={loading}                    // Disable button during loading
        />
      </div>

      {/* Header section with the title and add button */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Books List</h1>  {/* Page title */}
        <Link to='/books/create'>                     {/* Link to the 'create book' page */}
          <MdOutlineAddBox className='text-sky-800 text-4xl' />  {/* Icon for adding a new book */}
        </Link>
      </div>

      {/* Render content based on the state (error, loading, or data) */}
      {renderContent()}
    </div>
  );
};

export default Home;
