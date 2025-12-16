import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Smartphone, MoreVertical, FileText, Upload, Search, Filter, Mail } from 'lucide-react';
const HowToUse = ({ onBack }) => {
    const steps = [
        {
            icon: _jsx(Smartphone, { className: "w-6 h-6 text-whatsapp" }),
            title: "Open WhatsApp",
            description: "Open WhatsApp on your phone and go to any chat or group you want to search."
        },
        {
            icon: _jsx(MoreVertical, { className: "w-6 h-6 text-whatsapp" }),
            title: "Export Chat",
            description: "Tap the contact name or menu (⋮) → More → Export Chat → Without Media."
        },
        {
            icon: _jsx(Mail, { className: "w-6 h-6 text-whatsapp" }),
            title: "Transfer File",
            description: "Email the generated .txt file to yourself or save it to your device/desktop."
        },
        {
            icon: _jsx(Upload, { className: "w-6 h-6 text-whatsapp" }),
            title: "Upload & Analyze",
            description: "Open this tool and upload the .txt file to start analyzing."
        },
        {
            icon: _jsx(Search, { className: "w-6 h-6 text-whatsapp" }),
            title: "Search",
            description: "Type in your keyword to search through your history."
        },
        {
            icon: _jsx(Filter, { className: "w-6 h-6 text-whatsapp" }),
            title: "Filter & Insights",
            description: "Filter by sender, date, or use AI to summarize the conversation."
        }
    ];
    return (_jsx("div", { className: "bg-gray-50 dark:bg-gray-900 min-h-[600px] py-12 transition-colors duration-200", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl", children: "\uD83D\uDCCB How to Use" }), _jsx("p", { className: "mt-4 text-lg text-gray-500 dark:text-gray-400", children: "Follow these simple steps to analyze your WhatsApp chats privately." })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700", children: steps.map((step, index) => (_jsxs("div", { className: "p-6 flex items-start hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors", children: [_jsx("div", { className: "flex-shrink-0 bg-green-50 dark:bg-green-900/30 rounded-lg p-3 mr-4", children: step.icon }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-1", children: [index + 1, ". ", step.title] }), _jsx("p", { className: "text-base text-gray-500 dark:text-gray-400", children: step.description })] })] }, index))) }) }), _jsx("div", { className: "mt-10 text-center", children: _jsx("button", { onClick: onBack, className: "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-whatsapp hover:bg-whatsapp-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-whatsapp transition-colors", children: "Start Analyzing Now" }) })] }) }));
};
export default HowToUse;
