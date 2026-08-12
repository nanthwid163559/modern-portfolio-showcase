export type ThemeColor = 'orange' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'cyan' | 'rose';

export interface ColorScheme {
  primary: string;
  primaryHover: string;
  bgGlow: string;
  textAccent: string;
  borderAccent: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
  gradientFrom: string;
  gradientTo: string;
  hexAccent: string;
}

export const themeSchemes: Record<ThemeColor, ColorScheme> = {
  orange: {
    primary: 'bg-[#FF3B00] dark:bg-[#FF3B00] text-black font-bold',
    primaryHover: 'hover:bg-[#e03400] dark:hover:bg-[#e03400]',
    bgGlow: 'from-[#FF3B00]/25 via-amber-500/10 to-transparent',
    textAccent: 'text-[#FF3B00]',
    borderAccent: 'border-[#FF3B00]/40',
    badgeBg: 'bg-[#FF3B00]/10 dark:bg-[#FF3B00]/20',
    badgeText: 'text-[#FF3B00]',
    ring: 'focus:ring-[#FF3B00]',
    gradientFrom: 'from-[#FF3B00]',
    gradientTo: 'to-amber-500',
    hexAccent: '#FF3B00'
  },
  indigo: {
    primary: 'bg-indigo-600 dark:bg-indigo-500',
    primaryHover: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
    bgGlow: 'from-indigo-500/20 via-purple-500/10 to-transparent',
    textAccent: 'text-indigo-600 dark:text-indigo-400',
    borderAccent: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    ring: 'focus:ring-indigo-500',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-purple-600',
    hexAccent: '#6366f1'
  },
  emerald: {
    primary: 'bg-emerald-600 dark:bg-emerald-500',
    primaryHover: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
    bgGlow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    textAccent: 'text-emerald-600 dark:text-emerald-400',
    borderAccent: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    ring: 'focus:ring-emerald-500',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-600',
    hexAccent: '#10b981'
  },
  violet: {
    primary: 'bg-violet-600 dark:bg-violet-500',
    primaryHover: 'hover:bg-violet-700 dark:hover:bg-violet-600',
    bgGlow: 'from-violet-500/20 via-fuchsia-500/10 to-transparent',
    textAccent: 'text-violet-600 dark:text-violet-400',
    borderAccent: 'border-violet-500/30',
    badgeBg: 'bg-violet-50 dark:bg-violet-950/60',
    badgeText: 'text-violet-700 dark:text-violet-300',
    ring: 'focus:ring-violet-500',
    gradientFrom: 'from-violet-500',
    gradientTo: 'to-fuchsia-600',
    hexAccent: '#8b5cf6'
  },
  amber: {
    primary: 'bg-amber-600 dark:bg-amber-500',
    primaryHover: 'hover:bg-amber-700 dark:hover:bg-amber-600',
    bgGlow: 'from-amber-500/20 via-orange-500/10 to-transparent',
    textAccent: 'text-amber-600 dark:text-amber-400',
    borderAccent: 'border-amber-500/30',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    ring: 'focus:ring-amber-500',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-600',
    hexAccent: '#f59e0b'
  },
  cyan: {
    primary: 'bg-cyan-600 dark:bg-cyan-500',
    primaryHover: 'hover:bg-cyan-700 dark:hover:bg-cyan-600',
    bgGlow: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    textAccent: 'text-cyan-600 dark:text-cyan-400',
    borderAccent: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    ring: 'focus:ring-cyan-500',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-blue-600',
    hexAccent: '#06b6d4'
  },
  rose: {
    primary: 'bg-rose-600 dark:bg-rose-500',
    primaryHover: 'hover:bg-rose-700 dark:hover:bg-rose-600',
    bgGlow: 'from-rose-500/20 via-pink-500/10 to-transparent',
    textAccent: 'text-rose-600 dark:text-rose-400',
    borderAccent: 'border-rose-500/30',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    ring: 'focus:ring-rose-500',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-pink-600',
    hexAccent: '#f43f5e'
  }
};
