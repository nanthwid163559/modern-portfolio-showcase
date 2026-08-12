import React, { useState, useEffect } from 'react';
import { PortfolioConfig, Project, ContactMessage } from './types';
import { defaultPortfolioData } from './data/defaultPortfolio';
import { ThemeColor } from './utils/theme';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { AIChatDrawer } from './components/AIChatDrawer';
import { EditPortfolioModal } from './components/EditPortfolioModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export default function App() {
  const [config, setConfig] = useState<PortfolioConfig>(() => {
    try {
      const saved = localStorage.getItem('portfolio_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse portfolio_config from localStorage', e);
    }
    return defaultPortfolioData;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const savedDark = localStorage.getItem('portfolio_dark_mode');
      if (savedDark !== null) {
        return savedDark === 'true';
      }
    } catch (e) {}
    return true;
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(config.theme || 'orange');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load from Backend REST API on mount
  const fetchBackendPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        if (data && data.profile) {
          setConfig(data);
          if (data.theme) setCurrentTheme(data.theme);
        }
      }
    } catch (err) {
      console.warn("Backend REST API offline, falling back to local state.", err);
    }
  };

  useEffect(() => {
    fetchBackendPortfolio();
  }, []);

  // Sync Dark Mode class on html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('portfolio_dark_mode', String(darkMode));
  }, [darkMode]);

  // Sync Config in localStorage + Express Backend REST API
  const handleSaveConfig = async (newConfig: PortfolioConfig) => {
    setConfig(newConfig);
    setCurrentTheme(newConfig.theme);
    try {
      localStorage.setItem('portfolio_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    try {
      await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (e) {
      console.error('Failed to persist to backend REST API', e);
    }
  };

  const handleSendMessage = (msg: ContactMessage) => {
    const updated = {
      ...config,
      inboxMessages: [msg, ...(config.inboxMessages || [])]
    };
    handleSaveConfig(updated);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans transition-colors duration-300 selection:bg-[#FF3B00] selection:text-black">
      
      {/* Header Navigation */}
      <Navbar
        name={config.profile.name}
        title={config.profile.title}
        currentTheme={currentTheme}
        setTheme={(t) => {
          setCurrentTheme(t);
          handleSaveConfig({ ...config, theme: t });
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenEditor={() => setIsEditorOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenAdminPortal={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          profile={config.profile}
          currentTheme={currentTheme}
          onOpenAIChat={() => setIsAIChatOpen(true)}
          onOpenEditor={() => setIsEditorOpen(true)}
        />

        {/* Projects Section */}
        <ProjectsSection
          projects={config.projects}
          currentTheme={currentTheme}
          onSelectProject={(p) => setSelectedProject(p)}
          onOpenEditor={() => setIsEditorOpen(true)}
        />

        {/* Skills Section */}
        <SkillsSection
          skills={config.skills}
          currentTheme={currentTheme}
        />

        {/* Experience & Education Section */}
        <ExperienceSection
          experiences={config.experiences}
          education={config.education}
          currentTheme={currentTheme}
        />

        {/* Testimonials Section */}
        <TestimonialsSection
          testimonials={config.testimonials}
          currentTheme={currentTheme}
        />

        {/* Contact Form Section */}
        <ContactSection
          profile={config.profile}
          currentTheme={currentTheme}
          onSendMessage={handleSendMessage}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={config.profile}
        currentTheme={currentTheme}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        currentTheme={currentTheme}
      />

      {/* AI Career Assistant Drawer */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        profile={config.profile}
        projects={config.projects}
        skills={config.skills}
        currentTheme={currentTheme}
      />

      {/* Live Editor Modal */}
      <EditPortfolioModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        currentTheme={currentTheme}
      />

      {/* Admin Backend Portal Modal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onRefreshData={fetchBackendPortfolio}
      />

    </div>
  );
}
