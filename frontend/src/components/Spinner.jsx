import React from 'react';

// Spinner functional component
const Spinner = ({
  // Size prop defines the width and height
  size = 16,
  // Color prop defines the background color
  color = 'sky-600',
  // Margin prop defines the margin around the spinner
  margin = 8,
  // Animation prop defines the animation class
  animation = 'animate-ping'
}) => {
  return (
    <div
      className={`${animation} w-${size} h-${size} m-${margin} rounded-full bg-${color}`}
      // Identifies the element as a status indicator
      role="status"
      aria-label="Loading">
    </div>
  );
};

export default Spinner;