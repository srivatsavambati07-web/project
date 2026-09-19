import React, { useState } from 'react';
import { 
  Volume2, 
  Keyboard, 
  Eye, 
  FormInput, 
  Brain, 
  Check, 
  AlertTriangle, 
  Ban 
} from 'lucide-react';

interface PersonaProfile {
  id: string;
  name: string;
  icon: React.ReactNode;
  score: number;
  scoreColor: 'red' | 'amber' | 'blue' | 'emerald';
  description: string;
  criterionStatus: string;
  statusType: 'fail' | 'warning' | 'pass';
}

export const AccessibilityProfiles: React.FC = () => {
  const [viewMode, setViewMode] = useState<'persona' | 'pour'>('persona');

  const profiles: PersonaProfile[] = [
    {
      id: 'screen_reader',
      name: 'Screen Reader',
      icon: <Volume2 className="w-4 h-4 text-amber-500" />,
      score: 62,
      scoreColor: 'amber',
      description: 'Severe Alt Text & ARIA landmarks missing on major tables.',
      criterionStatus: '⊘ Fails 1.1.1 & 1.3.1',
      statusType: 'fail',
    },
    {
      id: 'keyboard',
      name: 'Keyboard Navigation',
      icon: <Keyboard className="w-4 h-4 text-amber-500" />,
      score: 54,
      scoreColor: 'amber',
      description: 'Tab trap detected on modal dialog and datepicker inputs.',
      criterionStatus: '⊘ Fails 2.1.2 No Trap',
      statusType: 'fail',
    },
    {
      id: 'low_vision',
      name: 'Visual / Low Vision',
      icon: <Eye className="w-4 h-4 text-sky-500" />,
      score: 78,
      scoreColor: 'blue',
      description: 'Color contrast below 4.5:1 on tertiary disclaimer notes.',
      criterionStatus: '⚠ Fails 1.4.3 Contrast',
      statusType: 'warning',
    },
    {
      id: 'forms',
      name: 'Forms Accessibility',
      icon: <FormInput className="w-4 h-4 text-rose-500" />,
      score: 43,
      scoreColor: 'red',
      description: 'Missing explicit <label> associations on Aadhaar OTP input.',
      criterionStatus: '⊘ Fails 3.3.2 Labels',
      statusType: 'fail',
    },
    {
      id: 'cognitive',
      name: 'Cognitive Clear-Path',
      icon: <Brain className="w-4 h-4 text-cyan-500" />,
      score: 85,
      scoreColor: 'blue',
      description: 'Clean typographic hierarchy; complex jargon in instructions noted.',
      criterionStatus: '✓ GIGW Easy-Read Passes',
      statusType: 'pass',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs" id="accessibility-profiles-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>♿</span> Accessibility Profiles Assessment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Specialized conformance matrix benchmarked against diverse disability user groups.
          </p>
        </div>

        {/* View Mode Tag */}
        <div className="self-start sm:self-auto">
          <button 
            onClick={() => setViewMode(viewMode === 'persona' ? 'pour' : 'persona')}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
            id="btn-view-mode-toggle"
          >
            VIEW MODE: {viewMode === 'persona' ? 'GIGW Persona Model' : 'POUR Technical Model'}
          </button>
        </div>
      </div>

      {/* 5 Persona Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4">
        {profiles.map((p) => {
          let badgeBg = 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
          let barBg = 'bg-amber-500';
          let statusColor = 'text-rose-600 dark:text-rose-400';

          if (p.scoreColor === 'red') {
            badgeBg = 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
            barBg = 'bg-rose-600';
            statusColor = 'text-rose-600 dark:text-rose-400';
          } else if (p.scoreColor === 'blue') {
            badgeBg = 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800';
            barBg = 'bg-sky-500';
            statusColor = p.statusType === 'pass' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400';
          }

          return (
            <div 
              key={p.id}
              className="bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                    {p.icon}
                    <span>{p.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${badgeBg}`}>
                    {p.score}% Score
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {p.description}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2.5">
                  <div 
                    className={`h-full rounded-full ${barBg}`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>

                <div className={`text-[11px] font-semibold ${statusColor} tracking-tight`}>
                  {p.criterionStatus}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
