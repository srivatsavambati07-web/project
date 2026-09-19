import React, { useState } from 'react';
import { Search, Check, UserCheck, ShieldCheck, Landmark, Sparkles, Loader2 } from 'lucide-react';

interface HeroScannerProps {
  currentUrl: string;
  onScan: (url: string) => void;
  isLoading: boolean;
}

export const HeroScanner: React.FC<HeroScannerProps> = ({
  currentUrl,
  onScan,
  isLoading
}) => {
  const [inputUrl, setInputUrl] = useState<string>(currentUrl || 'https://schemes.epfindia.gov.in/');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onScan(inputUrl.trim());
  };

  return (
    <section className="pt-10 pb-8 px-4 text-center max-w-5xl mx-auto" id="hero-scanner-section">
      {/* Framework Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/80 mb-5 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-sky-600 dark:bg-sky-400 animate-pulse"></span>
        <span>NATIONAL DIGITAL ACCESSIBILITY FRAMEWORK • GIGW 3.0 & WCAG 2.2</span>
      </div>

      {/* Main Headline */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
        Making Digital Public Services Accessible to Everyone
      </h2>

      {/* Subtitle */}
      <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
        Scan government websites, identify accessibility barriers, understand citizen impact, and prioritize what needs to be fixed.
      </p>

      {/* Search Input Box */}
      <form 
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl mx-auto"
        id="portal-scan-form"
      >
        <div className="flex flex-col sm:flex-row items-center bg-white dark:bg-[#1e293b] p-1.5 rounded-2xl sm:rounded-full border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/40 transition-all focus-within:ring-2 focus-within:ring-sky-500/30 focus-within:border-sky-500">
          {/* Domain Tag */}
          <div className="hidden sm:flex items-center px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700 select-none mr-2">
            <span>.gov.in / .nic.in</span>
          </div>

          {/* URL Input */}
          <div className="flex-1 w-full flex items-center px-3 py-1.5">
            <input
              id="target-url-input"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter Indian portal URL, e.g. schemes.epfindia.gov.in"
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden font-medium"
              disabled={isLoading}
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full font-semibold text-sm bg-slate-950 hover:bg-slate-800 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-70 mt-2 sm:mt-0"
            id="btn-scan-submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing DOM...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scan Website</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Trust & Compliance Pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
          <span>WCAG 2.2 AAA Ready</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
          <span>GIGW 3.0 Compliance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Citizen-Centric</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Responsible Testing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>NIC Standard Aligned</span>
        </div>
      </div>
    </section>
  );
};
