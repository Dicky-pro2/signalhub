// src/components/SecretCombo.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSecretAdminCombo = () => {
  const [keys, setKeys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+A (or Cmd+Shift+A on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        // Trigger admin login modal or redirect
        const adminModal = document.getElementById('admin-login-modal');
        if (adminModal) {
          adminModal.classList.remove('hidden');
        } else {
          navigate('/admin/login');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
};