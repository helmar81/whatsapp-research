import React from 'react';
import { MessageCircle, Sun, Moon, HelpCircle } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (mode: ViewMode) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, theme, onToggleTheme }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => onNavigate(ViewMode.UPLOAD)}
        >
          <MessageCircle className="h-8 w-8 text-whatsapp mr-2 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">ChatLens</span>
        </div>
        
        <nav className="flex items-center space-x-4">
           {/* How It Works Link */}
           <button 
             onClick={() => onNavigate(ViewMode.HOW_TO_USE)}
             className={`flex items-center text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${currentView === ViewMode.HOW_TO_USE ? 'text-whatsapp bg-green-50 dark:bg-green-900/20' : 'text-gray-500 dark:text-gray-400'}`}
           >
             <HelpCircle className="w-4 h-4 mr-2" />
             How it works
           </button>

           <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

           {/* Theme Toggle */}
           <button
             onClick={onToggleTheme}
             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-whatsapp"
             aria-label="Toggle Dark Mode"
           >
             {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
           </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;