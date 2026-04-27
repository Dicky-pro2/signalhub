// src/context/ColorContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ColorContext = createContext();

// Define all available themes
const themes = {
  // Current Orange Theme
  orange: {
    name: 'Orange',
    primary: '#f97316',
    primaryDark: '#ea580c',
    primaryLight: '#ffedd5',
    primaryMuted: '#f97316/20',
    gradient: 'from-orange-500 to-red-500',
    gradientHover: 'from-orange-600 to-red-600',
    shadow: 'shadow-orange-500/25',
    badge: 'bg-orange-500/20 text-orange-500',
    hover: 'hover:bg-orange-600',
    ring: 'ring-orange-500',
    border: 'border-orange-500',
    text: 'text-orange-500',
    bg: 'bg-orange-500',
  },
  
  // Lemon/Neon Theme
  lemon: {
    name: 'Lemon',
    primary: '#eab308',
    primaryDark: '#ca8a04',
    primaryLight: '#fefce8',
    primaryMuted: '#eab308/20',
    gradient: 'from-yellow-500 to-lime-500',
    gradientHover: 'from-yellow-600 to-lime-600',
    shadow: 'shadow-yellow-500/25',
    badge: 'bg-yellow-500/20 text-yellow-500',
    hover: 'hover:bg-yellow-600',
    ring: 'ring-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-500',
    bg: 'bg-yellow-500',
  },
  
  // Cyberpunk Theme
  cyberpunk: {
    name: 'Cyberpunk',
    primary: '#d946ef',
    primaryDark: '#c026d3',
    primaryLight: '#fae8ff',
    primaryMuted: '#d946ef/20',
    gradient: 'from-fuchsia-500 to-cyan-500',
    gradientHover: 'from-fuchsia-600 to-cyan-600',
    shadow: 'shadow-fuchsia-500/25',
    badge: 'bg-fuchsia-500/20 text-fuchsia-500',
    hover: 'hover:bg-fuchsia-600',
    ring: 'ring-fuchsia-500',
    border: 'border-fuchsia-500',
    text: 'text-fuchsia-500',
    bg: 'bg-fuchsia-500',
  },
  
  // Terminal Green
  terminal: {
    name: 'Terminal',
    primary: '#22c55e',
    primaryDark: '#16a34a',
    primaryLight: '#f0fdf4',
    primaryMuted: '#22c55e/20',
    gradient: 'from-green-500 to-emerald-500',
    gradientHover: 'from-green-600 to-emerald-600',
    shadow: 'shadow-green-500/25',
    badge: 'bg-green-500/20 text-green-500',
    hover: 'hover:bg-green-600',
    ring: 'ring-green-500',
    border: 'border-green-500',
    text: 'text-green-500',
    bg: 'bg-green-500',
  },
  
  // Electric Blue
  electric: {
    name: 'Electric',
    primary: '#06b6d4',
    primaryDark: '#0891b2',
    primaryLight: '#ecfeff',
    primaryMuted: '#06b6d4/20',
    gradient: 'from-cyan-500 to-blue-500',
    gradientHover: 'from-cyan-600 to-blue-600',
    shadow: 'shadow-cyan-500/25',
    badge: 'bg-cyan-500/20 text-cyan-500',
    hover: 'hover:bg-cyan-600',
    ring: 'ring-cyan-500',
    border: 'border-cyan-500',
    text: 'text-cyan-500',
    bg: 'bg-cyan-500',
  },
  
  // Purple Royal
  purple: {
    name: 'Purple',
    primary: '#8b5cf6',
    primaryDark: '#7c3aed',
    primaryLight: '#ede9fe',
    primaryMuted: '#8b5cf6/20',
    gradient: 'from-purple-500 to-pink-500',
    gradientHover: 'from-purple-600 to-pink-600',
    shadow: 'shadow-purple-500/25',
    badge: 'bg-purple-500/20 text-purple-500',
    hover: 'hover:bg-purple-600',
    ring: 'ring-purple-500',
    border: 'border-purple-500',
    text: 'text-purple-500',
    bg: 'bg-purple-500',
  },
};

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColor must be used within ColorProvider');
  }
  return context;
};

export const ColorProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('colorTheme');
    return saved && themes[saved] ? saved : 'lemon'; // Default to lemon now
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('colorTheme', theme);
    // Add theme class to body for global styles
    document.body.className = document.body.className.replace(/theme-\w+/, '');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const currentTheme = themes[theme];

  // Helper function to get dynamic class names
  const getColorClass = (type, customClass = '') => {
    const colorMap = {
      primary: currentTheme.bg,
      primaryText: currentTheme.text,
      primaryBorder: currentTheme.border,
      primaryRing: currentTheme.ring,
      primaryHover: currentTheme.hover,
      primaryBadge: currentTheme.badge,
      primaryGradient: currentTheme.gradient,
      primaryGradientHover: currentTheme.gradientHover,
      primaryShadow: currentTheme.shadow,
    };
    
    const colorClass = colorMap[type] || '';
    return `${colorClass} ${customClass}`.trim();
  };

  const value = {
    theme,
    setTheme,
    themes,
    currentTheme,
    getColorClass,
    isOpen,
    setIsOpen,
  };

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
};