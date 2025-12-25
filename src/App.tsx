import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FileUploader from './components/FileUploader';
import ChatDashboard from './components/ChatDashboard';
import Footer from './components/Footer';
import Header from './components/Header';
import HowToUse from './components/HowToUse';
import { parseChatFile, parseChatText, analyzeChat } from './services/chatParser';
import { type Message, type ChatAnalysis, ViewMode } from './types';

const generateDemoData = (): Message[] => {
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

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.UPLOAD);
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('chatlens_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('chatlens_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const processMessages = (msgs: Message[], persist: boolean = true) => {
    setLoading(true);
    // Use a small delay for smoother transition
    setTimeout(() => {
      const result = analyzeChat(msgs);
      setMessages(msgs);
      setAnalysis(result);
      setViewMode(ViewMode.DASHBOARD);
      if (persist) {
        localStorage.setItem('chatlens_messages', JSON.stringify(msgs));
      }
      setLoading(false);
    }, 400);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const msgs = await parseChatFile(file);
      if (msgs.length === 0) {
        alert("No messages found. Please check if it's a valid WhatsApp text export.");
        setLoading(false);
        return;
      }
      processMessages(msgs, true);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error parsing file. Make sure it's a valid text file.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Clear current analysis and uploaded data?")) {
      setMessages([]);
      setAnalysis(null);
      setViewMode(ViewMode.UPLOAD);
      localStorage.removeItem('chatlens_messages');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-whatsapp-chat-dark flex flex-col transition-colors duration-200">
      {(viewMode === ViewMode.UPLOAD || viewMode === ViewMode.HOW_TO_USE) && (
        <Header 
          currentView={viewMode} 
          onNavigate={setViewMode} 
          theme={theme} 
          onToggleTheme={toggleTheme} 
        />
      )}

      <main className="flex-grow">
        {loading && (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
             <div className="relative">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-brand"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-2 w-2 bg-whatsapp-brand rounded-full animate-ping"></div>
               </div>
             </div>
             <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse text-sm font-medium">Crunching your chat history...</p>
          </div>
        )}
        
        {!loading && viewMode === ViewMode.UPLOAD && (
          <div className="animate-fadeIn">
            <Hero onDemoLoad={() => processMessages(generateDemoData(), false)} />
            <div className="py-12 bg-gray-50 dark:bg-whatsapp-chat-dark/50">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Start your analysis</h2>
              </div>
              <FileUploader onFileUpload={handleFileUpload} />
              
              <div className="max-w-xl mx-auto mt-12 px-6">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🔒 <strong>Privacy First:</strong> Your chat data never leaves your device. All analytics happen locally in your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && viewMode === ViewMode.HOW_TO_USE && (
          <HowToUse onBack={() => setViewMode(ViewMode.UPLOAD)} />
        )}

        {!loading && viewMode === ViewMode.DASHBOARD && analysis && (
          <ChatDashboard 
            messages={messages} 
            analysis={analysis} 
            onReset={handleReset}
            isDarkMode={theme === 'dark'}
            onToggleTheme={toggleTheme}
          />
        )}
      </main>
      
      {(viewMode === ViewMode.UPLOAD || viewMode === ViewMode.HOW_TO_USE) && <Footer />}
    </div>
  );
};

export default App;