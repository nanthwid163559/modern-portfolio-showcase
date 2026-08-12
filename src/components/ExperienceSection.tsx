import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';
import { Experience, Education } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface ExperienceSectionProps {
  experiences: Experience[];
  education: Education[];
  currentTheme: ThemeColor;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  education,
  currentTheme
}) => {
  const themeScheme = themeSchemes[currentTheme];

  return (
    <section id="experience" className="py-20 relative bg-[#0A0A0A] text-[#F5F5F5] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B00]/10 border border-[#FF3B00]/40 text-[#FF3B00] font-mono text-xs uppercase tracking-widest font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>CAREER TRACK RECORD</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-anton uppercase tracking-tight text-white leading-none">
            WORK EXPERIENCE & <span className="text-[#FF3B00]">JOURNEY</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            A chronological timeline of engineering leadership, enterprise software delivery, and academic achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Work Experience Timeline */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
              <div className="p-2.5 bg-[#FF3B00] text-black">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-anton text-2xl uppercase tracking-wide text-white">
                WORK HISTORY
              </h3>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l border-white/20 space-y-8 ml-2">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  
                  {/* Timeline Dot Marker */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 border ${
                    exp.current 
                      ? 'bg-[#FF3B00] border-[#FF3B00] ring-4 ring-[#FF3B00]/20' 
                      : 'bg-black border-white/30'
                  }`} />

                  {/* Card Body */}
                  <div className="p-6 bg-[#111111] border border-white/15 hover:border-[#FF3B00] transition-all space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-anton text-xl uppercase text-white tracking-wide">
                            {exp.role}
                          </h4>
                          {exp.current && (
                            <span className="px-2 py-0.5 font-mono text-[10px] uppercase font-bold bg-[#FF3B00]/20 text-[#FF3B00] border border-[#FF3B00]/40">
                              PRESENT
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-mono text-slate-300">
                          {exp.company}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#FF3B00]" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FF3B00]" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {exp.description}
                    </p>

                    {/* Highlights Bullet List */}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-mono text-[#FF3B00] uppercase tracking-wider font-bold">
                          KEY ACHIEVEMENTS:
                        </div>
                        <ul className="space-y-1">
                          {exp.highlights.map((h, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-normal">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3B00] shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 font-mono text-[10px] uppercase bg-white/5 border border-white/10 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Education Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
              <div className="p-2.5 bg-[#FF3B00] text-black">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-anton text-2xl uppercase tracking-wide text-white">
                EDUCATION
              </h3>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 bg-[#111111] border border-white/15 space-y-3"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-400">
                      {edu.period}
                    </span>
                    {edu.honors && (
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-[#FF3B00]/20 text-[#FF3B00] border border-[#FF3B00]/40">
                        {edu.honors}
                      </span>
                    )}
                  </div>

                  <h4 className="font-anton text-lg uppercase text-white">
                    {edu.degree}
                  </h4>
                  <div className="text-xs font-mono text-slate-300">
                    {edu.institution}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
