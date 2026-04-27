// src/components/ratings/SignalRating.jsx
import { useState, useEffect } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function SignalRating({ signalId, signalName, onRate, darkMode }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);

  // Load existing rating from localStorage
  useEffect(() => {
    const savedRatings = localStorage.getItem('signalRatings');
    if (savedRatings) {
      const ratings = JSON.parse(savedRatings);
      if (ratings[signalId]) {
        setRating(ratings[signalId].rating);
        setSubmitted(true);
      }
    }
  }, [signalId]);

  const handleRate = (value) => {
    setRating(value);
    setShowComment(true);
  };

  const submitRating = () => {
    // Save to localStorage
    const savedRatings = localStorage.getItem('signalRatings');
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};
    
    ratings[signalId] = {
      rating: rating,
      comment: comment,
      date: new Date().toISOString(),
      signalName: signalName
    };
    
    localStorage.setItem('signalRatings', JSON.stringify(ratings));
    setSubmitted(true);
    setShowComment(false);
    
    if (onRate) {
      onRate({ rating, comment });
    }
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
        <Icon icon={Icons.Check} size={14} color="#22c55e" />
        <span className="text-sm text-green-600 dark:text-green-400">
          Rated {rating} stars - Thank you!
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRate(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Icon
              icon={Icons.Star}
              size={20}
              color={(hoverRating || rating) >= star ? '#eab308' : darkMode ? '#4b5563' : '#d1d5db'}
              className="cursor-pointer"
            />
          </button>
        ))}
        <span className="text-xs text-gray-500 ml-2">Rate this signal</span>
      </div>
      
      {showComment && (
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this signal (optional)"
            rows="2"
            className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-orange-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
          <div className="flex gap-2">
            <button
              onClick={submitRating}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Submit Rating
            </button>
            <button
              onClick={() => setShowComment(false)}
              className={`px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}