// src/components/Icon.jsx
import { useTheme } from '../context/ThemeContext';

export const Icon = ({ icon: IconComponent, size = 20, color, className = '', spin = false, ...props }) => {
  const { darkMode } = useTheme();
  
  // If no icon component is provided, don't render anything
  if (!IconComponent) {
    console.warn('Icon component not provided');
    return null;
  }
  
  const defaultColor = color || (darkMode ? '#ffffff' : '#374151');
  
  return (
    <IconComponent
      size={size}
      color={defaultColor}
      className={`${spin ? 'animate-spin' : ''} ${className}`}
      {...props}
    />
  );
};

export default Icon;