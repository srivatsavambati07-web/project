import React, { useState, useEffect } from 'react';
import { 
  ScanResult, 
  BenchmarkItem, 
  AccessibilityViolation, 
  CitizenJourneyStage 
} from './types';
import { Header } from './components/Header';
import { HeroScanner } from './components/HeroScanner';
import { ActiveTargetCard } from './components/ActiveTargetCard';
import { ScoreOverview } from './components/ScoreOverview';
import { AccessibilityProfiles } from './components/AccessibilityProfiles';
import { CitizenJourneyFlow } from './components/CitizenJourneyFlow';
import { RemediationQueue } from './components/RemediationQueue';
import { CodeFixModal } from './components/CodeFixModal';
import { GIGWChecklistModal } from './components/GIGWChecklistModal';
import { NationalDirectoryModal } from './components/NationalDirectoryModal';
import { BenchmarkView } from './components/BenchmarkView';
import { ReportExportModal } from './components/ReportExportModal';
import { KeyboardReplayModal } from './components/KeyboardReplayModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { Footer } from './components/Footer';
import { CheckCircle2, History, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export const App: React.FC = () => {
  // Theme state (supports both dark and light mode seamlessly)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessgov_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('accessgov_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('accessgov_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Application Data States
  const [currentUrl, setCurrentUrl] = useState<string>('https://schemes.epfindia.gov.in/');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'benchmarks' | 'history' | 'about' | 'reports'>('audit');
  const [selectedStage, setSelectedStage] = useState<CitizenJourneyStage | 'all'>('all');

  // Modals & Drawers
  const [selectedViolationForFix, setSelectedViolationForFix] = useState<AccessibilityViolation | null>(null);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isReplayOpen, setIsReplayOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initial data loading
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Fetch benchmarks
        const bmRes = await fetch('/api/benchmarks');
        if (bmRes.ok) {
          const bmData = await bmRes.json();
          setBenchmarks(bmData);
        }

        // Fetch history or scan default
        const histRes = await fetch('/api/history');
        if (histRes.ok) {
          const histData = await histRes.json();
          setScanHistory(histData);
          if (histData.length > 0) {
            setScanResult(histData[0]);
            setCurrentUrl(histData[0].url);
            setIsLoading(false);
            return;
          }
        }

        // Trigger scan with EPF India
        const scanRes = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'schemes.epfindia.gov.in' }),
        });

        if (scanRes.ok) {
          const data = await scanRes.json();
          setScanResult(data);
          setCurrentUrl(data.url);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Scan handler
  const handleScan = async (url: string) => {
    try {
      setIsLoading(true);
      setCurrentUrl(url);
      setSelectedStage('all');
      setActiveTab('audit');

      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Scan failed');
      }

      const result: ScanResult = await response.json();
      setScanResult(result);
      setScanHistory((prev) => [result, ...prev.slice(0, 9)]);

      setStatusMessage(`Audit completed for ${result.portalName}. Found ${result.stats.totalIssues} compliance findings.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Audit scan error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate fix
  const handleRemediate = async (violationId: string) => {
    if (!scanResult) return;
    try {
      const response = await fetch('/api/remediate-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId: scanResult.id, violationId }),
      });

      if (response.ok) {
        const updated: ScanResult = await response.json();
        setScanResult(updated);
        setStatusMessage(`Remediation applied! AccessGov score updated to ${updated.stats.accessGovScore}/100.`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      console.error('Remediation error:', err);
    }
  };

  // AI Guidance request
  const handleRequestAiExplain = async (violation: AccessibilityViolation) => {
    try {
      setIsExplaining(true);
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ violation }),
      });

      if (response.ok) {
        const data = await response.json();
        if (scanResult) {
          const updatedIssues = scanResult.issues.map((i) => {
            if (i.id === violation.id) {
              return {
                ...i,
                plainLanguageCitizenExplanation: data.citizenExplanation,
                aiExplanation: data.developerNotes,
              };
            }
            return i;
          });
          setScanResult({ ...scanResult, issues: updatedIssues });
          if (selectedViolationForFix && selectedViolationForFix.id === violation.id) {
            setSelectedViolationForFix({
              ...selectedViolationForFix,
              plainLanguageCitizenExplanation: data.citizenExplanation,
              aiExplanation: data.developerNotes,
            });
          }
        }
      }
    } catch (err) {
      console.error('AI Explanation error:', err);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenReports={() => setIsReportOpen(true)}
        onOpenAbout={() => setIsArchitectureOpen(true)}
      />

      {/* Hero Scanner Section */}
      <HeroScanner
        currentUrl={currentUrl}
        onScan={handleScan}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        {/* Status Toast Banner */}
        {statusMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{statusMessage}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-emerald-700 dark:text-emerald-300 hover:underline text-[11px] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Audit View */}
        {activeTab === 'audit' && scanResult && (
          <div className="space-y-6">
            {/* 1. Active Target & Progress Card */}
            <ActiveTargetCard
              scanResult={scanResult}
              onRecrawl={() => handleScan(scanResult.url)}
              isLoading={isLoading}
            />

            {/* 2. Metrics Overview & Analytics Row */}
            <ScoreOverview
              scanResult={scanResult}
              onOpenReport={() => setIsReportOpen(true)}
              onOpenSpecs={() => setIsChecklistOpen(true)}
            />

            {/* 3. Accessibility Profiles Assessment */}
            <AccessibilityProfiles />

            {/* 4. Citizen Journey Accessibility Impact Flow & Critical Exclusion Incident */}
            <CitizenJourneyFlow
              onInspectFix={() => {
                const blocker = scanResult.issues.find((i) => i.priority === 'critical') || scanResult.issues[0];
                setSelectedViolationForFix(blocker);
              }}
              onOpenChecklist={() => setIsChecklistOpen(true)}
              onExportPdf={() => setIsReportOpen(true)}
              serviceName={scanResult.serviceName}
              flowRef={scanResult.flowRef}
              selectedStage={selectedStage}
              onSelectStage={setSelectedStage}
            />

            {/* 5. Detected Barrier Remediation Queue */}
            <RemediationQueue
              issues={scanResult.issues}
              onSelectViolation={(v) => setSelectedViolationForFix(v)}
            />
          </div>
        )}

        {/* Tab 2: National Benchmarks */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <BenchmarkView
              benchmarks={benchmarks}
              onSelectDomain={(domain: string) => {
                setActiveTab('audit');
                handleScan(domain);
              }}
            />
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <History className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Government Portal Audit History ({scanHistory.length})
              </h3>
            </div>

            {scanHistory.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No past audits recorded yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {scanHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setScanResult(item);
                      setActiveTab('audit');
                    }}
                    className="py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 px-3 rounded-xl transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.portalName}</span>
                        <span className="text-xs font-mono text-slate-500">{item.url}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Scanned on {new Date(item.scannedAt).toLocaleString()} • {item.stats.totalIssues} issues
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Score: {item.stats.accessGovScore}/100
                        </div>
                        <div className="text-[10px] text-rose-600 font-semibold">
                          {item.stats.critical} Critical Blockers
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: About / Reports */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                About AccessGov & The Government Service Intelligence Layer
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Standard accessibility tools merely flag technical WCAG rule violations without context. <strong>AccessGov</strong> introduces a domain-aware <em>Government Service Intelligence Layer</em> tailored specifically for Indian public digital infrastructure (.gov.in and .nic.in).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                  1. GIGW 3.0 & WCAG 2.2
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Maps technical DOM nodes directly to MeitY Guidelines for Indian Government Websites and international standards.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                  2. Citizen Journey Mapping
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Identifies which critical public workflow stage is blocked (Aadhaar verification, document upload, or pension submission).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                  3. Actionable Code Diff
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Provides copy-ready, certified accessible HTML/ARIA fixes for NIC development teams and contractors.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenSpecs={() => setIsChecklistOpen(true)}
        onOpenMethodology={() => setIsArchitectureOpen(true)}
      />

      {/* Modals */}
      {selectedViolationForFix && (
        <CodeFixModal
          isOpen={!!selectedViolationForFix}
          onClose={() => setSelectedViolationForFix(null)}
          violation={selectedViolationForFix}
          onRemediate={handleRemediate}
          onRequestAiExplain={handleRequestAiExplain}
          isExplaining={isExplaining}
        />
      )}

      {isChecklistOpen && (
        <GIGWChecklistModal
          isOpen={isChecklistOpen}
          onClose={() => setIsChecklistOpen(false)}
        />
      )}

      {isDirectoryOpen && (
        <NationalDirectoryModal
          isOpen={isDirectoryOpen}
          onClose={() => setIsDirectoryOpen(false)}
          onSelectPortal={(url) => {
            setActiveTab('audit');
            handleScan(url);
          }}
        />
      )}

      {scanResult && isReportOpen && (
        <ReportExportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          scanResult={scanResult}
        />
      )}

      {scanResult && isReplayOpen && (
        <KeyboardReplayModal
          isOpen={isReplayOpen}
          onClose={() => setIsReplayOpen(false)}
          scanResult={scanResult}
        />
      )}

      {isArchitectureOpen && (
        <ArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
