import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ProviderReviews() {
  const { darkMode } = useTheme();
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Marcus T.', rating: 5, comment: 'Best signals on the platform! Consistent profits and detailed analysis.', date: '2024-01-14', signal: 'BTC/USD', replied: false },
    { id: 2, user: 'Sarah K.', rating: 5, comment: 'Very detailed analysis. Worth every penny. Will buy again.', date: '2024-01-13', signal: 'ETH/USD', replied: false },
    { id: 3, user: 'David L.', rating: 4, comment: 'Good signals, would appreciate more entry points for risk management.', date: '2024-01-12', signal: 'EUR/USD', replied: true },
    { id: 4, user: 'Emma W.', rating: 5, comment: 'Amazing accuracy! Up 15% this week following your signals.', date: '2024-01-11', signal: 'SOL/USD', replied: false },
    { id: 5, user: 'Michael C.', rating: 3, comment: 'Signal was decent but TP took longer than expected.', date: '2024-01-10', signal: 'NVDA', replied: false },
  ]);

  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const stats = {
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2),
    totalReviews: reviews.length,
    fiveStar: reviews.filter(r => r.rating === 5).length,
    responseRate: Math.round((reviews.filter(r => r.replied).length / reviews.length) * 100),
  };

  const handleReply = (reviewId) => {
    if (!replyText.trim()) return;
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, replied: true, reply: replyText } : r
    ));
    setReplyText('');
    setReplyingTo(null);
    alert('Reply posted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Reviews & Feedback
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          See what traders are saying about your signals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {stats.averageRating}
            </span>
            <span className="text-yellow-400 text-lg">★</span>
          </div>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Reviews</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.totalReviews}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>5-Star Reviews</p>
          <p className={`text-2xl font-bold text-green-500`}>
            {stats.fiveStar}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Response Rate</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.responseRate}%
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className={`rounded-xl p-5 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${darkMode ? 'bg-orange-600' : 'bg-orange-500'}`}>
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {review.user}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Signal: {review.signal} • {review.date}
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mt-1">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                </div>
              </div>
            </div>

            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              "{review.comment}"
            </p>

            {review.replied && review.reply ? (
              <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  Your Reply:
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {review.reply}
                </p>
              </div>
            ) : replyingTo === review.id ? (
              <div className="mt-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  rows="3"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleReply(review.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm transition"
                  >
                    Post Reply
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className={`px-4 py-1 rounded-lg text-sm transition ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setReplyingTo(review.id)}
                className="mt-3 text-orange-500 text-sm hover:underline"
              >
                Reply to Review →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}