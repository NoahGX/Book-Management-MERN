// Import Link component for navigation
import { Link } from 'react-router-dom';
// Import default arrow icon from react-icons
import { BsArrowLeft } from 'react-icons/bs';

// BackButton functional component
const BackButton = ({
  // Default destination is the root URL ("/")
  destination = '/',
  icon: Icon = BsArrowLeft,
  iconSize = 'text-2xl',
  buttonColor = 'bg-sky-800',
  textColor = 'text-white',
  ariaLabel = 'Go back'
}) => {
  // If destination is not provided, do not render button
  if (!destination) return null;

  return (
    // Flexbox container for aligning the button properly
    <div className='flex'> 
      {/* Link navigates to the specified destination */}
      <Link to={destination}
        className={`${buttonColor} ${textColor} px-4 py-1 rounded-lg w-fit`}
        aria-label={ariaLabel}>
        <Icon className={iconSize}/>
      </Link>
    </div>
  );
};

export default BackButton;