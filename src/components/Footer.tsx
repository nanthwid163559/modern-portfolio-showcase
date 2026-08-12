import React from 'react';
import { 
  ArrowUp, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Heart,
  Sparkles
} from 'lucide-react';
import { PortfolioProfile } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface FooterProps {
  profile: PortfolioProfile;
  currentTheme: ThemeColor;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  currentTheme
}) => {
  const themeScheme = themeSchemes[currentTheme];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-[#F5F5F5] border-t border-white/15 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF3B00] text-black font-anton text-2xl flex items-center justify-center">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <h3 className="font-anton text-2xl uppercase tracking-wider text-white leading-none">
                  {profile.name}
                </h3>
                <p className="font-mono text-xs text-[#FF3B00] uppercase mt-1">
                  {profile.title}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-normal">
              {profile.tagline || profile.bio}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#FF3B00] uppercase tracking-widest">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-300 uppercase">
              <li>
                <a href="#about" className="hover:text-[#FF3B00] transition-colors">
                  01 // ABOUT
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#FF3B00] transition-colors">
                  02 // SELECTED WORKS
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-[#FF3B00] transition-colors">
                  03 // SKILLS MATRIX
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[#FF3B00] transition-colors">
                  04 // EXPERIENCE
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#FF3B00] transition-colors">
                  05 // CONTACT
                </a>
              </li>
            </ul>
          </div>

          {/* Socials & Back to Top */}
          <div className="md:col-span-4 space-y-4 flex flex-col items-start md:items-end justify-between h-full">
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-[#FF3B00] uppercase tracking-widest md:text-right">
                SOCIAL CHANNELS
              </h4>
              <div className="flex items-center gap-2">
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#111111] border border-white/15 text-white hover:border-[#FF3B00] hover:text-[#FF3B00] transition-all"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#111111] border border-white/15 text-white hover:border-[#FF3B00] hover:text-[#FF3B00] transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#111111] border border-white/15 text-white hover:border-[#FF3B00] hover:text-[#FF3B00] transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#111111] border border-white/15 text-white hover:border-[#FF3B00] hover:text-[#FF3B00] transition-all"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="px-4 py-2 bg-[#111111] border border-white/15 text-xs font-mono uppercase text-white hover:border-[#FF3B00] hover:text-[#FF3B00] transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowUp className="w-4 h-4 text-[#FF3B00]" />
              <span>TOP OF PAGE</span>
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} {profile.name.toUpperCase()}. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-1.5">
            <span>ARTISTIC FLAIR EDITION</span>
            <span className="text-[#FF3B00]">•</span>
            <span>BUILT WITH REACT & TAILWIND</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
