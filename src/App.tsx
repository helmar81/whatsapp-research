import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FileUploader from './components/FileUploader';
import ChatDashboard from './components/ChatDashboard';
import Footer from './components/Footer';
import Header from './components/Header';
import HowToUse from './components/HowToUse';
import { parseChatFile, parseChatText, analyzeChat } from './services/chatParser';
import { type Message, type ChatAnalysis, ViewMode } from './types';
import { useDarkMode } from './hooks/useDarkMode';

/* -------------------------
 * Demo data generator
 * ------------------------ */
const generateDemoData = (): Message[] => {
  const text = `[12/05/2024, 09:15:00] Alice: Hey Bob, did you see the new project requirements?
[12/05/2024, 09:16:20] Bob: Yes, I just read them. Looks like a lot of work for next week.
[13/05/2024, 11:21:30] Alice: I'm in!`;
  return parseChatText(text);
};

const App: React.FC = () => {
  const { isDark, toggle } = useDarkMode();

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.UPLOAD);
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  // Added progress state to give feedback during large file processing
  const [progress, setProgress] = useState(0);

  /* -------------------------
   * Load persisted chat
   * ------------------------ */
  useEffect(() => {
    const savedData = localStorage.getItem('chatlens_messages');
    if (!savedData) return;

    try {
      setLoading(true);
      setProgress(20);
      setTimeout(() => {
        const parsedMsgs: Message[] = JSON.parse(savedData, (k, v) =>
          k === 'date' ? new Date(v) : v
        );

        if (parsedMsgs.length > 0) {
          setMessages(parsedMsgs);
          setAnalysis(analyzeChat(parsedMsgs));
          setViewMode(ViewMode.DASHBOARD);
        }
        setLoading(false);
      }, 300);
    } catch (err) {
      console.error('Failed to load saved chat:', err);
      localStorage.removeItem('chatlens_messages');
      setLoading(false);
    }
  }, []);

  /* -------------------------
   * Helpers
   * ------------------------ */
  const processMessages = (msgs: Message[], persist = true) => {
    setLoading(true);
    setProgress(10);

    // Use setTimeout to allow the browser to update the UI before heavy processing starts
    setTimeout(() => {
      try {
        setMessages(msgs);
        setProgress(40);
        
        const result = analyzeChat(msgs);
        setAnalysis(result);
        setProgress(70);
        
        setViewMode(ViewMode.DASHBOARD);

        if (persist) {
          const serialized = JSON.stringify(msgs);
          // Only save to localStorage if chat is under 4MB to prevent quota crashes
          if (serialized.length < 4000000) {
            localStorage.setItem('chatlens_messages', serialized);
          } else {
            console.warn("Chat too large to save in browser memory. It will work for this session only.");
          }
        }
        setProgress(100);
      } catch (err) {
        console.error("Processing error:", err);
        alert("Something went wrong while analyzing the chat.");
      }
      setLoading(false);
    }, 100);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      setProgress(5);
      const msgs = await parseChatFile(file);
      if (!msgs.length) {
        alert('No messages found.');
        setLoading(false);
        return;
      }
      processMessages(msgs);
    } catch {
      alert('Error parsing file.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setAnalysis(null);
    setViewMode(ViewMode.UPLOAD);
    localStorage.removeItem('chatlens_messages');
    setProgress(0);
  };

  const navigateTo = (mode: ViewMode) => {
    if (mode === ViewMode.UPLOAD) {
      handleReset();
    } else {
      setViewMode(mode);
    }
  };

  /* -------------------------
   * Loading screen
   * ------------------------ */
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center transition-colors">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-whatsapp-brand/20 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-whatsapp-brand rounded-full animate-spin"
            style={{ borderTopColor: 'transparent', clipPath: 'inset(0 0 50% 0)' }}
          ></div>
        </div>
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-whatsapp-brand transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          Analyzing {messages.length > 0 ? messages.length : 'your'} messages... {progress}%
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col transition-colors">
      {(viewMode === ViewMode.UPLOAD || viewMode === ViewMode.HOW_TO_USE) && (
        <Header
          currentView={viewMode}
          onNavigate={navigateTo}
          isDark={isDark}
          onToggleTheme={toggle} 
          theme={isDark ? 'dark' : 'light'} />
      )}

      <main className="flex-grow">
        {viewMode === ViewMode.UPLOAD && (
          <>
            <Hero onDemoLoad={() => processMessages(generateDemoData(), false)} />
            <section className="py-12 bg-muted-light dark:bg-muted-dark transition-colors">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ready to analyze?</h2>
                <p className="text-gray-500 dark:text-gray-400">Upload your _chat.txt file below</p>
              </div>
              <FileUploader onFileUpload={handleFileUpload} />
            </section>
          </>
        )}

        {viewMode === ViewMode.HOW_TO_USE && <HowToUse onBack={() => navigateTo(ViewMode.UPLOAD)} />}

        {viewMode === ViewMode.DASHBOARD && analysis && (
          <ChatDashboard
            messages={messages}
            analysis={analysis}
            onReset={handleReset}
            isDarkMode={isDark}
            onToggleTheme={toggle}
          />
        )}
      </main>

      {(viewMode === ViewMode.UPLOAD || viewMode === ViewMode.HOW_TO_USE) && <Footer />}
    </div>
  );
};

export default App;