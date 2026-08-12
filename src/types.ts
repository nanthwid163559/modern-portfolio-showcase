export type CategoryType = 'All' | 'Web' | 'Mobile' | 'AI & Data' | 'UI/UX Design' | 'Full Stack' | 'Other';

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  discord?: string;
  line?: string;
  website?: string;
}

export interface PortfolioProfile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  aboutDetail: string;
  avatarUrl: string;
  coverUrl: string;
  location: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'hired';
  statusText: string;
  yearsExperience: number;
  completedProjects: number;
  happyClients: number;
  socialLinks: SocialLinks;
  resumeUrl: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  category: CategoryType;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  gallery: string[];
  tags: string[];
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  completionDate: string;
  metrics: ProjectMetric[];
  client?: string;
  role?: string;
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'AI & ML' | 'Design & Tools' | 'DevOps & Cloud';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0 - 100
  iconName: string;
  years: number;
  featured: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  technologies: string[];
  highlights: string[];
  current: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  honors?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
  content: string;
  rating: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PortfolioConfig {
  theme: 'emerald' | 'indigo' | 'violet' | 'amber' | 'cyan' | 'rose' | 'orange';
  darkMode: boolean;
  profile: PortfolioProfile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  testimonials: Testimonial[];
  inboxMessages: ContactMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
