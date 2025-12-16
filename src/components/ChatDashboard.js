import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Copy, MessageSquare, Calendar, Users, Sparkles, ArrowLeft, BarChart2, X, Sun, Moon, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { generateChatSummary } from '../services/geminiService';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
// Helper component for highlighting text
const HighlightedText = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return _jsx(_Fragment, { children: text });
    }
    // Escape special regex characters in the highlight term
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
    return (_jsx("span", { children: parts.map((part, i) => part.toLowerCase() === highlight.toLowerCase() ? (_jsx("span", { className: "bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-white font-semibold px-0.5 rounded-sm inline-block animate-highlight origin-bottom", children: part }, i)) : (part)) }));
};
const ChatDashboard = ({ messages, analysis, onReset, isDarkMode, onToggleTheme }) => {
    // Search State
    const [searchInput, setSearchInput] = useState(''); // What the user types
    const [activeSearchTerm, setActiveSearchTerm] = useState(''); // What is actually filtered/highlighted
    const [selectedAuthor, setSelectedAuthor] = useState('All');
    const [filteredMessages, setFilteredMessages] = useState(messages);
    // AI State
    const [aiSummary, setAiSummary] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState('');
    // Debounce search input to update activeSearchTerm
    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveSearchTerm(searchInput);
        }, 300); // 300ms debounce delay
        return () => clearTimeout(timer);
    }, [searchInput]);
    // Apply filters when activeSearchTerm or selectedAuthor changes
    useEffect(() => {
        const lowerTerm = activeSearchTerm.toLowerCase();
        const filtered = messages.filter(msg => {
            const matchesSearch = !lowerTerm || msg.content.toLowerCase().includes(lowerTerm);
            const matchesAuthor = selectedAuthor === 'All' || msg.author === selectedAuthor;
            return matchesSearch && matchesAuthor;
        });
        setFilteredMessages(filtered);
    }, [activeSearchTerm, selectedAuthor, messages]);
    const handleClearSearch = () => {
        setSearchInput('');
        setActiveSearchTerm('');
    };
    const handleDownload = () => {
        const textContent = filteredMessages.map(m => `[${m.date.toLocaleString()}] ${m.author}: ${m.content}`).join('\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-export-filtered.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const handleCopy = () => {
        const textContent = filteredMessages.map(m => `[${m.date.toLocaleString()}] ${m.author}: ${m.content}`).join('\n');
        navigator.clipboard.writeText(textContent);
        alert('Copied to clipboard!');
    };
    const runAiAnalysis = async () => {
        setAiLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = await generateChatSummary(messages);
            setAiSummary(result);
        }
        catch (e) {
            console.error(e);
            alert('Failed to generate summary. Check API Key.');
        }
        finally {
            setAiLoading(false);
        }
    };
    const askAi = async () => {
        if (!aiQuestion.trim())
            return;
        setAiLoading(true);
        try {
            const result = await generateChatSummary(messages, aiQuestion);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setAiAnswer(result);
        }
        catch (e) {
            console.error(e);
            setAiAnswer("Error getting answer.");
        }
        finally {
            setAiLoading(false);
        }
    };
    // Data for Pie Chart
    const authorData = Object.entries(analysis.messageCountByAuthor).map(([name, count]) => ({
        name, value: Number(count)
    })).sort((a, b) => b.value - a.value).slice(0, 6);
    // Data for Bar Chart
    const dailyActivityData = useMemo(() => {
        return Object.entries(analysis.messagesPerDay)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({
            date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            fullDate: date,
            count
        }));
    }, [analysis.messagesPerDay]);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 pb-10 transition-colors duration-200", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm transition-colors duration-200", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: onReset, className: "mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsxs("h1", { className: "text-xl font-bold text-gray-900 dark:text-white flex items-center", children: [_jsx(MessageSquare, { className: "w-6 h-6 mr-2 text-whatsapp" }), "Chat Results"] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { className: "text-sm text-gray-500 dark:text-gray-400 hidden sm:block", children: [filteredMessages.length, " messages found"] }), _jsx("button", { onClick: onToggleTheme, className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors", "aria-label": "Toggle Dark Mode", children: isDarkMode ? _jsx(Sun, { className: "w-5 h-5" }) : _jsx(Moon, { className: "w-5 h-5" }) })] })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-200", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-3", children: [_jsxs("div", { className: "flex-grow relative", children: [_jsx("input", { type: "text", className: "block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm", placeholder: "Search keywords...", value: searchInput, onChange: (e) => setSearchInput(e.target.value) }), searchInput && (_jsx("button", { onClick: handleClearSearch, className: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200", children: _jsx(X, { className: "h-4 w-4" }) }))] }), searchInput ? (_jsxs("button", { onClick: handleClearSearch, className: "inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none transition-colors", children: [_jsx(X, { className: "h-4 w-4 mr-2" }), "Clear"] })) : (_jsxs("div", { className: "inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 opacity-80 cursor-default", children: [_jsx(Search, { className: "h-4 w-4 mr-2" }), "Search"] })), _jsxs("button", { onClick: handleDownload, className: "inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Download"] }), _jsxs("button", { onClick: handleCopy, className: "inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors", children: [_jsx(Copy, { className: "h-4 w-4 mr-2" }), "Copy Text"] })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center", children: _jsxs("div", { className: "flex items-center w-full sm:w-auto", children: [_jsx(Filter, { className: "w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mr-3 whitespace-nowrap", children: "Filter by Sender:" }), _jsxs("select", { className: "block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-whatsapp focus:border-whatsapp sm:text-sm rounded-md", value: selectedAuthor, onChange: (e) => setSelectedAuthor(e.target.value), children: [_jsx("option", { value: "All", children: "All Senders" }), analysis.participants.map(p => (_jsx("option", { value: p, children: p }, p)))] })] }) })] }), dailyActivityData.length > 0 && (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-200", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center", children: [_jsx(BarChart2, { className: "w-5 h-5 mr-2 text-whatsapp" }), "Activity Timeline"] }), _jsx("div", { className: "h-64 w-full", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: dailyActivityData, margin: { top: 5, right: 20, left: 0, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: isDarkMode ? "#374151" : "#e5e7eb" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }, axisLine: false, tickLine: false, minTickGap: 30 }), _jsx(YAxis, { tick: { fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: {
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                                                                color: isDarkMode ? '#fff' : '#000'
                                                            }, labelStyle: { fontWeight: 'bold', color: isDarkMode ? '#d1d5db' : '#374151' } }), _jsx(Bar, { dataKey: "count", fill: "#25D366", radius: [4, 4, 0, 0] })] }) }) })] })), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px] transition-colors duration-200", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-gray-700 dark:text-gray-200", children: "Conversation History" }), _jsxs("span", { className: "text-xs text-gray-400 dark:text-gray-500", children: ["Showing ", filteredMessages.length, " messages"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 chat-scroll bg-[#e5ded8] dark:bg-whatsapp-chat-bg-dark transition-colors duration-200", children: filteredMessages.length === 0 ? (_jsx("div", { className: "text-center text-gray-500 dark:text-gray-400 mt-20", children: "No messages found matching your criteria." })) : (filteredMessages.map((msg) => (_jsxs("div", { className: `flex flex-col max-w-[85%] ${msg.author === 'You' || msg.author === analysis.participants[0] ? 'ml-auto items-end' : 'mr-auto items-start'}`, children: [!msg.isSystem && (_jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400 mb-1 px-1 font-medium", children: msg.author })), _jsxs("div", { className: `rounded-lg px-3 py-2 text-sm shadow-sm relative transition-colors duration-200 ${msg.isSystem
                                                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 mx-auto text-center italic text-xs'
                                                            : (msg.author === 'You' || msg.author === analysis.participants[0]
                                                                ? 'bg-whatsapp-light dark:bg-whatsapp-message-out-dark text-gray-900 dark:text-gray-100 rounded-tr-none'
                                                                : 'bg-white dark:bg-whatsapp-message-in-dark text-gray-900 dark:text-gray-100 rounded-tl-none')}`, children: [_jsx("p", { className: "whitespace-pre-wrap break-words", children: _jsx(HighlightedText, { text: msg.content, highlight: activeSearchTerm }) }), !msg.isSystem && (_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400 block text-right mt-1 opacity-80", children: msg.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }))] })] }, msg.id)))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-2 border-indigo-100 dark:border-indigo-900/50 relative transition-colors duration-200", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("h3", { className: "text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center", children: [_jsx(Sparkles, { className: "w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" }), "Gemini Insights"] }) }), !aiSummary && !aiLoading && (_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-4", children: "Get an AI-powered summary of this conversation, including key topics and tone analysis." }), _jsx("button", { onClick: runAiAnalysis, className: "w-full py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 font-medium transition-colors shadow-sm", children: "Generate Summary" })] })), aiLoading && (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto" }), _jsx("p", { className: "text-indigo-600 dark:text-indigo-300 mt-2 text-sm font-medium", children: "Analyzing conversation..." })] })), aiSummary && (_jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { className: "bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800", children: [_jsx("p", { className: "text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase mb-1", children: "Summary" }), _jsx("p", { className: "text-sm text-gray-700 dark:text-gray-200 leading-relaxed", children: aiSummary.summary })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1", children: "Tone" }), _jsx("span", { className: "inline-block bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full font-medium border border-purple-200 dark:border-purple-800", children: aiSummary.tone })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "Key Topics" }), _jsx("div", { className: "flex flex-wrap gap-2", children: aiSummary.keyTopics.map(topic => (_jsx("span", { className: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600", children: topic }, topic))) })] })] })), _jsxs("div", { className: "mt-4 pt-4 border-t border-gray-100 dark:border-gray-700", children: [_jsx("p", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "Ask about this chat" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: aiQuestion, onChange: (e) => setAiQuestion(e.target.value), placeholder: "e.g. When is the meeting?", className: "flex-1 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 border p-2" }), _jsx("button", { onClick: askAi, disabled: aiLoading || !aiQuestion, className: "bg-indigo-600 dark:bg-indigo-500 text-white px-3 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50", children: _jsx(Search, { className: "w-4 h-4" }) })] }), aiAnswer && (_jsx("div", { className: "mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 animate-fadeIn", children: aiAnswer }))] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-200", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center", children: [_jsx(Users, { className: "w-5 h-5 mr-2 text-whatsapp" }), "Participation"] }), _jsx("div", { className: "h-64 w-full", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: authorData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, fill: "#8884d8", paddingAngle: 5, dataKey: "value", stroke: isDarkMode ? '#1f2937' : '#fff', children: authorData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                                                                color: isDarkMode ? '#fff' : '#000'
                                                            } })] }) }) }), _jsx("div", { className: "mt-4 space-y-2", children: authorData.map((entry, index) => (_jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 rounded-full mr-2", style: { backgroundColor: COLORS[index % COLORS.length] } }), _jsx("span", { className: "text-gray-600 dark:text-gray-300 truncate max-w-[120px]", children: entry.name })] }), _jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: entry.value })] }, entry.name))) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-200", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center", children: [_jsx(Calendar, { className: "w-5 h-5 mr-2 text-whatsapp" }), "Overview"] }), _jsxs("div", { className: "space-y-3 mt-4", children: [_jsxs("div", { className: "flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400 text-sm", children: "Total Messages" }), _jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: analysis.totalMessages.toLocaleString() })] }), _jsxs("div", { className: "flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400 text-sm", children: "Date Range" }), _jsxs("span", { className: "font-medium text-gray-900 dark:text-white text-xs text-right", children: [analysis.dateRange.start?.toLocaleDateString(), " - ", _jsx("br", {}), analysis.dateRange.end?.toLocaleDateString()] })] })] })] })] })] }) })] }));
};
export default ChatDashboard;
