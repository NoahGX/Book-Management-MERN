import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';

const ToggleButton = ({ onClick, label, active }) => (
  <button
    className={`px-4 py-1 rounded-lg ${active ? 'bg-sky-600' : 'bg-sky-300 hover:bg-sky-600'}`}
    onClick={onClick}
  >
    {label}
  </button>
);

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get('http://localhost:3000/books')
      .then((response) => {
        if (isMounted) {
          setBooks(response.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setError('Failed to fetch books.');
          setLoading(false);
        }
      });
  
    return () => {
      isMounted = false;  // Clean up when the component unmounts
    };
  }, []);

  return (
    <div className='p-4'>
      <div className="flex justify-center items-center gap-x-4">
        <ToggleButton 
          onClick={() => setShowType('table')} 
          label="Table" 
          active={showType === 'table'} 
        />
        <ToggleButton 
          onClick={() => setShowType('card')} 
          label="Card" 
          active={showType === 'card'} 
        />
      </div>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Books List</h1>
        <Link to='/books/create'>
          <MdOutlineAddBox className='text-sky-800 text-4xl' />
        </Link>
      </div>
      
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : loading ? (
        <Spinner />
      ) : showType === 'table' ? (
        <BooksTable books={books} />
      ) : (
      <BooksCard books={books} />
    )}
    </div>
  );
};

export default Home;