import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

// Hook to get current user's profile
export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return { profile, loading };
};

// Hook to get current user's wallet
export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setWallet(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return { wallet, loading };
};

// Hook to get all signals
export const useSignals = (providerId = null) => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      let query = supabase
        .from('signals')
        .select('*, profiles(full_name, avatar_url, is_verified)')
        .order('created_at', { ascending: false });

      if (providerId) query = query.eq('provider_id', providerId);

      const { data } = await query;
      setSignals(data || []);
      setLoading(false);
    };
    fetch();
  }, [providerId]);

  return { signals, loading };
};

// Hook to get user's subscriptions
export const useSubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*, profiles!provider_id(full_name, avatar_url)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      setSubscriptions(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return { subscriptions, loading };
};

// Hook to get transactions
export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTransactions(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return { transactions, loading };
};

// Hook to get notifications
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
      setLoading(false);
    };
    fetch();

    // Real-time updates
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
};

// Hook to get watchlist
export const useWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('watchlist')
        .select('*, profiles!provider_id(id, full_name, avatar_url, bio)')
        .eq('customer_id', user.id);
      setWatchlist(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const addToWatchlist = async (providerId) => {
    await supabase.from('watchlist').insert({ customer_id: user.id, provider_id: providerId });
    fetch();
  };

  const removeFromWatchlist = async (providerId) => {
    await supabase.from('watchlist').delete().eq('customer_id', user.id).eq('provider_id', providerId);
    setWatchlist(prev => prev.filter(w => w.provider_id !== providerId));
  };

  return { watchlist, loading, addToWatchlist, removeFromWatchlist };
};

// Hook for provider earnings
export const useProviderEarnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: pendingData } = await supabase
        .from('withdrawals')
        .select('amount')
        .eq('provider_id', user.id)
        .eq('status', 'pending');

      const pending = pendingData?.reduce((sum, w) => sum + w.amount, 0) || 0;

      setEarnings({
        total: data?.total_earned || 0,
        balance: data?.balance || 0,
        pending,
      });
      setLoading(false);
    };
    fetch();
  }, [user]);

  return { earnings, loading };
};