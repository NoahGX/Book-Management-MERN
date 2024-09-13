import React, { useEffect, useState, memo } from 'react';
// Import axios to make HTTP requests
import axios from 'axios';
 // Import Link for client-side navigation
import { Link } from 'react-router-dom';
// Import an icon from react-icons for UI display
import { MdOutlineAddBox } from 'react-icons/md';
// Import BooksTable component for table display of books
import BooksTable from '../components/home/BooksTable';
// Import BooksCard component for card display of books
import BooksCard from '../components/home/BooksCard';
// Import Spinner component to show a loading indicator
import Spinner from '../components/Spinner';

// Define API URL from environment variables or localhost
const API_URL = 'http://localhost:3000';

// Reusable ToggleButton component for switching between table and card views
const ToggleButton = ({ onClick, label, active, loading }) => (
  <button
    // Disable button during loading
    disabled={loading}
    className={`px-4 py-1 rounded-lg ${active ? 'bg-sky-600' : 'bg-sky-300 hover:bg-sky-600'}`} // Dynamic class for active/inactive state
    onClick={onClick}>
    {label}
  </button>
);

// Memoized BooksTable and BooksCard components to prevent unnecessary re-renders
const MemoizedBooksTable = memo(({ books }) => <BooksTable books={books} />);
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
  useEffect(() => {
    // Check if the component is still mounted
    let isMounted = true;

    // Async function to fetch books from the API
    const fetchBooks = async () => {
      // Set loading to true and clear previous errors
      setLoading(true);
      setError(null);

      try {
        // API call to fetch books
        const response = await axios.get(`${API_URL}/books`);
        // Set books data if the component is still mounted
        if (isMounted) {
          setBooks(response.data.data);
        }
      } catch (error) {
        if (isMounted) {
          // Set error message if the API request fails
          setError('Failed to fetch books. Please try again later.');
        }
      } finally {
        if (isMounted) {
          // Turn off loading spinner after the fetch completes
          setLoading(false);
        }
      }
    };

    // Invoke the async function to fetch books on component mount
    fetchBooks();

    // Cleanup function to prevent memory leaks by ensuring state is not updated after unmount
    return () => {
      isMounted = false; 
    };
  }, []);  // Empty dependency array ensures this runs only once when component mounts

  // Function to conditionally render content based on the current state
  const renderContent = () => {
    if (error) {
      // Display error message if the API call failed
      return <div className="text-red-500">{error}</div>;
    }
    if (loading) {
      // Show loading spinner while data is being fetched
      return <Spinner />;
    }
    // Conditionally render Table or Card based on the value of showType
    return showType === 'table' ? (
      <MemoizedBooksTable books={books}/>
    ) : (
      <MemoizedBooksCard books={books}/>
    );
  };

  return (
    <div className='p-4'>
      {/* Buttons to toggle between table and card views */}
      <div className='flex justify-center items-center gap-x-4'>
        <ToggleButton 
          // Set showType to 'table' when this button is clicked
          onClick={() => setShowType('table')}
          label="Table"
          active={showType === 'table'}
          loading={loading}
        />
        <ToggleButton 
          // Set showType to 'card' when this button is clicked
          onClick={() => setShowType('card')}
          label="Card"
          active={showType === 'card'}
          loading={loading}
        />
      </div>

      {/* Header section with the title and add button */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Books List</h1>
        {/* Link to the 'create book' page */}
        <Link to='/books/create'>
          <MdOutlineAddBox className='text-sky-800 text-4xl' />
        </Link>
      </div>

      {/* Render content based on the state (error, loading, or data) */}
      {renderContent()}
    </div>
  );
};

export default Home;