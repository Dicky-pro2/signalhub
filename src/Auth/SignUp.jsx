// In your SignUpPage.jsx, add an "Admin Code" field:

const [adminCode, setAdminCode] = useState('');
const [selectedRole, setSelectedRole] = useState('customer');

// Add this to your form
<div>
  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    Secret Code (for admin access)
  </label>
  <input
    type="password"
    value={adminCode}
    onChange={(e) => setAdminCode(e.target.value)}
    placeholder="Enter secret code if you have one"
    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
      darkMode 
        ? 'bg-gray-700 border-gray-600 text-white' 
        : 'bg-white border-gray-300 text-gray-800'
    }`}
  />
</div>

// In your handleSubmit function, check for admin code:
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  // Check if admin code is correct
  const ADMIN_SECRET_CODE = 'SignalHubAdmin2024'; // Change this to your secret code
  
  let finalRole = selectedRole;
  if (adminCode === ADMIN_SECRET_CODE) {
    finalRole = 'admin';
  }
  
  try {
    const userData = await signUp(email, password, fullName, finalRole);
    // ... rest of your code
  } catch (err) {
    // ... error handling
  }
};