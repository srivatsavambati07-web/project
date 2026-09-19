import React, { useState } from 'react';
import { X, Globe, Search, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { PORTAL_PRESETS } from '../data/portalPresets';

interface NationalDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPortal: (url: string) => void;
}

export const NationalDirectoryModal: React.FC<NationalDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectPortal
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filtered = PORTAL_PRESETS.filter((p) => 
    p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.domain.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.badge.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col"
        id="national-directory-modal"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1e293b] z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                National Portal Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Central & State Government Portals (.gov.in / .nic.in)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search portal, ministry, or domain..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>

        {/* Portals List */}
        <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto">
          {filtered.map((portal) => (
            <div
              key={portal.id}
              onClick={() => {
                onSelectPortal(portal.defaultUrl);
                onClose();
              }}
              className="py-3.5 px-3 first:pt-1 last:pb-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {portal.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
                    {portal.domain}
                  </span>
                  <span className="text-[10px] font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                    {portal.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {portal.department}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                  {portal.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Scan Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} Indexed National Services
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
