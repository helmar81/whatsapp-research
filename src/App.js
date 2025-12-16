import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FileUploader from './components/FileUploader';
import ChatDashboard from './components/ChatDashboard';
import Footer from './components/Footer';
import Header from './components/Header';
import HowToUse from './components/HowToUse';
import { parseChatFile, parseChatText, analyzeChat } from './services/chatParser';
import { ViewMode } from './types'; // Correct if types.ts is in src/
// Demo data generator
const generateDemoData = () => {
    const text = `[12/05/2024, 09:15:00] Alice: Hey Bob, did you see the new project requirements?
[12/05/2024, 09:16:20] Bob: Yes, I just read them. Looks like a lot of work for next week.
[12/05/2024, 09:17:00] Alice: Totally. We need to start with the API design.
[12/05/2024, 09:18:15] Charlie: I can handle the frontend components if you guys do the backend.
[12/05/2024, 09:20:00] Bob: Sounds like a plan. @Alice, can you set up the repo?
[12/05/2024, 10:00:00] Alice: Done. Sent the link.
[12/05/2024, 10:05:00] Charlie: Thanks! I'll start the React setup.
[12/05/2024, 14:30:00] Alice: Let's meet at 4 PM to sync?
[12/05/2024, 14:31:00] Bob: Works for me.
[13/05/2024, 09:00:00] System: Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
[13/05/2024, 09:05:00] Alice: Good morning team! How's progress?
[13/05/2024, 09:10:00] Charlie: Almost done with the dashboard UI. It looks clean!
[13/05/2024, 09:12:00] Bob: API endpoints are 50% done. I need to fix some database schemas.
[13/05/2024, 09:15:00] Alice: Great. I'm working on the auth service. It's tricky with the new JWT requirements.
[13/05/2024, 11:20:00] Bob: Anyone want to grab lunch?
[13/05/2024, 11:21:00] Charlie: Sure, pizza place?
[13/05/2024, 11:21:30] Alice: I'm in!`;
    return parseChatText(text);
};
const App = () => {
    const [viewMode, setViewMode] = useState(ViewMode.UPLOAD);
    const [messages, setMessages] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    // Load theme and saved chat
    useEffect(() => {
        // Theme init
        const savedTheme = localStorage.getItem('chatlens_theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
        else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
        // Chat data init
        const savedData = localStorage.getItem('chatlens_messages');
        if (savedData) {
            try {
                setLoading(true);
                setTimeout(() => {
                    const parsedMsgs = JSON.parse(savedData, (key, value) => {
                        if (key === 'date')
                            return new Date(value);
                        return value;
                    });
                    if (parsedMsgs.length > 0) {
                        const result = analyzeChat(parsedMsgs);
                        setMessages(parsedMsgs);
                        setAnalysis(result);
                        setViewMode(ViewMode.DASHBOARD);
                    }
                    setLoading(false);
                }, 300);
            }
            catch (err) {
                console.error("Failed to load saved chat:", err);
                localStorage.removeItem('chatlens_messages');
                setLoading(false);
            }
        }
    }, []);
    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('chatlens_theme', 'dark');
        }
        else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('chatlens_theme', 'light');
        }
    };
    const processMessages = (msgs, persist = true) => {
        setLoading(true);
        setTimeout(() => {
            const result = analyzeChat(msgs);
            setMessages(msgs);
            setAnalysis(result);
            setViewMode(ViewMode.DASHBOARD);
            if (persist) {
                try {
                    localStorage.setItem('chatlens_messages', JSON.stringify(msgs));
                }
                catch (e) {
                    console.error("Failed to save to localStorage", e);
                }
            }
            setLoading(false);
        }, 800);
    };
    const handleFileUpload = async (file) => {
        try {
            setLoading(true);
            const msgs = await parseChatFile(file);
            if (msgs.length === 0) {
                alert("No messages found. Ensure it is a valid WhatsApp text export.");
                setLoading(false);
                return;
            }
            processMessages(msgs, true);
        }
        catch (error) {
            console.error(error);
            alert("Error parsing file.");
            setLoading(false);
        }
    };
    const loadDemo = () => {
        const demoMsgs = generateDemoData();
        processMessages(demoMsgs, false);
    };
    const handleReset = () => {
        setMessages([]);
        setAnalysis(null);
        setViewMode(ViewMode.UPLOAD);
        localStorage.removeItem('chatlens_messages');
    };
    const navigateTo = (mode) => {
        if (mode === ViewMode.UPLOAD) {
            handleReset();
            return;
        }
        setViewMode(mode);
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center", children: [_jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-b-4 border-whatsapp" }), _jsx("p", { className: "mt-4 text-gray-600 dark:text-gray-300 font-medium", children: "Crunching your chat data..." })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-200", children: [(viewMode === ViewMode.UPLOAD || viewMode === ViewMode.HOW_TO_USE) && (_jsx(Header, { currentView: viewMode, onNavigate: navigateTo, theme: theme, onToggleTheme: toggleTheme })), _jsxs("main", { className: "flex-grow", children: [viewMode === ViewMode.UPLOAD && (_jsxs(_Fragment, { children: [_jsx(Hero, { onDemoLoad: loadDemo }), _jsxs("div", { className: "py-12 bg-gray-50 dark:bg-gray-900 min-h-[400px]", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Ready to analyze?" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Upload your _chat.txt file below" })] }), _jsx(FileUploader, { onFileUpload: handleFileUpload }), _jsxs("div", { className: "max-w-4xl mx-auto mt-20 px-4", children: [_jsx("h2", { className: "text-2xl font-bold text-center text-gray-900 dark:text-white mb-10", children: "What Users Say" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 italic text-gray-600 dark:text-gray-300", children: ["\"This tool saved me hours digging through exported files for a specific legal date. Brilliant!\"", _jsx("div", { className: "mt-4 text-sm font-bold text-gray-900 dark:text-white not-italic", children: "\u2014 Sarah J., Lawyer" })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 italic text-gray-600 dark:text-gray-300", children: ["\"As a researcher, I rely on this for analyzing WhatsApp interviews. Works like a charm and it's private.\"", _jsx("div", { className: "mt-4 text-sm font-bold text-gray-900 dark:text-white not-italic", children: "\u2014 Academic User" })] })] })] }), _jsx("div", { className: "max-w-3xl mx-auto mt-16 px-4", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDD10" }), " Privacy Info"] }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: "Your chats are never uploaded. All processing happens locally in your browser. No data is stored or sent to any server." }), _jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700", children: "Note: This project is an independent tool and is not associated with WhatsApp or Meta in any way. All trademarks belong to their respective owners." })] }) })] })] })), viewMode === ViewMode.HOW_TO_USE && (_jsx(HowToUse, { onBack: () => navigateTo(ViewMode.UPLOAD) })), viewMode === ViewMode.DASHBOARD && analysis && (_jsx(ChatDashboard, { messages: messages, analysis: analysis, onReset: handleReset, isDarkMode: theme === 'dark', onToggleTheme: toggleTheme }))] }), (viewMode === ViewMode.UPLOAD || viewMode === ViewMode.HOW_TO_USE) && _jsx(Footer, {})] }));
};
export default App;
