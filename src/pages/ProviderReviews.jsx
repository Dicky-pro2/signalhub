import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

export default function ProviderReviews() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles!customer_id(full_name, avatar_url)')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Reviews fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ reply: replyText })
        .eq('id', reviewId)
        .eq('provider_id', user.id);

      if (error) throw error;

      setReviews(reviews.map(r =>
        r.id === reviewId ? { ...r, reply: replyText } : r
      ));
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : 0;
  const fiveStar = reviews.filter(r => r.rating === 5).length;
  const responseRate = reviews.length
    ? Math.round((reviews.filter(r => r.reply).length / reviews.length) * 100)
    : 0;

  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const card = `rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${text}`}>Reviews & Feedback</h1>
        <p className={subtext}>See what traders are saying about your signals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-2xl font-bold ${text}`}>{avgRating || 'N/A'}</span>
            {avgRating > 0 && <span className="text-yellow-400 text-lg">★</span>}
          </div>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Total Reviews</p>
          <p className={`text-2xl font-bold ${text}`}>{reviews.length}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>5-Star Reviews</p>
          <p className="text-2xl font-bold text-green-500">{fiveStar}</p>
        </div>
        <div className={card}>
          <p className={`text-sm ${subtext}`}>Response Rate</p>
          <p className={`text-2xl font-bold ${text}`}>{responseRate}%</p>
        </div>
      </div>

      {/* Rating Breakdown */}
      {reviews.length > 0 && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-lg font-bold mb-4 ${text}`}>Rating Breakdown</h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const percent = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className={`text-sm w-6 text-right ${subtext}`}>{star}</span>
                  <span className="text-yellow-400 text-sm">★</span>
                  <div className={`flex-1 rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="bg-orange-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className={`text-sm w-8 ${subtext}`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className="text-4xl mb-3">⭐</p>
          <p className={`text-lg ${subtext}`}>No reviews yet</p>
          <p className={`text-sm mt-2 ${subtext}`}>
            Reviews will appear here when customers rate your signals
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-xl p-5 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${darkMode ? 'bg-orange-600' : 'bg-orange-500'}`}>
                      {review.profiles?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className={`font-semibold ${text}`}>
                        {review.profiles?.full_name || 'Anonymous'}
                      </p>
                      <p className={`text-xs ${subtext}`}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mt-1">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                </div>

                {/* Rating badge */}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  review.rating >= 4
                    ? 'bg-green-500/20 text-green-500'
                    : review.rating === 3
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {review.rating >= 4 ? 'Positive' : review.rating === 3 ? 'Neutral' : 'Negative'}
                </span>
              </div>

              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "{review.comment}"
              </p>

              {/* Existing reply */}
              {review.reply ? (
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
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-orange-500 text-sm ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={submitting || !replyText.trim()}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm transition disabled:opacity-50"
                    >
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(''); }}
                      className={`px-4 py-1.5 rounded-lg text-sm transition ${
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
      )}
    </div>
  );
}