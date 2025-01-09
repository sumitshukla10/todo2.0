import { useState } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../lib/firebase'; // Ensure you import db
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LogIn, UserPlus, Loader, LogOut } from 'lucide-react'; // Import LogOut for sign out button

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // For capturing the full name during sign-up
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is logged in

  // Handle form submission for login and signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Set loading to true when form submission starts

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Creating the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update the Firebase Auth user profile with the full name
        await updateProfile(userCredential.user, {
          displayName: fullName,
        });

        // Store full name and email in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName: fullName,
          email: email,
        });
      }

      // After login/signup, show Sign Out button
      setIsAuthenticated(true);

      // Simulate a loading delay for 2-3 seconds before redirecting
      setTimeout(() => {
        setIsLoading(false); // Stop loading after delay
      }, 2000); // You can adjust this duration as needed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false); // Stop loading if an error occurs
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user immediately
      setIsAuthenticated(false); // Update the state to hide the Sign Out button
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign-out');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-xl"
    >
      <h2 className="text-3xl font-bold text-center mb-8">
        {isLogin ? 'Sign In' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isLogin}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Loading...
            </>
          ) : isLogin ? (
            <>
              <LogIn size={20} />
              Sign In
            </>
          ) : (
            <>
              <UserPlus size={20} />
              Sign Up
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>

      {/* Sign Out Button (Visible only after login/signup and not on sign-in/sign-up page) */}
      {isAuthenticated && (
        <motion.button
          onClick={handleSignOut}
          className="w-full mt-4 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Sign Out
        </motion.button>
      )}
    </motion.div>
  );
}

