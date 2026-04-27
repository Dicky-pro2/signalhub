import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import MarketplacePage from './pages/MarketPlacePage';  // Note the capital P
import UserDashboard from './pages/UserDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import CreateSignal from './pages/CreateSignal';
import EditSignal from './pages/EditSignal';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import Watchlist from './pages/Watchlist';
import ProviderAnalytics from './pages/ProviderAnalytics';
import Notifications from './pages/Notifications';
import MyPurchases from './pages/MyPurchases';
import Wallet from './pages/Wallet';
import ProviderSignals from './pages/ProviderSignals';
import ProviderEarnings from './pages/ProviderEarnings';
import ProviderReviews from './pages/ProviderReviews';
import WithdrawFunds from './pages/WithdrawFunds';
import { ColorProvider } from './context/ColorContext';

// Protected route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/signin" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'provider') return <Navigate to="/provider" />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'provider') return '/provider';
    return '/dashboard';
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={user ? <Navigate to={getDefaultRoute()} /> : <SignUpPage />} />
      <Route path="/signin" element={user ? <Navigate to={getDefaultRoute()} /> : <SignInPage />} />
      
      {/* Marketplace route */}
      <Route path="/marketplace" element={
        <ProtectedRoute allowedRoles={['customer', 'provider', 'admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<MarketplacePage />} />
      </Route>

      {/* Customer routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<UserDashboard />} />
        <Route path="purchases" element={<MyPurchases />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Provider routes */}
      <Route path="/provider" element={
        <ProtectedRoute allowedRoles={['provider']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ProviderDashboard />} />
        <Route path="signals" element={<ProviderSignals />} />
        <Route path="create-signal" element={<CreateSignal />} />
        <Route path="edit-signal/:id" element={<EditSignal />} />
        <Route path="earnings" element={<ProviderEarnings />} />
        <Route path="reviews" element={<ProviderReviews />} />
        <Route path="analytics" element={<ProviderAnalytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="withdraw" element={<WithdrawFunds />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ColorProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </AuthProvider>
        </ColorProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;