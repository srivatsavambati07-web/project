import React from 'react';
import { 
  Globe, 
  Sun, 
  Moon, 
  User, 
  Terminal, 
  ShieldAlert, 
  Compass,
  FileText,
  BarChart2,
  Info
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: 'audit' | 'benchmarks' | 'history' | 'about' | 'reports') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenDirectory: () => void;
  onOpenReports: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  onToggleTheme,
  onOpenDirectory,
  onOpenReports,
  onOpenAbout
}) => {
  return (
    <header 
      id="accessgov-header" 
      className="border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] sticky top-0 z-30 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-8">
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('audit')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
            id="brand-logo-container"
          >
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-sky-600 to-indigo-700 dark:from-sky-500 dark:to-cyan-400 flex items-center justify-center text-white shadow-sm ring-2 ring-sky-500/20">
              {/* Stylized Emblem / Chakra Symbol */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <path d="m5.6 5.6 12.8 12.8" />
                <path d="m18.4 5.6-12.8 12.8" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                AccessGov
              </h1>
              <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-0.5 block">
                GIGW & WCAG INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-sky-100/70 text-sky-950 font-semibold dark:bg-slate-800 dark:text-sky-300 dark:border dark:border-slate-700/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
              }`}
              id="nav-tab-dashboard"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('audit');
                document.getElementById('target-url-input')?.focus();
              }}
              className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              id="nav-tab-scan"
            >
              Scan Website
            </button>
            <button
              onClick={onOpenReports}
              className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              id="nav-tab-reports"
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'benchmarks'
                  ? 'bg-sky-100/70 text-sky-950 font-semibold dark:bg-slate-800 dark:text-sky-300 dark:border dark:border-slate-700/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
              }`}
              id="nav-tab-compare"
            >
              Compare Sites
            </button>
            <button
              onClick={onOpenAbout}
              className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              id="nav-tab-about"
            >
              About
            </button>
          </nav>
        </div>

        {/* Right Side: Hackathon pill, Directory button, Theme toggle & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Gov-Tech Hackathon Edition Pill */}
          <div 
            className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 px-2.5 py-1 rounded-full"
            id="badge-hackathon-edition"
          >
            <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Gov-Tech Hackathon Edition</span>
          </div>

          {/* National Portal Directory Button */}
          <button
            onClick={onOpenDirectory}
            className="text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            id="btn-national-directory"
            title="Browse Central & State Government Portals"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">National Portal Directory</span>
          </button>

          {/* Theme Toggle Button (☀️ Light / 🌙 Dark) */}
          <button
            onClick={onToggleTheme}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            id="btn-theme-toggle"
            title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* User Profile Avatar */}
          <div 
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer hover:ring-2 hover:ring-sky-500/30 transition-all"
            title="NIC Auditor / Officer Profile"
            id="btn-user-profile"
          >
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
