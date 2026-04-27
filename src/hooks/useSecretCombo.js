// src/hooks/useSecretCombo.js
import { useState, useEffect } from 'react';

export const useSecretCombo = (comboType = 'admin', onSuccess) => {
  const [pressedKeys, setPressedKeys] = useState([]);
  const [comboDetected, setComboDetected] = useState(false);

  useEffect(() => {
    // Different combo configurations
    const combos = {
      // Admin access: Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac)
      admin: (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A',
      
      // Developer mode: Ctrl+Shift+D
      dev: (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D',
      
      // Secret stats: Ctrl+Shift+S (twice quickly)
      stats: null, // Will handle custom sequence
      
      // Konami code style: Up, Up, Down, Down, Left, Right, Left, Right, B, A
      konami: null, // Will handle sequence
      
      // Custom sequence: e.g., ['a', 'b', 'c', 'enter']
      sequence: null,
    };

    // Handle secret combo detection
    const handleKeyDown = (event) => {
      const { ctrlKey, metaKey, shiftKey, altKey, key } = event;
      
      // === SIMPLE COMBO: Admin Access (Ctrl+Shift+A) ===
      if (comboType === 'admin' && (ctrlKey || metaKey) && shiftKey && key === 'A') {
        event.preventDefault();
        setComboDetected(true);
        if (onSuccess) onSuccess();
        // Reset after 1 second
        setTimeout(() => setComboDetected(false), 1000);
        return;
      }
      
      // === SIMPLE COMBO: Developer Mode (Ctrl+Shift+D) ===
      if (comboType === 'dev' && (ctrlKey || metaKey) && shiftKey && key === 'D') {
        event.preventDefault();
        setComboDetected(true);
        if (onSuccess) onSuccess();
        setTimeout(() => setComboDetected(false), 1000);
        return;
      }
      
      // === SEQUENCE COMBO: Track key sequence ===
      if (comboType === 'sequence' && Array.isArray(onSuccess)) {
        const sequence = onSuccess; // The sequence array is passed as second param
        const newKeys = [...pressedKeys, key.toLowerCase()];
        
        // Keep only last N keys (same length as sequence)
        while (newKeys.length > sequence.length) {
          newKeys.shift();
        }
        
        setPressedKeys(newKeys);
        
        // Check if sequence matches
        const matches = sequence.every((seqKey, idx) => seqKey === newKeys[idx]);
        
        if (matches && newKeys.length === sequence.length) {
          // Trigger custom callback (third param)
          if (typeof onSuccess === 'function') {
            onSuccess();
          } else if (onSuccess.callback) {
            onSuccess.callback();
          }
          setPressedKeys([]);
        }
        
        return;
      }
      
      // === KONAMI CODE COMBO ===
      if (comboType === 'konami') {
        const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
        const keyLower = key.toLowerCase();
        
        let newKeys = [...pressedKeys, keyLower];
        while (newKeys.length > konamiCode.length) {
          newKeys.shift();
        }
        
        setPressedKeys(newKeys);
        
        // Check if sequence matches konami code
        const matches = konamiCode.every((codeKey, idx) => codeKey === newKeys[idx]);
        
        if (matches && newKeys.length === konamiCode.length) {
          if (onSuccess) onSuccess();
          setPressedKeys([]);
        }
        
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [comboType, onSuccess, pressedKeys]);

  return { comboDetected, pressedKeys };
};

// Custom hook for Admin access specifically
export const useSecretAdminCombo = (onSuccess) => {
  const { comboDetected } = useSecretCombo('admin', onSuccess);
  return comboDetected;
};

// Custom hook for custom sequence
export const useSecretSequence = (sequence, onSuccess) => {
  const { pressedKeys } = useSecretCombo('sequence', sequence, onSuccess);
  return { pressedKeys };
};

// Custom hook for Konami code
export const useKonamiCode = (onSuccess) => {
  const { pressedKeys } = useSecretCombo('konami', onSuccess);
  return { pressedKeys };
};