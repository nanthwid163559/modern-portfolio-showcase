import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Settings, 
  Menu, 
  X, 
  Sparkles, 
  Briefcase, 
  User, 
  Code, 
  Mail, 
  Award,
  Palette,
  Server
} from 'lucide-react';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface NavbarProps {
  name: string;
  title: string;
  currentTheme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onOpenEditor: () => void;
  onOpenAIChat: () => void;
  onOpenAdminPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  name,
  currentTheme,
  setTheme,
  darkMode,
  setDarkMode,
  onOpenEditor,
  onOpenAIChat,
  onOpenAdminPortal
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const themeScheme = themeSchemes[currentTheme];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'เกี่ยวกับฉัน', href: '#about', icon: User },
    { name: 'ผลงานเด่น', href: '#projects', icon: Briefcase },
    { name: 'ทักษะ & ความสามารถ', href: '#skills', icon: Code },
    { name: 'ประวัติการทำงาน', href: '#experience', icon: Award },
    { name: 'ติดต่อ', href: '#contact', icon: Mail },
  ];

  const themesList: { id: ThemeColor; name: string; colorClass: string }[] = [
    { id: 'orange', name: 'Artistic Orange (#FF3B00)', colorClass: 'bg-[#FF3B00]' },
    { id: 'indigo', name: 'Indigo Purple', colorClass: 'bg-indigo-500' },
    { id: 'emerald', name: 'Emerald Teal', colorClass: 'bg-emerald-500' },
    { id: 'violet', name: 'Violet Fuchsia', colorClass: 'bg-violet-500' },
    { id: 'cyan', name: 'Cyan Blue', colorClass: 'bg-cyan-500' },
    { id: 'amber', name: 'Amber Glow', colorClass: 'bg-amber-500' },
    { id: 'rose', name: 'Rose Red', colorClass: 'bg-rose-500' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0A0A0A]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg border-b border-white/10 py-3' 
          : 'bg-[#0A0A0A]/70 backdrop-blur-sm py-4 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo / Name */}
        <a 
          href="#" 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-8 h-8 bg-[#FF3B00] rounded-full flex items-center justify-center font-anton text-black text-base shadow-lg group-hover:scale-110 transition-transform">
            {name ? name.charAt(0).toUpperCase() : 'V'}
          </div>
          <div className="flex flex-col">
            <span className="font-anton tracking-tight text-white text-lg leading-snug group-hover:text-[#FF3B00] transition-colors uppercase">
              {name || 'VACHIRAWIT.P'}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Artistic Edition
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-slate-300">
          {navLinks.map((link) => {
            return (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#FF3B00] transition-colors py-1 relative group"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF3B00] group-hover:w-full transition-all duration-300"></span>
              </a>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAIChat}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r ${themeScheme.gradientFrom} ${themeScheme.gradientTo} text-white shadow-md hover:opacity-95 hover:scale-[1.02] transition-all cursor-pointer`}
            title="Ask AI Career Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Assistant</span>
          </button>

          {/* Theme Accent Picker */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 transition-all cursor-pointer"
              title="Change Accent Color"
            >
              <Palette className="w-4 h-4" />
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  เลือกโทนสีเว็บ
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {themesList.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        currentTheme === t.id
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${t.colorClass}`} />
                      <span>{t.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 transition-all cursor-pointer"
            title={darkMode ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Admin Backend Portal Button */}
          {onOpenAdminPortal && (
            <button
              onClick={onOpenAdminPortal}
              className="px-3 py-2 bg-[#FF3B00] text-black font-anton text-xs uppercase tracking-wider hover:bg-[#ff5520] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title="แผงควบคุมหลังบ้าน Admin Dashboard & REST APIs"
            >
              <Server className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">หลังบ้าน (ADMIN)</span>
            </button>
          )}

          {/* Personalize / Edit Portfolio Button */}
          <button
            onClick={onOpenEditor}
            className={`p-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 font-medium text-xs cursor-pointer`}
            title="ปรับแต่งโปรไฟล์และข้อมูลผลงานของคุณ"
          >
            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden lg:inline">แก้ไขข้อมูล</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 backdrop-blur-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{link.name}</span>
              </a>
            );
          })}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAIChat();
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r ${themeScheme.gradientFrom} ${themeScheme.gradientTo} text-white shadow-sm`}
            >
              <Sparkles className="w-4 h-4" />
              <span>คุยกับ AI Assistant</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
