import { motion } from 'framer-motion';
import { Check, Trash2, Edit } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.1)',
        transition: { type: 'spring', stiffness: 300 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: 'spring', stiffness: 200 },
      }}
      className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-white dark:border-gray-600"
    >
      <div className="flex items-center space-x-4">
        {/* Toggle Button */}
        <motion.button
          onClick={() => onToggle(todo.id)}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out ${
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500 dark:border-gray-600 dark:hover:border-green-500'
          }`}
          whileHover={{
            scale: 1.1,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            transition: { type: 'spring', stiffness: 300 },
          }}
        >
          {todo.completed && <Check size={16} className="text-white" />}
        </motion.button>

        {/* Todo Text */}
        <motion.span
          className={`text-lg font-semibold transition-all duration-300 ease-in-out ${
            todo.completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-800 dark:text-white'
          }`}
          transition={{ duration: 0.3 }}
        >
          {todo.text}
        </motion.span>
      </div>

      <div className="flex space-x-3">
        {/* Edit Button */}
        <motion.button
          onClick={() => onEdit(todo.id)}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
          whileHover={{
            scale: 1.2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transition: { type: 'spring', stiffness: 300 },
          }}
          whileTap={{
            scale: 0.95,
            transition: { type: 'spring', stiffness: 300 },
          }}
        >
          <Edit size={18} />
        </motion.button>

        {/* Delete Button */}
        <motion.button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
          whileHover={{
            scale: 1.2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transition: { type: 'spring', stiffness: 300 },
          }}
          whileTap={{
            scale: 0.95,
            transition: { type: 'spring', stiffness: 300 },
          }}
        >
          <Trash2 size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
