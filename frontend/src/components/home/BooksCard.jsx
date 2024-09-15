import React, { memo } from 'react';
 // Import PropTypes for runtime type checking
import PropTypes from 'prop-types';
import BookSingleCard from './BookSingleCard';

// Renders a grid of BookSingleCard components, one for each book in the `books` array
// The component is memoized to avoid unnecessary re-renders if props haven't changed
const BooksCard = memo(({ books }) => {
  // If no books are available, notify user
  if (!books?.length) {
    return <div>No books available</div>;
  }

  // Return the grid layout with BookSingleCard components for each book
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {books.map((item) => (
        // Key is important for React to track and optimize re-rendering
        <BookSingleCard key={item._id} book={item} />
      ))}
    </div>
  );
});

// PropTypes for runtime validation of component props
BooksCard.propTypes = {
  // The `books` prop is required and must be an array of objects with the fields below
  books: PropTypes.arrayOf(
    PropTypes.shape({
      // Validate that id, title, and author are required strings
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      // Validate that yearPublished is a number
      yearPublished: PropTypes.number,
    })
  ).isRequired,
};

export default BooksCard;