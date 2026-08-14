import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  Upload, 
  RotateCcw, 
  User, 
  FolderGit2, 
  Code2, 
  Briefcase,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { PortfolioConfig, PortfolioProfile, Project, Skill, Experience, CategoryType, SkillCategory } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';
import { defaultPortfolioData } from '../data/defaultPortfolio';

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioConfig;
  onSaveConfig: (newConfig: PortfolioConfig) => void;
  currentTheme: ThemeColor;
}

export const EditPortfolioModal: React.FC<EditPortfolioModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  currentTheme
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'experience' | 'backup'>('profile');
  const [tempConfig, setTempConfig] = useState<PortfolioConfig>(JSON.parse(JSON.stringify(config)));
  const [refiningField, setRefiningField] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const themeScheme = themeSchemes[currentTheme];

  // Save changes
  const handleSave = () => {
    onSaveConfig(tempConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  // AI Refine Helper
  const handleAIRefine = async (textToRefine: string, fieldPath: string, typeName: string) => {
    if (!textToRefine || refiningField) return;
    setRefiningField(fieldPath);

    try {
      const res = await fetch('/api/refine-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRefine,
          type: typeName,
          style: 'Professional, Engaging, and Impactful'
        })
      });

      const data = await res.json();
      if (data.refinedText) {
        if (fieldPath === 'bio') {
          setTempConfig(prev => ({
            ...prev,
            profile: { ...prev.profile, bio: data.refinedText }
          }));
        } else if (fieldPath === 'aboutDetail') {
          setTempConfig(prev => ({
            ...prev,
            profile: { ...prev.profile, aboutDetail: data.refinedText }
          }));
        } else if (fieldPath.startsWith('project-short-')) {
          const index = parseInt(fieldPath.replace('project-short-', ''));
          setTempConfig(prev => {
            const updated = [...prev.projects];
            updated[index].shortDescription = data.refinedText;
            return { ...prev, projects: updated };
          });
        } else if (fieldPath.startsWith('exp-desc-')) {
          const index = parseInt(fieldPath.replace('exp-desc-', ''));
          setTempConfig(prev => {
            const updated = [...(prev.experiences || [])];
            updated[index].description = data.refinedText;
            return { ...prev, experiences: updated };
          });
        }
      }
    } catch (err) {
      console.error('AI Refine failed', err);
    } finally {
      setRefiningField(null);
    }
  };

  // Project Operations
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: "โปรเจกต์ใหม่ (New Project)",
      category: "Web",
      shortDescription: "คำอธิบายโปรเจกต์ย่อๆ บรรยายจุดเด่นและเทคโนโลยี",
      fullDescription: "รายละเอียดผลงานอย่างสมบูรณ์",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      gallery: [],
      tags: ["React", "TypeScript", "Tailwind CSS"],
      featured: false,
      completionDate: "2026-01",
      metrics: [{ label: "Impact", value: "High" }]
    };

    setTempConfig(prev => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
  };

  const handleDeleteProject = (id: string) => {
    setTempConfig(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Skill Operations
  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: "ทักษะใหม่ (New Skill)",
      category: "Frontend",
      proficiency: 85,
      iconName: "Code2",
      years: 2,
      featured: true
    };
    setTempConfig(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const handleDeleteSkill = (id: string) => {
    setTempConfig(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  // Experience Operations
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "บริษัทใหม่ (New Company)",
      role: "ตำแหน่งงาน (New Role)",
      period: "2026 - ปัจจุบัน",
      location: "Bangkok, Thailand",
      description: "รายละเอียดการทำงานย่อๆ",
      technologies: ["React", "Node.js"],
      highlights: ["ผลงานเด่นข้อ 1", "ผลงานเด่นข้อ 2"],
      current: false
    };
    setTempConfig(prev => ({
      ...prev,
      experiences: [newExp, ...(prev.experiences || [])]
    }));
  };

  const handleDeleteExperience = (id: string) => {
    setTempConfig(prev => ({
      ...prev,
      experiences: (prev.experiences || []).filter(e => e.id !== id)
    }));
  };

  // Export & Import
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tempConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.profile) {
            setTempConfig(parsed);
          }
        } catch (err) {
          alert('ไฟล์ JSON ไม่ถูกต้อง');
        }
      };
    }
  };

  const handleResetToDefault = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      setTempConfig(JSON.parse(JSON.stringify(defaultPortfolioData)));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#0A0A0A] text-[#F5F5F5] border border-white/20 overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/15 bg-[#111111]">
          <div>
            <h2 className="text-2xl font-anton uppercase tracking-wide text-white flex items-center gap-2">
              <span>EDIT PORTFOLIO CONFIG</span>
              <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#FF3B00]/20 text-[#FF3B00] border border-[#FF3B00]/40">
                LIVE MANAGEMENT
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Customize profile details, showcase projects, tech skills, and exported backups.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-[#FF3B00] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 p-2 bg-black border-b border-white/15 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-anton uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              activeTab === 'profile'
                ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>PROFILE</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-xs font-anton uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              activeTab === 'projects'
                ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>PROJECTS ({tempConfig.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 text-xs font-anton uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              activeTab === 'skills'
                ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>SKILLS ({tempConfig.skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 text-xs font-anton uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              activeTab === 'experience'
                ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>EXPERIENCE ({(tempConfig.experiences || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 text-xs font-anton uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              activeTab === 'backup'
                ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>BACKUP / RESET</span>
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0A0A0A]">
          
          {/* TAB 1: Profile Form */}
          {activeTab === 'profile' && (
            <div className="space-y-4 font-mono">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    value={tempConfig.profile.name}
                    onChange={(e) => setTempConfig(p => ({ ...p, profile: { ...p.profile, name: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">
                    PROFESSIONAL TITLE *
                  </label>
                  <input
                    type="text"
                    value={tempConfig.profile.title}
                    onChange={(e) => setTempConfig(p => ({ ...p, profile: { ...p.profile, title: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">
                  TAGLINE
                </label>
                <input
                  type="text"
                  value={tempConfig.profile.tagline}
                  onChange={(e) => setTempConfig(p => ({ ...p, profile: { ...p.profile, tagline: e.target.value } }))}
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                />
              </div>

              {/* Bio with AI Polish */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">
                    BIO SUMMARY
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIRefine(tempConfig.profile.bio, 'bio', 'Profile Bio')}
                    disabled={refiningField === 'bio'}
                    className="text-[11px] font-bold text-[#FF3B00] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {refiningField === 'bio' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-[#FF3B00]" />}
                    <span>AI REFINE</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={tempConfig.profile.bio}
                  onChange={(e) => setTempConfig(p => ({ ...p, profile: { ...p.profile, bio: e.target.value } }))}
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                />
              </div>

              {/* Contact Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={tempConfig.profile.email}
                    onChange={(e) => setTempConfig(p => ({ ...p, profile: { ...p.profile, email: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    value={tempConfig.profile.phone}
                    onChange={(e) => setTempConfig(p => ({ ...p, profile: { ...p.profile, phone: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={tempConfig.profile.location}
                    onChange={(e) => setTempConfig(p => ({ ...p, profile: { ...p.profile, location: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Avatar Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">
                  AVATAR IMAGE URL
                </label>
                <input
                  type="text"
                  value={tempConfig.profile.avatarUrl}
                  onChange={(e) => setTempConfig(p => ({ ...p, profile: { ...p.profile, avatarUrl: e.target.value } }))}
                  className="w-full px-3.5 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* TAB 2: Projects Form */}
          {activeTab === 'projects' && (
            <div className="space-y-6 font-mono">
              
              <div className="flex items-center justify-between">
                <h3 className="font-anton text-lg uppercase text-white tracking-wide">
                  ALL PROJECTS ({tempConfig.projects.length})
                </h3>
                <button
                  onClick={handleAddProject}
                  className="px-3 py-1.5 font-anton text-xs uppercase text-black bg-[#FF3B00] hover:bg-[#ff5520] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD PROJECT</span>
                </button>
              </div>

              <div className="space-y-4">
                {tempConfig.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-4 bg-[#111111] border border-white/15 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#FF3B00]">
                        # {idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-rose-500 hover:text-rose-400 text-xs flex items-center gap-1 font-bold cursor-pointer uppercase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>DELETE</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">PROJECT TITLE</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTempConfig(prev => {
                              const list = [...prev.projects];
                              list[idx].title = val;
                              return { ...prev, projects: list };
                            });
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">CATEGORY</label>
                        <select
                          value={proj.category}
                          onChange={(e) => {
                            const val = e.target.value as CategoryType;
                            setTempConfig(prev => {
                              const list = [...prev.projects];
                              list[idx].category = val;
                              return { ...prev, projects: list };
                            });
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        >
                          <option value="Web">Web</option>
                          <option value="Mobile">Mobile</option>
                          <option value="AI & Data">AI & Data</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="Full Stack">Full Stack</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-400 uppercase">SHORT DESCRIPTION</label>
                        <button
                          type="button"
                          onClick={() => handleAIRefine(proj.shortDescription, `project-short-${idx}`, 'Project Summary')}
                          className="text-[10px] text-[#FF3B00] font-bold flex items-center gap-0.5 cursor-pointer uppercase"
                        >
                          <Sparkles className="w-3 h-3 text-[#FF3B00]" />
                          <span>AI POLISH</span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={proj.shortDescription}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTempConfig(prev => {
                            const list = [...prev.projects];
                            list[idx].shortDescription = val;
                            return { ...prev, projects: list };
                          });
                        }}
                        className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                      />
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: Skills Form */}
          {activeTab === 'skills' && (
            <div className="space-y-6 font-mono">
              
              <div className="flex items-center justify-between">
                <h3 className="font-anton text-lg uppercase text-white tracking-wide">
                  TECHNICAL SKILLS ({tempConfig.skills.length})
                </h3>
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 font-anton text-xs uppercase text-black bg-[#FF3B00] hover:bg-[#ff5520] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD SKILL</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tempConfig.skills.map((skill, idx) => (
                  <div
                    key={skill.id}
                    className="p-3.5 bg-[#111111] border border-white/15 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTempConfig(prev => {
                            const list = [...prev.skills];
                            list[idx].name = val;
                            return { ...prev, skills: list };
                          });
                        }}
                        className="font-bold text-xs bg-black text-white px-2 py-1 border border-white/20 focus:border-[#FF3B00] focus:outline-none flex-1 mr-2"
                      />
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 uppercase">PROFICIENCY (%):</span>
                      <input
                        type="number"
                        min={10}
                        max={100}
                        value={skill.proficiency}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 50;
                          setTempConfig(prev => {
                            const list = [...prev.skills];
                            list[idx].proficiency = val;
                            return { ...prev, skills: list };
                          });
                        }}
                        className="w-16 text-xs bg-black text-[#FF3B00] font-bold px-2 py-1 border border-white/20 text-center focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: Experience Form */}
          {activeTab === 'experience' && (
            <div className="space-y-6 font-mono">
              
              <div className="flex items-center justify-between">
                <h3 className="font-anton text-lg uppercase text-white tracking-wide">
                  WORK HISTORY ({(tempConfig.experiences || []).length})
                </h3>
                <button
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 font-anton text-xs uppercase text-black bg-[#FF3B00] hover:bg-[#ff5520] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD EXPERIENCE</span>
                </button>
              </div>

              <div className="space-y-4">
                {(tempConfig.experiences || []).map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-[#111111] border border-white/15 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#FF3B00]">
                        # {idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-rose-500 hover:text-rose-400 text-xs flex items-center gap-1 font-bold cursor-pointer uppercase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>DELETE</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">COMPANY NAME *</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTempConfig(prev => {
                              const list = [...(prev.experiences || [])];
                              list[idx].company = val;
                              return { ...prev, experiences: list };
                            });
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">ROLE / POSITION *</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTempConfig(prev => {
                              const list = [...(prev.experiences || [])];
                              list[idx].role = val;
                              return { ...prev, experiences: list };
                            });
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">PERIOD (e.g. 2024 - PRESENT)</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTempConfig(prev => {
                              const list = [...(prev.experiences || [])];
                              list[idx].period = val;
                              return { ...prev, experiences: list };
                            });
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">LOCATION</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTempConfig(prev => {
                              const list = [...(prev.experiences || [])];
                              list[idx].location = val;
                              return { ...prev, experiences: list };
                            });
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setTempConfig(prev => {
                                const list = [...(prev.experiences || [])];
                                list[idx].current = val;
                                return { ...prev, experiences: list };
                              });
                            }}
                            className="accent-[#FF3B00]"
                          />
                          <span>CURRENT JOB (งานปัจจุบัน)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-400 uppercase">DESCRIPTION</label>
                        <button
                          type="button"
                          onClick={() => handleAIRefine(exp.description, `exp-desc-${idx}`, 'Job Description')}
                          className="text-[10px] text-[#FF3B00] font-bold flex items-center gap-0.5 cursor-pointer uppercase"
                        >
                          <Sparkles className="w-3 h-3 text-[#FF3B00]" />
                          <span>AI POLISH</span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTempConfig(prev => {
                            const list = [...(prev.experiences || [])];
                            list[idx].description = val;
                            return { ...prev, experiences: list };
                          });
                        }}
                        className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">TECHNOLOGIES (Comma-separated)</label>
                        <input
                          type="text"
                          value={exp.technologies ? exp.technologies.join(', ') : ''}
                          onChange={(e) => {
                            const val = e.target.value.split(',').map(s => s.trim());
                            setTempConfig(prev => {
                              const list = [...(prev.experiences || [])];
                              list[idx].technologies = val;
                              return { ...prev, experiences: list };
                            });
                          }}
                          placeholder="React, Angular, Node.js"
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase">KEY HIGHLIGHTS (Comma-separated)</label>
                        <input
                          type="text"
                          value={exp.highlights ? exp.highlights.join(', ') : ''}
                          onChange={(e) => {
                            const val = e.target.value.split(',').map(s => s.trim());
                            setTempConfig(prev => {
                              const list = [...(prev.experiences || [])];
                              list[idx].highlights = val;
                              return { ...prev, experiences: list };
                            });
                          }}
                          placeholder="Designed system API, Developed dashboard"
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: Backup / Export */}
          {activeTab === 'backup' && (
            <div className="space-y-6 font-mono">
              
              <div className="p-6 bg-[#111111] border border-white/15 space-y-4">
                <h3 className="font-anton text-lg uppercase text-white">
                  EXPORT CONFIG (JSON)
                </h3>
                <p className="text-xs text-slate-400">
                  Save all portfolio state to a portable JSON backup file.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2.5 font-anton text-xs uppercase text-black bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PORTFOLIO-CONFIG.JSON</span>
                </button>
              </div>

              <div className="p-6 bg-[#111111] border border-white/15 space-y-4">
                <h3 className="font-anton text-lg uppercase text-white">
                  IMPORT CONFIG (JSON)
                </h3>
                <p className="text-xs text-slate-400">
                  Upload a previously saved portfolio JSON file to restore settings.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:bg-white/10 file:text-white hover:file:bg-[#FF3B00] hover:file:text-black cursor-pointer"
                />
              </div>

              <div className="p-6 bg-rose-950/30 border border-rose-500/40 space-y-3">
                <h3 className="font-anton text-lg uppercase text-rose-400">
                  RESET TO DEFAULT
                </h3>
                <p className="text-xs text-slate-400">
                  Revert all configurations back to initial template state.
                </p>
                <button
                  onClick={handleResetToDefault}
                  className="px-4 py-2 font-mono text-xs uppercase text-rose-400 bg-black border border-rose-500/50 hover:bg-rose-500 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET DEFAULT DATA</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-6 border-t border-white/15 bg-[#111111] flex items-center justify-between">
          
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF3B00]">
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIG SAVED SUCCESSFULLY!</span>
            </div>
          ) : (
            <span className="text-xs font-mono text-slate-500">
              * Saved directly into browser LocalStorage
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 font-mono text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 font-anton text-sm uppercase text-black bg-[#FF3B00] hover:bg-[#ff5520] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>SAVE CONFIG</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
