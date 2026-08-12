import React from 'react';
import { Quote, Star, MessageCircleCode } from 'lucide-react';
import { Testimonial } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  currentTheme: ThemeColor;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  currentTheme
}) => {
  if (!testimonials || testimonials.length === 0) return null;

  const themeScheme = themeSchemes[currentTheme];

  return (
    <section className="py-20 relative bg-[#0A0A0A] text-[#F5F5F5] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B00]/10 border border-[#FF3B00]/40 text-[#FF3B00] font-mono text-xs uppercase tracking-widest font-bold">
            <MessageCircleCode className="w-3.5 h-3.5" />
            <span>ENDORSEMENTS & TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-anton uppercase tracking-tight text-white leading-none">
            CLIENT <span className="text-[#FF3B00]">RECOMMENDATIONS</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative p-6 sm:p-8 bg-[#111111] border border-white/15 hover:border-[#FF3B00] transition-all space-y-6 flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-[#FF3B00]/20 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF3B00] text-[#FF3B00]" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-300 font-serif italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <img
                  src={t.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                  alt={t.author}
                  className="w-12 h-12 object-cover border border-[#FF3B00] shrink-0"
                />
                <div>
                  <h4 className="font-anton text-base uppercase text-white tracking-wide">
                    {t.author}
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    {t.role} • <span className="text-slate-200">{t.company}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
