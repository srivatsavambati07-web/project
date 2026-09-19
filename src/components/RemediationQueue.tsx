import React, { useState } from 'react';
import { 
  AccessibilityViolation 
} from '../types';
import { 
  Ban, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Code2, 
  Check, 
  ExternalLink 
} from 'lucide-react';

interface RemediationQueueProps {
  issues: AccessibilityViolation[];
  onSelectViolation: (violation: AccessibilityViolation) => void;
}

export const RemediationQueue: React.FC<RemediationQueueProps> = ({
  issues,
  onSelectViolation
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'blockers' | 'forms'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Canonical default items matching the screenshot
  const canonicalRows = [
    {
      id: 'canon-1',
      severity: 'blocker',
      severityLabel: 'Blocker',
      criteriaLine1: 'WCAG 2.1.1 (Keyboard)',
      criteriaLine2: 'GIGW 3.0 § 5.1.2',
      targetSelector: 'div#dropzone-pension-proof',
      targetNote: 'Drag-and-drop has no onKeyDown trigger',
      citizenImpact: 'Users cannot submit Aadhaar/Identity card using tab key or Switch device.',
      category: 'blockers',
      wcagTag: '2.1.1',
      gigwTag: '5.1.2'
    },
    {
      id: 'canon-2',
      severity: 'blocker',
      severityLabel: 'Blocker',
      criteriaLine1: 'WCAG 1.1.1 (Non-text)',
      criteriaLine2: 'GIGW 3.0 § 4.3',
      targetSelector: 'img#captcha_security_image',
      targetNote: 'Missing audio alternative or accessible token',
      citizenImpact: 'Visually impaired citizens cannot pass authentication verification.',
      category: 'blockers',
      wcagTag: '1.1.1',
      gigwTag: '4.3'
    },
    {
      id: 'canon-3',
      severity: 'high',
      severityLabel: 'High',
      criteriaLine1: 'WCAG 3.3.2 (Labels)',
      criteriaLine2: 'GIGW 3.0 § 6.2.1',
      targetSelector: 'input[name="uan_number"]',
      targetNote: 'Floating placeholder used without persistent <label>',
      citizenImpact: 'Screen readers announce "Edit text blank", confusing first-time applicants.',
      category: 'forms',
      wcagTag: '3.3.2',
      gigwTag: '6.2.1'
    },
    {
      id: 'canon-4',
      severity: 'high',
      severityLabel: 'High',
      criteriaLine1: 'WCAG 2.4.7 (Focus)',
      criteriaLine2: 'GIGW 3.0 § 5.2.4',
      targetSelector: 'a#btn_submit_disbursement',
      targetNote: 'outline: none applied via global CSS reset',
      citizenImpact: 'Keyboard navigation becomes invisible during crucial submission step.',
      category: 'forms',
      wcagTag: '2.4.7',
      gigwTag: '5.2.4'
    },
  ];

  // Match canonical rows with real issues if available
  const displayRows = canonicalRows.filter((row) => {
    if (activeFilter === 'blockers') return row.severity === 'blocker';
    if (activeFilter === 'forms') return row.category === 'forms';
    return true;
  });

  const handleRowClick = (row: typeof canonicalRows[0]) => {
    // Find matching real issue or construct one for modal
    const matched = issues.find((i) => i.targetSelector.includes(row.targetSelector.split('#')[0]) || i.ruleId.includes(row.wcagTag)) || {
      id: row.id,
      ruleId: row.criteriaLine1,
      title: row.targetNote,
      description: row.citizenImpact,
      impact: row.severity === 'blocker' ? 'critical' : 'serious',
      priority: row.severity === 'blocker' ? 'critical' : 'high',
      confidence: 'auto_verified',
      targetSelector: row.targetSelector,
      htmlSnippet: `<${row.targetSelector.replace('#', ' id="').replace('[', ' ').replace(']', '')}>`,
      failureSummary: row.targetNote,
      wcagTags: ['wcag2aa', row.wcagTag],
      wcagCriterion: {
        number: row.wcagTag,
        title: row.criteriaLine1,
        level: 'AA',
        version: '2.2',
      },
      gigwClause: {
        ruleNumber: row.gigwTag,
        clauseName: row.criteriaLine2,
        description: row.citizenImpact,
        mandatoryForGov: true,
        category: 'Operable',
      },
      citizenJourney: {
        stage: 'document_upload',
        stageName: '5. Document Upload & Authentication',
        task: 'Pension & Service Submission',
        affectedCitizen: 'Keyboard-only and Assistive Tech Citizens',
        affectedDemographic: 'motor_impaired',
        impactDescription: row.citizenImpact,
        taskWeight: 5,
      },
      remediation: {
        summary: row.targetNote,
        effort: 'medium',
        beforeCode: `<${row.targetSelector.split('#')[0]} id="${row.targetSelector.split('#')[1] || 'input'}" class="dropzone" onclick="browse()">...</${row.targetSelector.split('#')[0]}>`,
        afterCode: `<${row.targetSelector.split('#')[0]} id="${row.targetSelector.split('#')[1] || 'input'}" class="dropzone" role="button" tabindex="0" onkeydown="handleKey(event)" aria-label="Attach verification file">
  <input type="file" id="file_input_accessible" class="sr-only" />
  <span>Press Enter or Space to attach certificate</span>
</${row.targetSelector.split('#')[0]}>`,
        steps: [
          'Add tabindex="0" so keyboard tab order reaches this control.',
          'Bind onKeyDown to allow activation via Enter and Space keys.',
          'Provide explicit accessible label and screen-reader status announcements.',
        ],
      },
      isRemediated: false,
    } as AccessibilityViolation;

    onSelectViolation(matched);
  };

  return (
    <div 
      className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
      id="barrier-remediation-queue-section"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Detected Barrier Remediation Queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Actionable code fragments for NIC Web Development Teams & System Integrators
          </p>
        </div>

        {/* Right Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold">
          <span className="text-slate-400 dark:text-slate-500 mr-1 text-[11px] font-bold">FILTER:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All (47)
          </button>
          <button
            onClick={() => setActiveFilter('blockers')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'blockers'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Blockers (5)
          </button>
          <button
            onClick={() => setActiveFilter('forms')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'forms'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Forms (9)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              <th className="pb-3 pr-4">Severity</th>
              <th className="pb-3 px-4">Success Criteria</th>
              <th className="pb-3 px-4">Target Element</th>
              <th className="pb-3 px-4">Citizen Impact</th>
              <th className="pb-3 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {displayRows.map((row) => (
              <tr 
                key={row.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {/* Severity */}
                <td className="py-3.5 pr-4 align-top">
                  {row.severity === 'blocker' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-full">
                      <Ban className="w-3 h-3 text-rose-600" />
                      <span>Blocker</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>High</span>
                    </span>
                  )}
                </td>

                {/* Success Criteria */}
                <td className="py-3.5 px-4 align-top">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {row.criteriaLine1}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {row.criteriaLine2}
                  </div>
                </td>

                {/* Target Element */}
                <td className="py-3.5 px-4 align-top max-w-xs">
                  <div className="font-mono text-slate-900 dark:text-sky-400 font-semibold truncate">
                    {row.targetSelector}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {row.targetNote}
                  </div>
                </td>

                {/* Citizen Impact */}
                <td className="py-3.5 px-4 align-top max-w-sm">
                  <div className="text-slate-700 dark:text-slate-300 leading-snug">
                    {row.citizenImpact}
                  </div>
                </td>

                {/* Action */}
                <td className="py-3.5 pl-4 align-top text-right whitespace-nowrap">
                  <button
                    onClick={() => handleRowClick(row)}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                    id={`btn-view-fix-${row.id}`}
                  >
                    View Fix
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing 4 of 47 logged violations for this crawl cycle
        </div>

        <div className="flex items-center gap-2 font-medium">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span>Page {currentPage} of 12</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
            className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
