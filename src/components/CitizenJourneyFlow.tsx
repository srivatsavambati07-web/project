import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  ShieldAlert, 
  Code2, 
  ClipboardCheck, 
  Download,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { CitizenJourneyStage } from '../types';

interface CitizenJourneyFlowProps {
  onInspectFix: () => void;
  onOpenChecklist: () => void;
  onExportPdf: () => void;
  serviceName?: string;
  flowRef?: string;
  selectedStage?: CitizenJourneyStage | 'all';
  onSelectStage?: (stage: CitizenJourneyStage | 'all') => void;
}

export const CitizenJourneyFlow: React.FC<CitizenJourneyFlowProps> = ({
  onInspectFix,
  onOpenChecklist,
  onExportPdf,
  serviceName = 'Provident Fund Withdrawal Service',
  flowRef = 'EPF-CLAIM-7',
  selectedStage = 'all',
  onSelectStage
}) => {
  const steps = [
    {
      stepNumber: '01',
      stage: 'discovery' as CitizenJourneyStage,
      title: 'Find Scheme',
      subtext: 'Good headings & discoverability',
      status: 'accessible',
      statusLabel: 'Accessible',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      stepNumber: '02',
      stage: 'guidelines' as CitizenJourneyStage,
      title: 'Eligibility',
      subtext: 'Clear criteria tables & labels',
      status: 'accessible',
      statusLabel: 'Accessible',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      stepNumber: '03',
      stage: 'authentication' as CitizenJourneyStage,
      title: 'Start Form',
      subtext: 'Missing focus outline on CTA button',
      status: 'warning',
      statusLabel: 'Warning',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    {
      stepNumber: '04',
      stage: 'form_details' as CitizenJourneyStage,
      title: 'Personal Data',
      subtext: 'Autocomplete tags omitted',
      status: 'warning',
      statusLabel: 'Warning',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    {
      stepNumber: '05',
      stage: 'document_upload' as CitizenJourneyStage,
      title: 'Upload Docs',
      subtext: 'No keyboard trigger, drag & drop only',
      status: 'critical',
      statusLabel: 'Critical Blocker',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
      badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold',
    },
    {
      stepNumber: '06',
      stage: 'submission' as CitizenJourneyStage,
      title: 'Submit Claim',
      subtext: 'Inaccessible due to Step 5 fail',
      status: 'blocked',
      statusLabel: 'Blocked',
      icon: <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
      badgeBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    },
  ];

  return (
    <div 
      className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5"
      id="citizen-journey-flow-section"
    >
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 px-2 py-0.5 rounded-sm border border-rose-200 dark:border-rose-800">
              CRITICAL WORKFLOW IMPACT
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Portal Flow Ref: {flowRef}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Citizen Journey Accessibility Impact Flow
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-3xl">
            Live mapping of citizen progression through the public pension / service application flow. Identifies precise friction points that cause citizen abandonment.
          </p>
        </div>

        {/* Right Service Badge */}
        <div className="self-start lg:self-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3 py-1 rounded-full">
            <FileCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{serviceName}</span>
          </span>
        </div>
      </div>

      {/* 6 Steps Linear Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((s, index) => {
          const isSelected = selectedStage === s.stage;

          return (
            <div
              key={s.stepNumber}
              onClick={() => onSelectStage && onSelectStage(isSelected ? 'all' : s.stage)}
              className={`rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
                s.status === 'critical'
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/30'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                    STEP {s.stepNumber}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm border inline-flex items-center gap-1 ${s.badgeBg}`}>
                    {s.icon}
                    <span>{s.statusLabel}</span>
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {s.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {s.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Citizen Exclusion Incident Callout Card */}
      <div 
        className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        id="critical-exclusion-callout"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Critical Citizen Exclusion Incident
              </h4>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-sm">
                HIGH SEVERITY
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed max-w-3xl">
              <strong className="text-slate-900 dark:text-white font-semibold">Citizen Impact Summary:</strong> Document Upload contains barriers that prevent keyboard-only and screen-reader users from attaching identity certificates. Over 18% of differently-abled citizens are estimated to abandon this mandatory service at Step 5.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          <button
            onClick={onInspectFix}
            className="text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            id="btn-inspect-code-fix"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Inspect Code Fix</span>
          </button>
          <button
            onClick={onOpenChecklist}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            id="btn-gigw-checklist"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>GIGW Checklist</span>
          </button>
          <button
            onClick={onExportPdf}
            className="text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            id="btn-export-pdf-hero"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
