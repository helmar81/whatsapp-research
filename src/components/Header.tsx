import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ViewMode } from '../types';




export interface HeaderProps {
  currentView: ViewMode.UPLOAD | ViewMode.HOW_TO_USE;
  onNavigate: (mode: ViewMode) => void;
  theme: "light" | "dark"; // Add this line
  isDark: boolean; // Add this line
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => onNavigate(ViewMode.UPLOAD)}
        >
          <MessageCircle className="h-8 w-8 text-whatsapp-brand mr-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ChatLens
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => onNavigate(ViewMode.HOW_TO_USE)}
            className={`text-sm font-medium transition-colors ${
              currentView === ViewMode.HOW_TO_USE
                ? 'text-whatsapp-brand font-semibold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            How it works
          </button>

          {/* 🌗 WhatsApp-style toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors"
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                isDark ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
