import { Link } from 'react-router-dom';  // Import Link component for navigation
import { BsArrowLeft } from 'react-icons/bs';  // Import default arrow icon from react-icons

// BackButton functional component
const BackButton = ({
  destination = '/',  // Default destination is the root URL ("/")
  icon: Icon = BsArrowLeft,
  iconSize = 'text-2xl',
  buttonColor = 'bg-sky-800',
  textColor = 'text-white',
  ariaLabel = 'Go back'
}) => {
  if (!destination) return null;  // If destination is not provided, do not render button

  return (
    <div className='flex'> 
      {/* Flexbox container for aligning the button properly */}
      
      <Link
        to={destination}  // Link navigates to the specified destination
        // Dynamic class names allow flexible styling for button appearance
        className={`${buttonColor} ${textColor} px-4 py-1 rounded-lg w-fit`}
        aria-label={ariaLabel} // Accessible label for screen readers
      >
        <Icon className={iconSize} />
      </Link>
    </div>
  );
};

export default BackButton;