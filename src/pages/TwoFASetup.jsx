// src/pages/TwoFASetup.jsx
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function TwoFASetup() {
  const { darkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock secret - in production, get from API
  const secret = 'ABCDEFGHIJKLMNOP';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SignalHub:user@example.com?secret=${secret}&issuer=SignalHub`;

  const handleVerify = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStep(3);
      localStorage.setItem('twoFAEnabled', 'true');
      setLoading(false);
    }, 1000);
  };

  if (step === 3) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <Icon icon={Icons.ShieldAlt} size={48} className="mx-auto mb-4 text-green-500" />
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            2FA Enabled Successfully!
          </h2>
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your account is now more secure.
          </p>
          <Link to="/dashboard/settings" className="text-orange-500 text-sm hover:underline">
            Back to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="text-center mb-6">
          <Icon icon={Icons.ShieldAlt} size={40} className="mx-auto mb-3 text-orange-500" />
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Two-Factor Authentication
          </h1>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Add an extra layer of security to your account
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="font-medium mb-2">Step 1: Install Authenticator App</h3>
              <p className="text-sm text-gray-500">Download Google Authenticator or Authy from your app store.</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="font-medium mb-2">Step 2: Scan QR Code</h3>
              <div className="flex justify-center my-3">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-center text-gray-500">Or enter this code manually: <code className="bg-gray-800 px-2 py-1 rounded">{secret}</code></p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="font-medium mb-2">Step 3: Verify Code</h3>
              <p className="text-sm text-gray-500 mb-3">Enter the 6-digit code from your authenticator app.</p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className={`w-full text-center text-2xl tracking-wider py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full text-gray-500 text-sm hover:text-gray-400"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}