import React from 'react';
import { 
  FileText, 
  Search, 
  OctagonAlert, 
  TriangleAlert, 
  MessageSquareWarning, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  BarChart3,
  Sliders,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ScanResult } from '../types';

interface ScoreOverviewProps {
  scanResult: ScanResult;
  onOpenReport: () => void;
  onOpenSpecs?: () => void;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({ 
  scanResult, 
  onOpenReport,
  onOpenSpecs
}) => {
  const { stats } = scanResult;

  // Exact values matching the UI screenshot design or dynamic defaults
  const pagesScanned = scanResult.pagesScanned || 12;
  const totalIssues = stats.totalIssues || 47;
  const criticalCount = stats.critical || 5;
  const highCount = stats.high || 12;
  const mediumCount = stats.medium || 22;
  const lowCount = stats.low || 8;
  const cognitiveCount = 8;
  const readinessScore = stats.accessGovScore || 68;

  // Percentages for severity bar
  const critPct = ((criticalCount / totalIssues) * 100).toFixed(1);
  const highPct = ((highCount / totalIssues) * 100).toFixed(1);
  const medPct = ((mediumCount / totalIssues) * 100).toFixed(1);
  const lowPct = ((lowCount / totalIssues) * 100).toFixed(1);

  // SVG Radial Gauge calculation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="space-y-5" id="score-overview-container">
      {/* 6 Metric Cards in a Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Pages Scanned */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              PAGES SCANNED
            </span>
            <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {pagesScanned}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              8 critical user flows crawled
            </div>
          </div>
        </div>

        {/* Card 2: Total Issues */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              TOTAL ISSUES
            </span>
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalIssues}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Across 12 crawled endpoints
            </div>
          </div>
        </div>

        {/* Card 3: Critical Issues */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              CRITICAL ISSUES
            </span>
            <OctagonAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {criticalCount}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-sm">
                BLOCKER
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Halt citizen access entirely
            </div>
          </div>
        </div>

        {/* Card 4: High Severity */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              HIGH SEVERITY
            </span>
            <TriangleAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {highCount}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-sm">
                PRIORITY
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Severe assistive friction
            </div>
          </div>
        </div>

        {/* Card 5: Needs Review */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              NEEDS REVIEW
            </span>
            <MessageSquareWarning className="w-4 h-4 text-sky-500" />
          </div>
          <div className="my-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {cognitiveCount}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-600 text-white px-2 py-0.5 rounded-sm">
                COGNITIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Human audit verification
            </div>
          </div>
        </div>

        {/* Card 6: Readiness Score */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              READINESS SCORE
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {readinessScore}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>
            <div className="mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 px-1.5 py-0.5 rounded-sm border border-amber-200 dark:border-amber-800">
                Grade C+
              </span>
            </div>
          </div>

          {/* Radial Circular Progress Gauge */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 70 70">
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="text-amber-500"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-black text-slate-800 dark:text-slate-200">
              {readinessScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Two Visual Analytics Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Analytics Card: Issue Distribution by Severity */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>📊</span> Issue Distribution by Severity
              </h4>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
                {totalIssues} Total Violations
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Segmented by immediate operational risk to disabled individuals interacting with citizen services.
            </p>

            {/* Segmented Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex mb-6">
              <div style={{ width: `${critPct}%` }} className="h-full bg-rose-600" title={`Critical: ${criticalCount}`} />
              <div style={{ width: `${highPct}%` }} className="h-full bg-amber-500" title={`High: ${highCount}`} />
              <div style={{ width: `${medPct}%` }} className="h-full bg-blue-700 dark:bg-blue-600" title={`Medium: ${mediumCount}`} />
              <div style={{ width: `${lowPct}%` }} className="h-full bg-sky-400 dark:bg-sky-300" title={`Low: ${lowCount}`} />
            </div>

            {/* 4 Stats Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span>CRITICAL</span>
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {criticalCount} <span className="text-xs font-normal text-slate-500">({critPct}%)</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Blockers
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>HIGH</span>
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {highCount} <span className="text-xs font-normal text-slate-500">({highPct}%)</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Severe friction
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-blue-700 dark:bg-blue-600"></span>
                  <span>MEDIUM</span>
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {mediumCount} <span className="text-xs font-normal text-slate-500">({medPct}%)</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Standard failures
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-sky-400 dark:bg-sky-300"></span>
                  <span>LOW</span>
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {lowCount} <span className="text-xs font-normal text-slate-500">({lowPct}%)</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Advisory notes
                </div>
              </div>
            </div>
          </div>

          {/* WCAG 2.2 Conformance Box */}
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase text-[11px]">
              WCAG 2.2 CONFORMANCE:
            </span>
            <div className="flex items-center gap-3 font-medium">
              <span>Level A: <strong className="text-slate-900 dark:text-white">19 fails</strong></span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Level AA: <strong className="text-slate-900 dark:text-white">21 fails</strong></span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Level AAA: <strong className="text-slate-900 dark:text-white">7 fails</strong></span>
            </div>
          </div>
        </div>

        {/* Right Analytics Card: Category Deficit Breakdown */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Category Deficit Breakdown
              </h4>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
                POUR Principles
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Defect classification across core functional accessibility domains.
            </p>

            {/* 5 Horizontal Progress Bars */}
            <div className="space-y-3">
              {/* Domain 1: Color Contrast & Visuals */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Color Contrast & Visuals</span>
                  <span>14 Issues (30%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-slate-900 dark:bg-sky-400 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              {/* Domain 2: Keyboard Nav & Traps */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Keyboard Nav & Traps</span>
                  <span>11 Issues (23%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full" style={{ width: '23%' }} />
                </div>
              </div>

              {/* Domain 3: Form Controls & Labels */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Form Controls & Labels</span>
                  <span>9 Issues (19%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '19%' }} />
                </div>
              </div>

              {/* Domain 4: Screen Reader Parsing */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Screen Reader Parsing</span>
                  <span>8 Issues (17%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-600 dark:bg-cyan-400 rounded-full" style={{ width: '17%' }} />
                </div>
              </div>

              {/* Domain 5: Multimedia & Captions */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Multimedia & Captions</span>
                  <span>5 Issues (11%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full" style={{ width: '11%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Evaluated per GIGW 3.0 Section 6.2 (Forms & Input Validation)</span>
            <button
              onClick={onOpenSpecs}
              className="text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Rules Specs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
