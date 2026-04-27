// src/components/profile/ProfilePictureUpload.jsx
import { useState, useRef } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function ProfilePictureUpload({ currentAvatar, onAvatarChange, darkMode }) {
  const [avatar, setAvatar] = useState(currentAvatar || null);
  const [hover, setHover] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setAvatar(imageData);
        localStorage.setItem('userAvatar', imageData);
        if (onAvatarChange) onAvatarChange(imageData);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (JPEG, PNG, or GIF)');
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    localStorage.removeItem('userAvatar');
    if (onAvatarChange) onAvatarChange(null);
  };

  const getInitials = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.full_name || user.email || 'User';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
          />
        ) : (
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-orange-500 ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {getInitials()}
          </div>
        )}
        
        {hover && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Icon icon={Icons.Camera} size={24} color="white" />
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg"
        >
          Upload
        </button>
        {avatar && (
          <button
            onClick={removeAvatar}
            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
          >
            Remove
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (Max 2MB)</p>
    </div>
  );
}