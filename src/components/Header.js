import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { MessageCircle, Sun, Moon } from 'lucide-react';
import { ViewMode } from '../types';
const Header = ({ currentView, onNavigate, theme, onToggleTheme }) => {
    return (_jsx("header", { className: "bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center cursor-pointer", onClick: () => onNavigate(ViewMode.UPLOAD), children: [_jsx(MessageCircle, { className: "h-8 w-8 text-whatsapp mr-2" }), _jsx("span", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "ChatLens" })] }), _jsxs("nav", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => onNavigate(ViewMode.HOW_TO_USE), className: `text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors ${currentView === ViewMode.HOW_TO_USE ? 'text-whatsapp font-bold' : 'text-gray-500 dark:text-gray-300'}`, children: "How it works" }), _jsx("button", { onClick: onToggleTheme, className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 transition-colors", "aria-label": "Toggle Dark Mode", children: theme === 'light' ? _jsx(Moon, { className: "w-5 h-5" }) : _jsx(Sun, { className: "w-5 h-5" }) })] })] }) }));
};
export default Header;
