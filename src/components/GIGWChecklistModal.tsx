import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Shield, BookOpen, ExternalLink } from 'lucide-react';

interface GIGWChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GIGWChecklistModal: React.FC<GIGWChecklistModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const clauses = [
    {
      clause: '4.3',
      name: 'Non-Text Content & CAPTCHA',
      rule: 'All graphic controls, logos, and verification images must provide audio or textual alternatives.',
      status: 'fail',
      statusText: 'Failed (Missing Audio Token)',
      wcag: '1.1.1 Level A'
    },
    {
      clause: '5.1.2',
      name: 'Keyboard Operability of File Uploads',
      rule: 'Custom document upload containers and drag-and-drop dropzones must support keyboard tab and enter triggers.',
      status: 'fail',
      statusText: 'Failed (Dropzone Tab Trap)',
      wcag: '2.1.1 Level A'
    },
    {
      clause: '5.2.4',
      name: 'Visible Focus Indication on Submit Controls',
      rule: 'CSS resets must not suppress outline or focus ring indicators on interactive citizen submission controls.',
      status: 'fail',
      statusText: 'Failed (outline: none detected)',
      wcag: '2.4.7 Level AA'
    },
    {
      clause: '6.1.4',
      name: 'Contrast Minimum for Disclaimers & Notes',
      rule: 'Text contrast must be at least 4.5:1 against adjacent backgrounds for normal body text.',
      status: 'warning',
      statusText: 'Warning (2.4:1 contrast)',
      wcag: '1.4.3 Level AA'
    },
    {
      clause: '6.2.1',
      name: 'Labels and Instructions for Form Inputs',
      rule: 'Every citizen input (UAN, Aadhaar, Bank A/C) must maintain a persistent, explicitly associated <label>.',
      status: 'fail',
      statusText: 'Failed (Floating placeholder only)',
      wcag: '3.3.2 Level A'
    },
    {
      clause: '7.1.1',
      name: 'Language Identification for Regional Text',
      rule: 'Indian regional language content in Hindi/Devanagari must declare appropriate lang="hi" attributes.',
      status: 'pass',
      statusText: 'Passed (lang attribute valid)',
      wcag: '3.1.1 Level A'
    },
    {
      clause: '8.1.1',
      name: 'Bilingual Portal Navigation Structure',
      rule: 'Header navigation must provide unambiguous access to both English and Indian official language versions.',
      status: 'pass',
      statusText: 'Passed (Bilingual switch verified)',
      wcag: 'GIGW 3.0 Special'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col"
        id="gigw-checklist-modal"
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1e293b] z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                GIGW 3.0 Conformance Checklist
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guidelines for Indian Government Websites (Ministry of Electronics & IT)
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

        <div className="p-5 divide-y divide-slate-100 dark:divide-slate-800/80">
          {clauses.map((c, i) => (
            <div key={i} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded-sm border border-sky-200/80 dark:border-sky-800">
                      § {c.clause}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {c.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    {c.rule}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 inline-block">
                    Mapped WCAG: {c.wcag}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  {c.status === 'fail' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      <span>{c.statusText}</span>
                    </span>
                  )}
                  {c.status === 'warning' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>{c.statusText}</span>
                    </span>
                  )}
                  {c.status === 'pass' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{c.statusText}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Source: STQC Directorate & NIC Standards Framework
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
