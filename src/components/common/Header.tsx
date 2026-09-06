import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const Header: React.FC<{ title?: string }> = ({ title }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600">
            💰
          </div>
          <div>
            <h1 className="text-2xl font-bold">Budget Buddy</h1>
            {title && <p className="text-blue-100 text-sm">{title}</p>}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
