import React, { useState } from 'react';
import { 
  Target, 
  RotateCw, 
  Pause, 
  Play, 
  Check, 
  Loader2, 
  Clock, 
  Activity, 
  Cpu, 
  FileCode, 
  Layers, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';
import { ScanResult } from '../types';

interface ActiveTargetCardProps {
  scanResult: ScanResult;
  onRecrawl: () => void;
  isLoading: boolean;
}

export const ActiveTargetCard: React.FC<ActiveTargetCardProps> = ({
  scanResult,
  onRecrawl,
  isLoading
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const targetId = scanResult.targetId || 'NIC-EPF-9921';
  const auditScope = scanResult.auditScope || 'Public Pension & Member Portal';
  const protocol = scanResult.protocol || 'GIGW 3.0 & WCAG 2.2 AA';
  const displayUrl = scanResult.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Formatted date string or fixed canonical timestamp matching design
  const formattedDate = '24 May 2024, 14:32 IST';

  return (
    <div 
      className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors"
      id="active-target-card"
    >
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Target Icon in circle */}
          <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {displayUrl}
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700">
                TARGET ID: {targetId}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                {isPaused ? 'Paused' : (isLoading ? 'Crawling...' : 'In Progress')}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              <span>Audit Scope: {auditScope}</span>
              <span className="mx-1.5">•</span>
              <span>Scanned On: {formattedDate}</span>
              <span className="mx-1.5">•</span>
              <span>Protocol: {protocol}</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onRecrawl}
            disabled={isLoading}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            id="btn-recrawl-target"
          >
            <RotateCw className={`w-3.5 h-3.5 text-sky-600 dark:text-sky-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-crawl Target</span>
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            id="btn-pause-stream"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume Stream</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Pause Stream</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6-Step Pipeline Strip */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Step 1 */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold">01</span>
            <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Launching Headless Engine
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              100% • 1.2s
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold">02</span>
            <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Website DOM & Assets
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              100% • 4.8MB
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold">03</span>
            <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Automated Ruleset Checks
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              84 Rules Checked
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold">04</span>
            <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Mapping GIGW 3.0 Matrix
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {scanResult.stats.totalIssues || 47} Issues Found
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/80 rounded-xl p-3 flex flex-col justify-between ring-1 ring-sky-400/20">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 font-bold">05</span>
            <span className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-sky-950 dark:text-sky-200 leading-tight">
              Analysing Citizen Impact
            </div>
            <div className="text-[11px] text-sky-700 dark:text-sky-400 mt-1">
              Simulating flows...
            </div>
          </div>
        </div>

        {/* Step 6 */}
        <div className="bg-slate-50/40 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between opacity-70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold">06</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
              <Clock className="w-2.5 h-2.5" />
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
              Generating Report
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Queued
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
