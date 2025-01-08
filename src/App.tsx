import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from './lib/firebase';
import { User } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import TodoList from './components/TodoList';
import Auth from './components/Auth';
import Background from './components/Background';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setShowWelcome(true); 
        setTimeout(() => setShowWelcome(false), 3000); 
      }
    });
    return () => unsubscribe();
  }, []);


  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  
  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map((part) => part[0].toUpperCase()).join('');
    return initials;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-all relative`}>
      <Background />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Dark Mode Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full text-2xl focus:outline-none"
          >
            {darkMode ? '🌙' : '🌞'} {/* Moon for dark mode, Sun for light mode */}
          </button>
        </div>

        {user ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* User Circular Logo at the Top Left */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-4 left-4 w-16 h-16 rounded-full bg-blue-500 text-white flex justify-center items-center text-2xl font-bold"
            >
              {/* Safely accessing displayName */}
              {user.displayName ? getInitials(user.displayName) : 'U'}
            </motion.div>

            {/* Welcome Text Below the Logo (Appears only once) */}
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className="flex justify-center items-center flex-col mt-16"
              >
                <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                  Welcome, {user.displayName || 'User'}
                </p>
              </motion.div>
            )}

            {/* Todo List */}
            <TodoList />
          </motion.div>
        ) : (
          <Auth />
        )}
      </motion.div>

      {/* Centered Sign Out Button */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default App;
