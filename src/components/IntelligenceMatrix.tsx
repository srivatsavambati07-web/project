import React, { useState } from 'react';
import { 
  AccessibilityViolation, 
  IssuePriority, 
  AffectedDemographic 
} from '../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Code2, 
  ArrowRight, 
  User, 
  Workflow, 
  FileCode, 
  RotateCcw, 
  Search, 
  Filter 
} from 'lucide-react';

interface IntelligenceMatrixProps {
  issues: AccessibilityViolation[];
  onRemediate: (violationId: string) => void;
  onRequestAiExplain: (violation: AccessibilityViolation) => Promise<void>;
  isExplainingId: string | null;
}

export const IntelligenceMatrix: React.FC<IntelligenceMatrixProps> = ({
  issues,
  onRemediate,
  onRequestAiExplain,
  isExplainingId,
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedDemographic, setSelectedDemographic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredIssues = issues.filter((issue) => {
    if (selectedPriority !== 'all' && issue.priority !== selectedPriority) return false;
    if (selectedDemographic !== 'all' && issue.citizenJourney.affectedDemographic !== selectedDemographic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${issue.title} ${issue.ruleId} ${issue.citizenJourney.task} ${issue.citizenJourney.affectedCitizen} ${issue.targetSelector}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5" id="intelligence-matrix-card">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Government Service Intelligence Matrix
            </h3>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              {filteredIssues.length} Findings
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Correlation: Technical Barrier → Affected User → Government Task → Journey Stage → Impact → Remediation Priority
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search barriers or tasks..."
              className="pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 w-44 sm:w-52"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
            <option value="low">Low Only</option>
          </select>

          <select
            value={selectedDemographic}
            onChange={(e) => setSelectedDemographic(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">All Citizen Personas</option>
            <option value="screen_reader">Screen-Reader Users</option>
            <option value="low_vision">Low Vision</option>
            <option value="motor_impaired">Motor / Keyboard</option>
            <option value="regional_language">Regional Languages</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="py-12 text-center text-slate-500 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No accessibility barriers match this filter.</p>
          <p className="text-xs text-slate-400">Try resetting the priority or persona filter above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const isExpanded = expandedIssueId === issue.id;
            const isRemediated = issue.isRemediated;

            // Priority badge styling
            let priorityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
            if (issue.priority === 'critical') priorityBadge = 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
            else if (issue.priority === 'high') priorityBadge = 'bg-orange-100 text-orange-800 border-orange-200 font-bold';
            else if (issue.priority === 'medium') priorityBadge = 'bg-amber-100 text-amber-800 border-amber-200';

            return (
              <div
                key={issue.id}
                className={`border rounded-xl transition-all ${
                  isRemediated 
                    ? 'border-emerald-200 bg-emerald-50/30 opacity-70' 
                    : isExpanded 
                    ? 'border-blue-300 ring-1 ring-blue-200 bg-white shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                id={`issue-card-${issue.id}`}
              >
                {/* Main Card Summary Bar */}
                <div className="p-4 flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className={`px-2 py-0.5 rounded-sm border uppercase tracking-wider ${priorityBadge}`}>
                        {issue.priority} Priority
                      </span>

                      <span className="px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                        Stage: {issue.citizenJourney.stageName}
                      </span>

                      <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        GIGW {issue.gigwClause.ruleNumber}
                      </span>

                      <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                        WCAG {issue.wcagCriterion.number} ({issue.wcagCriterion.level})
                      </span>

                      <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        {issue.confidence === 'auto_verified' ? '✓ Auto Verified' : 'Likely Issue'}
                      </span>

                      {isRemediated && (
                        <span className="px-2 py-0.5 rounded-sm bg-emerald-600 text-white font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Remediated
                        </span>
                      )}
                    </div>

                    {/* Barrier Title */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>{issue.title}</span>
                        <code className="text-[11px] font-mono text-slate-500 font-normal bg-slate-100 px-1.5 py-0.5 rounded-sm">
                          {issue.ruleId}
                        </code>
                      </h4>
                    </div>

                    {/* Government Service Intelligence Pathway (The requested core innovation!) */}
                    <div className="bg-slate-50/80 border border-slate-200/80 rounded-lg p-3 text-xs space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <User className="w-3 h-3 text-blue-600" />
                            Affected Citizen Persona:
                          </span>
                          <p className="font-semibold text-slate-800 text-[11px] leading-tight">
                            {issue.citizenJourney.affectedCitizen}
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Workflow className="w-3 h-3 text-amber-600" />
                            Government Service Task:
                          </span>
                          <p className="font-semibold text-slate-800 text-[11px] leading-tight">
                            {issue.citizenJourney.task}
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3 text-rose-600" />
                            Citizen Impact:
                          </span>
                          <p className="text-rose-900 font-medium text-[11px] leading-tight">
                            {issue.citizenJourney.impactDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-1">
                    <button
                      onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Code & AI Fix' : 'View Code & AI Fix'}</span>
                    </button>

                    <button
                      onClick={() => onRemediate(issue.id)}
                      disabled={isRemediated}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                        isRemediated
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                      title="Simulate applying this fix to see score improvement live"
                    >
                      {isRemediated ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>Fix Applied</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3 h-3 text-slate-500" />
                          <span>Simulate Fix</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer: Plain language AI explanation + Developer Code Remediation */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/50 p-4 space-y-4 text-xs">
                    {/* AI Plain Language Citizen Explanation */}
                    <div className="bg-linear-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200 rounded-lg p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Plain-Language Citizen Explanation (AI Assisted)
                        </span>
                        <button
                          onClick={() => onRequestAiExplain(issue)}
                          disabled={isExplainingId === issue.id}
                          className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 cursor-pointer"
                        >
                          {isExplainingId === issue.id ? 'Regenerating via Gemini...' : 'Regenerate Explanation'}
                        </button>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-sans text-xs">
                        {issue.plainLanguageCitizenExplanation || (
                          <>
                            This accessibility barrier in the <strong>{issue.citizenJourney.stageName}</strong> stage
                            means that a citizen relying on assistive technology will have trouble with{' '}
                            <em>{issue.citizenJourney.task}</em>. Instead of a clear audible description, the tool
                            receives incomplete data, often requiring a sighted person to assist.
                          </>
                        )}
                      </p>
                    </div>

                    {/* DOM Target Selector & Snippet */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1 text-xs">
                        <FileCode className="w-3.5 h-3.5 text-slate-500" />
                        DOM Target Selector:
                      </span>
                      <code className="block p-2 bg-slate-900 text-amber-300 font-mono rounded-md text-[11px] overflow-x-auto">
                        {issue.targetSelector}
                      </code>
                    </div>

                    {/* Developer Remediation (Before vs After Diff) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                          <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                          Developer Remediation & GIGW 3.0 Code Fix
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          Effort: <strong className="capitalize">{issue.remediation.effort}</strong>
                        </span>
                      </div>

                      <p className="text-slate-600 text-xs">{issue.remediation.summary}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Before Code */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                            Current Inaccessible Code:
                          </span>
                          <pre className="p-2.5 bg-rose-50/80 border border-rose-200 text-rose-950 font-mono text-[11px] rounded-md overflow-x-auto whitespace-pre-wrap">
                            {issue.remediation.beforeCode}
                          </pre>
                        </div>

                        {/* After Code (Accessible Fix) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                              Remediated GIGW 3.0 Code:
                            </span>
                            <button
                              onClick={() => handleCopyCode(issue.id, issue.remediation.afterCode)}
                              className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-sm cursor-pointer"
                            >
                              {copiedCodeId === issue.id ? (
                                <>
                                  <Check className="w-2.5 h-2.5 text-emerald-600" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5" /> Copy Code
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-2.5 bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-mono text-[11px] rounded-md overflow-x-auto whitespace-pre-wrap">
                            {issue.remediation.afterCode}
                          </pre>
                        </div>
                      </div>

                      {/* Implementation Steps */}
                      <div className="pt-1">
                        <span className="font-semibold text-slate-700 text-xs">Implementation Checklist:</span>
                        <ul className="list-disc pl-5 text-slate-600 text-xs space-y-0.5 mt-1">
                          {issue.remediation.steps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
