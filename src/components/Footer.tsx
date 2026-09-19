import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenSpecs?: () => void;
  onOpenMethodology?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSpecs,
  onOpenMethodology
}) => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] py-8 transition-colors" id="accessgov-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        {/* Left Info */}
        <div className="text-center sm:text-left">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            AccessGov Institutional Analytics Engine
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            In alignment with Guidelines for Indian Government Websites (GIGW 3.0) & WCAG 2.2 AAA
          </div>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={onOpenSpecs}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            NIC Guidelines
          </button>
          <span>•</span>
          <button
            onClick={onOpenMethodology}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Auditing Methodology
          </button>
          <span>•</span>
          <button
            onClick={onOpenSpecs}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Compliance Standard
          </button>
        </div>
      </div>
    </footer>
  );
};
