import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  Users, 
  Building, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ScanResult } from '../types';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  scanResult,
}) => {
  const [reportType, setReportType] = useState<'citizen' | 'department'>('citizen');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scanResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AccessGov-${scanResult.portalName.replace(/\s+/g, '_')}-Audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header & Toggle */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Government Accessibility Audit Report</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select desired audience format: Citizen-Friendly Overview vs Technical Department Audit.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Toggle Format */}
            <div className="bg-slate-200 p-0.5 rounded-lg flex items-center text-xs font-semibold">
              <button
                onClick={() => setReportType('citizen')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  reportType === 'citizen'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Citizen-Friendly Summary
              </button>
              <button
                onClick={() => setReportType('department')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  reportType === 'department'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Department / NIC Audit
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadJson}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Download Full Audit JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {reportType === 'citizen' ? (
            /* CITIZEN-FRIENDLY SUMMARY */
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Citizen Header */}
              <div className="border-b border-slate-200 pb-4 space-y-2">
                <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                  Citizen Accessibility Advisory
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Accessibility Overview: {scanResult.portalName}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This report explains what applicants and citizens with disabilities can expect when using this
                  government portal. It uses plain language to highlight where barriers might slow you down or require
                  assistance.
                </p>
              </div>

              {/* At a glance box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Key Findings for Citizens & Students</span>
                </h4>
                <p className="text-xs leading-relaxed text-slate-700">
                  {scanResult.citizenSummary}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block text-[11px]">Overall Accessibility</span>
                    <span className="text-lg font-bold text-slate-900">{scanResult.stats.accessGovScore}/100</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block text-[11px]">Critical Blocking Steps</span>
                    <span className="text-lg font-bold text-rose-600">{scanResult.stats.critical}</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block text-[11px]">Assistance Recommended?</span>
                    <span className="text-lg font-bold text-amber-600">
                      {scanResult.stats.critical > 0 ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Journey Breakdown in plain terms */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Citizen Service Steps Breakdown:</h4>
                <div className="space-y-2.5">
                  {scanResult.journeyStages.map((stage) => (
                    <div key={stage.stage} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-900">{stage.stageName}</span>
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] ${
                          stage.status === 'blocked'
                            ? 'bg-rose-100 text-rose-800 font-bold'
                            : stage.status === 'friction'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {stage.status === 'blocked' ? 'Contains Blocking Barrier' : stage.status === 'friction' ? 'Minor Friction' : 'Accessible'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {stage.criticalBlockers > 0
                          ? `Students and screen reader users may be unable to complete this step independently because required controls are unlabelled or inaccessible.`
                          : `Basic keyboard and screen reader support is functional at this stage.`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Rights & Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold">Rights of Persons with Disabilities Act, 2016 (RPwD Act):</p>
                <p>
                  Indian Government websites are mandated under Section 42 of the RPwD Act and GIGW 3.0 guidelines to
                  be perceivable, operable, understandable, and robust for all citizens without discrimination.
                </p>
              </div>
            </div>
          ) : (
            /* TECHNICAL DEPARTMENT & NIC AUDIT REPORT */
            <div className="space-y-6">
              {/* Department Header */}
              <div className="border-b border-slate-200 pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>AUDIT REPORT ID: {scanResult.id}</span>
                  <span>EVALUATION ENGINE: axe-core 4.9 & GIGW 3.0 Intelligence</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Technical Compliance & Remediation Audit: {scanResult.portalName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span><strong>Domain:</strong> {scanResult.url}</span>
                  <span><strong>Ministry/Dept:</strong> {scanResult.department}</span>
                  <span><strong>Audit Date:</strong> {new Date(scanResult.scannedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Department Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-700" />
                  <span>Department Executive Summary</span>
                </h4>
                <p className="leading-relaxed text-slate-700">{scanResult.departmentSummary}</p>
              </div>

              {/* Technical Violations Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Comprehensive Compliance Findings</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 text-[11px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">GIGW 3.0 Clause</th>
                        <th className="p-2.5">WCAG 2.2</th>
                        <th className="p-2.5">Priority</th>
                        <th className="p-2.5">Journey Stage & Task</th>
                        <th className="p-2.5">Target Selector</th>
                        <th className="p-2.5">Recommended Remediation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {scanResult.issues.map((issue) => (
                        <tr key={issue.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-semibold text-blue-900">
                            Clause {issue.gigwClause.ruleNumber}
                            <div className="text-[10px] text-slate-500 font-sans">{issue.gigwClause.clauseName}</div>
                          </td>
                          <td className="p-2.5">
                            {issue.wcagCriterion.number} ({issue.wcagCriterion.level})
                          </td>
                          <td className="p-2.5">
                            <span className={`px-1.5 py-0.5 rounded-sm uppercase font-bold text-[10px] ${
                              issue.priority === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : issue.priority === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <div className="font-medium text-slate-900">{issue.citizenJourney.stageName}</div>
                            <div className="text-[10px] text-slate-500">{issue.citizenJourney.task}</div>
                          </td>
                          <td className="p-2.5 font-mono text-[10px] text-slate-700 max-w-xs truncate">
                            {issue.targetSelector}
                          </td>
                          <td className="p-2.5 text-slate-700 max-w-xs">
                            {issue.remediation.summary}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NIC / Developer Next Steps */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Remediation Action Plan for NIC / Portal Developers:</h4>
                <ol className="list-decimal pl-5 text-slate-700 space-y-1">
                  <li>Fix high-impact blocking inputs: associate programmatic labels with all citizen form controls.</li>
                  <li>Implement audio CAPTCHA alternative endpoint or Mobile OTP fallback for login & submission.</li>
                  <li>Ensure file upload dropzones have tabindex="0" and role="button" with Enter key keyboard listeners.</li>
                  <li>Ensure color contrast meets 4.5:1 across notification banners and table layouts.</li>
                  <li>Re-run AccessGov scanner to verify zero critical blockers prior to security clearance.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
