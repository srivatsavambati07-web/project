import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  Code2, 
  Sparkles, 
  RotateCw, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  AlertOctagon,
  FileCode
} from 'lucide-react';
import { AccessibilityViolation } from '../types';

interface CodeFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  violation: AccessibilityViolation | null;
  onRemediate: (violationId: string) => void;
  onRequestAiExplain: (violation: AccessibilityViolation) => Promise<void>;
  isExplaining: boolean;
}

export const CodeFixModal: React.FC<CodeFixModalProps> = ({
  isOpen,
  onClose,
  violation,
  onRemediate,
  onRequestAiExplain,
  isExplaining
}) => {
  const [copiedType, setCopiedType] = useState<'after' | 'before' | null>(null);

  if (!isOpen || !violation) return null;

  const handleCopy = (code: string, type: 'after' | 'before') => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        id="code-fix-modal"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1e293b] z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Remediation Specification
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-sm">
                  {violation.wcagCriterion.number} • GIGW {violation.gigwClause.ruleNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target Element: <code className="font-mono text-sky-600 dark:text-sky-400">{violation.targetSelector}</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            id="btn-close-code-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Citizen Impact Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>Citizen Impact Diagnostic</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {violation.citizenJourney.impactDescription || violation.failureSummary}
            </p>
          </div>

          {/* Code Before & After Diff */}
          <div className="space-y-4">
            {/* Before (Current Non-Compliant DOM) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400 mb-1.5">
                <span>✕ Current Inaccessible Markup:</span>
                <button
                  onClick={() => handleCopy(violation.remediation.beforeCode || violation.htmlSnippet, 'before')}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'before' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'before' ? 'Copied' : 'Copy snippet'}</span>
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 text-rose-300 font-mono text-xs overflow-x-auto border border-rose-950/60">
                <code>{violation.remediation.beforeCode || violation.htmlSnippet}</code>
              </div>
            </div>

            {/* After (GIGW 3.0 / WCAG Compliant Markup) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">
                <span>✓ Remediated GIGW 3.0 Compliant Markup:</span>
                <button
                  onClick={() => handleCopy(violation.remediation.afterCode, 'after')}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'after' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'after' ? 'Copied' : 'Copy ready fix'}</span>
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-emerald-950/60">
                <code>{violation.remediation.afterCode}</code>
              </div>
            </div>
          </div>

          {/* Action Steps */}
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              NIC Developer Implementation Steps:
            </div>
            <ul className="space-y-1.5">
              {violation.remediation.steps.map((step, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Explanation Box */}
          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 dark:text-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Plain Language AI Guidance (Gemini Service)</span>
              </div>
              {!violation.aiExplanation && (
                <button
                  onClick={() => onRequestAiExplain(violation)}
                  disabled={isExplaining}
                  className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isExplaining ? <RotateCw className="w-3 h-3 animate-spin" /> : null}
                  <span>{isExplaining ? 'Generating...' : 'Regenerate Notes'}</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {violation.aiExplanation || violation.plainLanguageCitizenExplanation || 'Evaluating conformance against Indian Public Service guidelines and citizen accessibility requirements.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between sticky bottom-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Estimated Effort: <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">{violation.remediation.effort}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onRemediate(violation.id);
                onClose();
              }}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              id="btn-simulate-fix-in-modal"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simulate Fix & Recalculate Score</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
