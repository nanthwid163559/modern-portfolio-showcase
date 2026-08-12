import React from 'react';
import { 
  ArrowDown, 
  Sparkles, 
  MapPin, 
  Mail, 
  Download, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Award,
  FolderGit2
} from 'lucide-react';
import { PortfolioProfile } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface HeroProps {
  profile: PortfolioProfile;
  currentTheme: ThemeColor;
  onOpenAIChat: () => void;
  onOpenEditor: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  currentTheme,
  onOpenAIChat,
  onOpenEditor
}) => {
  const themeScheme = themeSchemes[currentTheme];

  return (
    <section id="about" className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-[#0A0A0A] text-[#F5F5F5]">
      
      {/* Background Decorative Outline Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <h1 className="font-anton text-[180px] sm:text-[280px] leading-none text-outline opacity-10 select-none tracking-tighter uppercase">
          CREATIVE
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[600px]">
          
          {/* Left Column: Bio & Display Headline */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-10">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-[#FF3B00] rounded-full animate-ping"></span>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF3B00] font-mono font-bold">
                  {profile.statusText || 'SELECTED WORKS 2024—2026'}
                </p>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-anton leading-none uppercase tracking-tight text-white">
                DESIGNING <br />
                DIGITAL <br />
                <span className="text-[#FF3B00]">{profile.name ? profile.name.split(' ')[0] : 'REALITIES'}</span>
              </h1>

              <p className="text-xl sm:text-2xl font-anton text-slate-300 uppercase tracking-wide">
                {profile.title}
              </p>
            </div>

            {/* Serif Italic Quote & Bio */}
            <div className="max-w-xl space-y-3 pt-2">
              <blockquote className="font-serif italic text-xl sm:text-2xl text-slate-300 border-l-2 border-[#FF3B00] pl-4">
                “{profile.tagline || 'Pushing boundaries between aesthetic and function.'}”
              </blockquote>
              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                {profile.bio}
              </p>
            </div>

            {/* Contact Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-2">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#FF3B00]" />
                <span>{profile.location || 'BANGKOK, TH'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded border border-white/10">
                <Mail className="w-3.5 h-3.5 text-[#FF3B00]" />
                <span>{profile.email}</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-none font-anton text-sm uppercase tracking-wider text-black bg-[#FF3B00] hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-lg"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>EXPLORE WORKS</span>
              </a>

              <a
                href="#contact"
                className="px-6 py-3.5 rounded-none font-anton text-sm uppercase tracking-wider text-white border border-white/30 hover:border-[#FF3B00] hover:text-[#FF3B00] transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CONTACT ME</span>
              </a>

              <button
                onClick={onOpenAIChat}
                className="px-4 py-3.5 rounded-none font-mono text-xs uppercase tracking-wider text-[#FF3B00] border border-[#FF3B00]/40 hover:bg-[#FF3B00]/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF3B00] animate-spin-slow" />
                <span>ASK AI ASSISTANT</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-widest">CONNECT:</span>
              {profile.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00] text-slate-300 transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00] text-slate-300 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00] text-slate-300 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00] text-slate-300 transition-all">
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>

          {/* Right Column: Visual Card & Metrics */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Card Frame with Brutal Borders */}
            <div className="relative border border-white/20 p-4 bg-[#111111] group">
              <div className="aspect-[4/3] overflow-hidden bg-black relative border border-white/10">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-[#FF3B00] text-black font-anton text-xs uppercase tracking-widest">
                  PORTFOLIO
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <h3 className="font-anton text-xl text-white uppercase">{profile.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{profile.title}</p>
                </div>
                <div className="w-3 h-3 bg-[#FF3B00]"></div>
              </div>
            </div>

            {/* Metrics Counter Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-white/15 p-4 bg-[#111111] text-center">
                <div className="font-anton text-3xl text-[#FF3B00]">{profile.yearsExperience}+</div>
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">YEARS EXP</div>
              </div>
              <div className="border border-white/15 p-4 bg-[#111111] text-center">
                <div className="font-anton text-3xl text-white">{profile.completedProjects}+</div>
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">PROJECTS</div>
              </div>
              <div className="border border-white/15 p-4 bg-[#111111] text-center">
                <div className="font-anton text-3xl text-white">{profile.happyClients}+</div>
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">CLIENTS</div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
