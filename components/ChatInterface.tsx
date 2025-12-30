
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Message } from '../types';
import { MOCK_ALERTS, MOCK_RESOURCES } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I am AegisFlow AI. I can analyze your cloud spend, check for security vulnerabilities, or automate remediation tasks. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = {
      active_resources: MOCK_RESOURCES,
      recent_alerts: MOCK_ALERTS,
      cloud_status: 'Healthy',
      last_remediation: '2 hours ago'
    };

    const aiResponse = await geminiService.queryCloudAssistant(input, context);
    
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agentic AI Assistant</h1>
          <p className="text-slate-400 mt-1">Natural language interface to your cloud infrastructure.</p>
        </div>
      </header>

      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col overflow-hidden relative">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase opacity-50">
                    {msg.role === 'user' ? 'You' : 'AegisFlow AI'}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-slate-500 font-medium">AegisFlow is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center space-x-3 max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-2 pr-4 shadow-xl focus-within:border-indigo-500/50 transition-all">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="e.g., 'Why did our AWS bill spike?' or 'Fix all public S3 buckets'"
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-slate-100 placeholder:text-slate-500 text-sm md:text-base"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`p-2 rounded-xl transition-all duration-200 ${
                input.trim() ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-2 uppercase font-bold tracking-widest">Powered by Gemini Pro Vision & Agentic Automation</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
