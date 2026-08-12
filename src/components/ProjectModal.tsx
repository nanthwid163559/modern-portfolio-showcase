import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Github, 
  Calendar, 
  UserCheck, 
  Briefcase, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { Project } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  currentTheme: ThemeColor;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  currentTheme
}) => {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const themeScheme = themeSchemes[currentTheme];

  const images = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [project.imageUrl];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${themeScheme.badgeBg} ${themeScheme.badgeText}`}>
              {project.category}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.completionDate}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* Main Gallery Showcase */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video group">
            <img
              src={images[activeImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeImageIndex === idx ? 'w-5 bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Project Title & Short Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {project.title}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Key Metrics / Highlights */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 text-center"
                >
                  <div className={`text-lg font-black ${themeScheme.textAccent}`}>
                    {m.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Details Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            {project.client && (
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-400 uppercase">ลูกค้า/องค์กร:</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">{project.client}</span>
              </div>
            )}
            {project.role && (
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-400 uppercase">บทบาทหน้าที่:</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">{project.role}</span>
              </div>
            )}
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              รายละเอียดผลงาน & สถาปัตยกรรม
            </h3>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-850/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              {project.fullDescription || project.shortDescription}
            </div>
          </div>

          {/* Technologies Used Tags */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              เทคโนโลยีและเครื่องมือที่ใช้ (Tech Stack)
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            * คลิกเพื่อเปิดดูซอร์สโค้ดหรือเว็บไซต์จริง
          </div>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${themeScheme.gradientFrom} ${themeScheme.gradientTo} shadow-md hover:scale-105 transition-all flex items-center gap-1.5`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>ดูเดโมจริง (Live Demo)</span>
              </a>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
