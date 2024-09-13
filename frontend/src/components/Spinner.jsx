import React from 'react';

// Spinner functional component
const Spinner = ({
  size = 16,  // Size prop defines the width and height
  color = 'sky-600',  // Color prop defines the background color
  margin = 8,  // Margin prop defines the margin around the spinner
  animation = 'animate-ping' // Animation prop defines the animation class
}) => {
  return (
    <div // Use dynamic class names based on passed props for flexible styling
      className={`${animation} w-${size} h-${size} m-${margin} rounded-full bg-${color}`}
      role="status"  // ARIA role to improve accessibility, identifies the element as a status indicator
      aria-label="Loading"  // Provides an accessible label for screen readers
    ></div>
  );
};

export default Spinner;