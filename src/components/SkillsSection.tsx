import React, { useState } from 'react';
import { 
  Code2, 
  Server, 
  Cpu, 
  Database, 
  Cloud, 
  Palette, 
  Globe, 
  Sparkles, 
  FileCode, 
  Layout, 
  CheckCircle,
  Layers
} from 'lucide-react';
import { Skill, SkillCategory } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface SkillsSectionProps {
  skills: Skill[];
  currentTheme: ThemeColor;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  currentTheme
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const themeScheme = themeSchemes[currentTheme];

  const categories: string[] = [
    'All',
    'Frontend',
    'Backend',
    'AI & ML',
    'Database',
    'DevOps & Cloud',
    'Design & Tools'
  ];

  const filteredSkills = skills.filter((skill) => {
    if (selectedCategory === 'All') return true;
    return skill.category === selectedCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5 text-indigo-500" />;
      case 'FileCode': return <FileCode className="w-5 h-5 text-blue-500" />;
      case 'Palette': return <Palette className="w-5 h-5 text-pink-500" />;
      case 'Server': return <Server className="w-5 h-5 text-emerald-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Database': return <Database className="w-5 h-5 text-cyan-500" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-rose-500" />;
      case 'Layout': return <Layout className="w-5 h-5 text-teal-500" />;
      default: return <Globe className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <section id="skills" className="py-20 relative bg-[#0A0A0A] text-[#F5F5F5] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B00]/10 border border-[#FF3B00]/40 text-[#FF3B00] font-mono text-xs uppercase tracking-widest font-bold">
            <Code2 className="w-3.5 h-3.5" />
            <span>CORE COMPETENCIES</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-anton uppercase tracking-tight text-white leading-none">
            TECHNICAL <span className="text-[#FF3B00]">SKILLS</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            A comprehensive matrix of modern web architecture, frontend craftsmanship, backend microservices, and AI integrations.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-anton uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                  : 'bg-[#111111] text-slate-300 border-white/15 hover:border-[#FF3B00] hover:text-[#FF3B00]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group p-5 bg-[#111111] border border-white/15 hover:border-[#FF3B00] transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-black border border-white/10 text-[#FF3B00] group-hover:border-[#FF3B00] transition-all">
                    {getIcon(skill.iconName)}
                  </div>
                  <div>
                    <h3 className="font-anton text-lg uppercase text-white tracking-wide">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {skill.category}
                    </span>
                  </div>
                </div>

                {skill.years > 0 && (
                  <span className="px-2 py-1 font-mono text-[10px] font-bold bg-white/5 text-[#FF3B00] border border-white/10 uppercase">
                    {skill.years} YRS
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>PROFICIENCY</span>
                  <span className="text-[#FF3B00] font-bold">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 bg-black border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#FF3B00] transition-all duration-1000"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
