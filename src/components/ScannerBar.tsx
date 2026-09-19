import React, { useState } from 'react';
import { Search, Loader2, Globe, CheckCircle2, AlertTriangle, Code2, Sparkles } from 'lucide-react';
import { PORTAL_PRESETS } from '../data/portalPresets';

interface ScannerBarProps {
  currentUrl: string;
  onScan: (url: string, customHtml?: string) => void;
  isLoading: boolean;
}

export const ScannerBar: React.FC<ScannerBarProps> = ({ currentUrl, onScan, isLoading }) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [showCustomHtml, setShowCustomHtml] = useState(false);
  const [customHtmlContent, setCustomHtmlContent] = useState('');

  const isGovDomain = inputUrl.toLowerCase().includes('.gov.in') || inputUrl.toLowerCase().includes('.nic.in');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showCustomHtml && customHtmlContent.trim()) {
      onScan(inputUrl || 'https://custom-portal.gov.in', customHtmlContent);
    } else {
      onScan(inputUrl);
    }
  };

  const handleSelectPreset = (domain: string) => {
    const url = `https://${domain}`;
    setInputUrl(url);
    onScan(url);
  };

  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8" id="scanner-bar-container">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Main URL Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter Indian Government portal URL (e.g., https://scholarships.gov.in or .nic.in)"
              className="w-full pl-10 pr-32 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              id="gov-url-input"
              disabled={isLoading}
            />
            {/* Domain verification badge */}
            <div className="absolute inset-y-0 right-2 flex items-center pr-1.5">
              {isGovDomain ? (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Official .gov.in
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  Public Service
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading || (!inputUrl && !customHtmlContent)}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              id="btn-run-intelligence-scan"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Journey...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Evaluate Citizen Journey</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowCustomHtml(!showCustomHtml)}
              className={`p-2.5 border rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer ${
                showCustomHtml ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-300'
              }`}
              title="Toggle Custom HTML / DOM Snippet Evaluation"
              id="btn-toggle-custom-html"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Custom HTML Drawer */}
        {showCustomHtml && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>Paste Portal HTML snippet for immediate DOM + axe-core inspection:</span>
              <span className="text-slate-500">Supports custom inputs, dropzones, CAPTCHA markup</span>
            </div>
            <textarea
              rows={4}
              value={customHtmlContent}
              onChange={(e) => setCustomHtmlContent(e.target.value)}
              placeholder="<form id='scholarship_form'><input type='text' id='applicant_name'><div class='dropzone'>Upload Certificate</div></form>"
              className="w-full p-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
              id="custom-html-textarea"
            />
          </div>
        )}

        {/* Quick Presets for Popular Portals */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-0.5">
          <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Portal Presets:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PORTAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.domain)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                  inputUrl.includes(preset.domain)
                    ? 'bg-blue-100 text-blue-800 border-blue-300 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
                title={`${preset.name} - ${preset.serviceName}`}
                id={`preset-${preset.id}`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
