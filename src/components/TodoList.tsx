import { useState, useEffect } from 'react';
import { db } from '../lib/firebase'; // Ensure you import Firestore
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth } from '../lib/firebase';
import { Todo } from '../types'; // Assuming you have a type for Todo
import { Edit, Trash2 } from 'lucide-react'; // Importing icons from lucide-react
import { motion } from 'framer-motion'; // Importing motion for animations

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true); // Start loading as true
  const user = auth.currentUser;

  // Fetch todos when user is logged in
  useEffect(() => {
    if (!user) return; // Ensure user is logged in

    const fetchTodos = async () => {
      try {
        setLoading(true); // Set loading true when starting the fetch
        const q = query(collection(db, 'users', user.uid, 'todos'));
        const querySnapshot = await getDocs(q);
        const fetchedTodos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];
        setTodos(fetchedTodos); // Update the todos state with the fetched data
      } catch (error) {
        console.error('Error fetching todos: ', error);
      } finally {
        setLoading(false); // Set loading false when done
      }
    };

    fetchTodos();
  }, [user]);

  // Add new todo
  const handleAddTodo = async () => {
    if (!user || !newTodo) return; // Ensure user is logged in and new todo is not empty

    try {
      const todoRef = await addDoc(collection(db, 'users', user.uid, 'todos'), {
        text: newTodo,
        completed: false,
      });
      setTodos([...todos, { id: todoRef.id, text: newTodo, completed: false }]); // Update todos state with new todo
      setNewTodo(''); // Clear the input field
    } catch (error) {
      console.error('Error adding todo: ', error);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (id: string, completed: boolean) => {
    if (!user) return;

    try {
      const todoRef = doc(db, 'users', user.uid, 'todos', id);
      await updateDoc(todoRef, { completed: !completed });
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)));
    } catch (error) {
      console.error('Error toggling todo: ', error);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const todoRef = doc(db, 'users', user.uid, 'todos', id);
      await deleteDoc(todoRef);
      setTodos(todos.filter((todo) => todo.id !== id)); // Update state after deletion
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
  };

  // Edit todo
  const handleEditTodo = async (id: string, text: string) => {
    const newText = prompt('Edit your todo:', text);
    if (newText && newText !== text) {
      try {
        const todoRef = doc(db, 'users', user.uid, 'todos', id);
        await updateDoc(todoRef, { text: newText });
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)));
      } catch (error) {
        console.error('Error editing todo: ', error);
      }
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 px-6">
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading todos...</p> // Display loading text while fetching todos
      ) : (
        <>
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="w-full p-4 mb-6 border-2 border-gray-300 rounded-lg shadow-md bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:ring-blue-400 transition-all"
              placeholder="Add a new todo"
            />
            <button
              onClick={handleAddTodo}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
            >
              Add Todo
            </button>
          </div>

          <ul className="mt-6 space-y-4">
            {todos.map((todo) => (
              <motion.li
                key={todo.id}
                className="flex justify-between items-center bg-white p-5 rounded-lg shadow-md hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition duration-300 ease-in-out"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="h-5 w-5 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 dark:border-gray-600 dark:checked:bg-blue-600 dark:checked:border-blue-500 transition duration-300"
                  />
                  <span
                    className={`text-lg font-medium ${
                      todo.completed
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-800 dark:text-white'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>

                <div className="flex space-x-4">
                  {/* Edit Button with cool motion */}
                  <motion.button
                    onClick={() => handleEditTodo(todo.id, todo.text)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition duration-300 transform hover:scale-110"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Edit size={18} />
                  </motion.button>

                  {/* Delete Button with cool motion */}
                  <motion.button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition duration-300 transform hover:scale-110"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TodoList;
