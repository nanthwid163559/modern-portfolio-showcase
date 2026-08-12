import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { PortfolioProfile, ChatMessage, Project, Skill } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PortfolioProfile;
  projects: Project[];
  skills: Skill[];
  currentTheme: ThemeColor;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  skills,
  currentTheme
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `สวัสดีครับ! ผมคือ AI Assistant ประจำพอร์ทโฟลิโอของ ${profile.name} 🤖✨\n\nยินดีตอบทุกคำถามเกี่ยวกับ ทักษะ, ประวัติการทำงาน, และผลงานเด่น สามารถเลือกถามได้จากตัวอย่างด้านล่างหรือพิมพ์ถามได้เลยครับ!`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const themeScheme = themeSchemes[currentTheme];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    "สรุปจุดเด่นและ Tech Stack หลัก",
    "ช่วยแนะนำผลงานโปรเจกต์เด่นที่สุด 2 อัน",
    "ประสบการณ์ทำงานกี่ปี เคยทำที่ไหนบ้าง?",
    "ช่องทางติดต่อจ้างงานเร่งด่วน"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const skillsSummary = skills.map(s => `${s.name} (${s.category}, ${s.proficiency}%)`).join(', ');
      const projectsSummary = projects.map(p => `${p.title} [${p.category}]: ${p.shortDescription}`).join(' | ');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          profileContext: {
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            aboutDetail: profile.aboutDetail,
            location: profile.location,
            email: profile.email,
            statusText: profile.statusText,
            skillsSummary,
            projectsSummary
          }
        })
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || "ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้",
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ AI: ${err?.message || 'โปรดตรวจสอบ GEMINI_API_KEY'}`,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      
      <div 
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r ${themeScheme.gradientFrom} ${themeScheme.gradientTo} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight">
                AI Career Assistant
              </h3>
              <p className="text-[11px] opacity-80">
                ถามตอบข้อมูลผลงานของ {profile.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' 
                  ? `${themeScheme.primary} text-white` 
                  : 'bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] space-y-1`}>
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? `${themeScheme.primary} text-white rounded-tr-none shadow-sm`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}>
                  {msg.text}
                </div>
                <div className={`text-[10px] text-slate-400 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>AI กำลังประมวลผลคำตอบ...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>คำถามที่พบบ่อย (คลิกเพื่อถาม):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all text-left truncate max-w-xs cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="พิมพ์คำถามถึง AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2.5 rounded-xl ${themeScheme.primary} text-white disabled:opacity-40 transition-all cursor-pointer`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
