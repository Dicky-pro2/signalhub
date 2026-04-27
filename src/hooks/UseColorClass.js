// src/hooks/useColorClass.js
import { useColor } from '../context/ColorContext';

export const useColorClass = () => {
  const { currentTheme } = useColor();

  const getClass = (type) => {
    const classes = {
      // Buttons
      btnPrimary: `${currentTheme.bg} ${currentTheme.hover} text-white ${currentTheme.shadow}`,
      btnOutline: `border ${currentTheme.border} ${currentTheme.text} hover:${currentTheme.bg} hover:text-white transition`,
      btnGhost: `${currentTheme.text} hover:${currentTheme.bg} hover:text-white transition`,
      
      // Text
      textPrimary: currentTheme.text,
      textGradient: `bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`,
      
      // Backgrounds
      bgPrimary: currentTheme.bg,
      bgPrimaryLight: `bg-${currentTheme.primaryLight}`,
      bgPrimaryMuted: currentTheme.primaryMuted,
      
      // Borders
      borderPrimary: currentTheme.border,
      
      // Badges
      badge: currentTheme.badge,
      
      // Gradients
      gradient: `bg-gradient-to-r ${currentTheme.gradient}`,
      gradientHover: `hover:bg-gradient-to-r ${currentTheme.gradientHover}`,
      
      // Shadow
      shadow: currentTheme.shadow,
      
      // Ring
      ring: currentTheme.ring,
    };
    
    return classes[type] || '';
  };

  return { getClass, currentTheme };
};