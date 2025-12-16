import React from 'react';
import { Search, Shield, Zap, FileText } from 'lucide-react';

interface HeroProps {
  onDemoLoad: () => void;
}

const Hero: React.FC<HeroProps> = ({ onDemoLoad }) => {
  return (
    <div className="bg-white dark:bg-gray-900 pb-16 pt-10 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6">
          Search WhatsApp Chat <br/>
          <span className="text-whatsapp">Exports Instantly</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Upload your exported .txt chat file and search by keyword, sender, or date — directly in your browser. No data is sent to any server.
        </p>
        
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={onDemoLoad}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-whatsapp-dark bg-whatsapp-light hover:bg-green-200 transition-colors cursor-pointer"
          >
            <FileText className="w-5 h-5 mr-2" />
            Try Demo Chat
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 transition hover:shadow-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search by Keyword</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Instantly find messages using phrases or words from your chat history.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 transition hover:shadow-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mx-auto mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Powered</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Use Gemini AI to summarize lengthy conversations and extract key topics.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 transition hover:shadow-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mx-auto mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">100% Private</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              All processing happens in your browser. Your data never leaves your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;