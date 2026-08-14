import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  Star, 
  Grid, 
  List, 
  ArrowUpRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { Project, CategoryType } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface ProjectsSectionProps {
  projects: Project[];
  currentTheme: ThemeColor;
  onSelectProject: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  currentTheme,
  onSelectProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const themeScheme = themeSchemes[currentTheme];

  const categories: CategoryType[] = [
    'All',
    'Web',
    'Mobile',
    'AI & Data',
    'UI/UX Design',
    'Full Stack',
    'Other'
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesQuery = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="projects" className="py-20 relative bg-[#0A0A0A] text-[#F5F5F5] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B00]/10 border border-[#FF3B00]/40 text-[#FF3B00] font-mono text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SELECTED ARCHIVE</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-anton uppercase tracking-tight text-white leading-none">
              FEATURED <span className="text-[#FF3B00]">PROJECTS</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              An curated showcase of software engineering, web applications, and AI integrations built for high performance.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto custom-scrollbar">
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? projects.length 
                  : projects.filter(p => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-anton uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                      selectedCategory === cat
                        ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                        : 'bg-[#111111] text-slate-300 border-white/15 hover:border-[#FF3B00] hover:text-[#FF3B00]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-mono ${
                      selectedCategory === cat
                        ? 'bg-black text-[#FF3B00]'
                        : 'bg-white/10 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & View Switcher */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="SEARCH WORKS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase rounded-none bg-[#111111] border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              {/* View Switcher Buttons */}
              <div className="flex items-center bg-[#111111] p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#FF3B00] text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#FF3B00] text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Projects Container */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#111111] border border-white/15 p-8 space-y-3">
            <Layers className="w-12 h-12 text-[#FF3B00] mx-auto" />
            <h3 className="text-lg font-anton uppercase text-white">
              NO PROJECTS MATCHED
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Try adjusting filter categories or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-anton uppercase text-black bg-[#FF3B00]"
            >
              RESET FILTERS
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          
          /* Grid View Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group relative bg-[#111111] border border-white/15 overflow-hidden hover:border-[#FF3B00] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badge Header */}
                  <div className="relative aspect-video overflow-hidden bg-black border-b border-white/10">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest bg-black/80 text-[#FF3B00] border border-[#FF3B00]/40">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="px-2 py-0.5 bg-[#FF3B00] text-black font-anton text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <Star className="w-3 h-3 fill-black" />
                          <span>FEATURED</span>
                        </span>
                      )}
                    </div>

                    {/* External Hover Icon */}
                    <div className="absolute bottom-3 right-3 p-2 bg-[#FF3B00] text-black opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-anton text-xl uppercase tracking-tight text-white group-hover:text-[#FF3B00] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Key Metrics Pill */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10 font-mono text-xs">
                        <span className="text-slate-400">
                          {project.metrics[0].label}:
                        </span>
                        <span className="text-[#FF3B00] font-bold">
                          {project.metrics[0].value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="px-5 pb-5 pt-2 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-slate-500">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>

        ) : (

          /* List View Layout */
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group bg-[#111111] border border-white/15 p-4 hover:border-[#FF3B00] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border border-white/10 overflow-hidden bg-black shrink-0">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 font-mono text-[10px] uppercase font-bold text-[#FF3B00] bg-[#FF3B00]/10 border border-[#FF3B00]/30">
                        {project.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {project.completionDate}
                      </span>
                    </div>
                    <h3 className="font-anton text-lg uppercase text-white group-hover:text-[#FF3B00] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="hidden lg:flex items-center gap-1">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 font-mono text-[10px] uppercase bg-white/5 text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="p-2.5 bg-white/5 border border-white/10 text-slate-300 group-hover:bg-[#FF3B00] group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        )}

      </div>
    </section>
  );
};
