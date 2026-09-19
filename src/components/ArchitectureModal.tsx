import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Cpu, 
  Layers, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Code2 
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'fastapi' | 'playwright' | 'db'>('flow');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fastApiCode = `from fastapi import FastAPI, HTTPException
from playwright.async_api import async_playwright
from gigw_mapper import get_gigw_mapping
from citizen_journey import map_citizen_journey, calculate_task_priority

app = FastAPI(title="AccessGov Intelligence Engine")

@app.post("/api/scan")
async def scan_portal(url: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until="domcontentloaded")
        
        # Inject axe-core
        await page.add_script_tag(url="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js")
        axe_results = await page.evaluate("() => axe.run()")
        
        # Map through Government Service Intelligence Layer
        findings = []
        for violation in axe_results["violations"]:
            standard = get_gigw_mapping(violation["id"])
            journey = map_citizen_journey(violation["id"], violation["nodes"][0]["target"])
            priority, penalty = calculate_task_priority(violation["impact"], journey["task_weight"])
            
            findings.append({
                "rule_id": violation["id"],
                "wcag": standard["wcag_criterion"],
                "gigw": standard["gigw_clause"],
                "citizen_journey": journey,
                "priority": priority
            })
            
        await browser.close()
        return {"url": url, "findings": findings}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                System Architecture & Tech Stack
              </h3>
              <p className="text-xs text-slate-500">
                React + FastAPI + Playwright + Chromium + axe-core + GIGW 3.0 Engine + PostgreSQL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'flow'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Architecture Flow
          </button>
          <button
            onClick={() => setActiveTab('fastapi')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'fastapi'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            FastAPI Backend (main.py)
          </button>
          <button
            onClick={() => setActiveTab('playwright')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'playwright'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Playwright + axe-core Runner
          </button>
          <button
            onClick={() => setActiveTab('db')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'db'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            PostgreSQL Database Schema
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs">
          {activeTab === 'flow' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed space-y-2">
                <span className="text-amber-400 font-bold block">Execution Pipeline:</span>
                <p>
                  Government URL (.gov.in) → React / Vite Frontend
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />FastAPI Backend Service (/api/scan)
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />Async Playwright (Chromium Headless)
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />axe-core (Injected DOM WCAG Evaluation)
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />WCAG 2.2 + GIGW 3.0 Clause Mapping Engine
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />Confidence Layer (Auto-Verified vs Likely Issue)
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />Citizen Journey Engine (Stage & Task Identification)
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />Task-Aware Priority Engine (Blocker Scoring)
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />Gemini AI Plain-Language Explanation Engine
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />PostgreSQL Storage (Scans, Violations, Benchmarks)
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;↓
                  <br />AccessGov Interactive Intelligence Dashboard
                </p>
              </div>

              {/* Core Innovation Callout */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Key Innovation: Government Service Intelligence Layer
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Existing tools only output raw WCAG codes like &quot;color-contrast&quot; or &quot;button-name&quot;. AccessGov
                  contextualizes these into:
                </p>
                <div className="p-3 bg-white border border-blue-200 rounded-md font-mono text-xs font-semibold text-blue-900">
                  Technical Barrier → Affected User → Government Task → Journey Stage → Impact → Remediation Priority
                </div>
                <p className="text-slate-600 text-[11px]">
                  <strong>Example:</strong> Missing form label on NSP portal is recognized not just as WCAG 1.3.1, but
                  specifically as a screen-reader obstacle in the &quot;Personal Details&quot; stage for &quot;Student DBT Bank
                  Account&quot;, directly preventing scholarship disbursement.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'fastapi' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">FastAPI Async Architecture (/backend/main.py):</span>
                <button
                  onClick={() => copyCode(fastApiCode)}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1 border border-slate-200 px-2.5 py-1 rounded-md"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto">
                {fastApiCode}
              </pre>
            </div>
          )}

          {activeTab === 'playwright' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-700">Browser Automation & axe-core Execution:</span>
              <p className="text-slate-600">
                Playwright launches a headless Chromium instance, injects the official axe-core evaluation script, and
                evaluates the rendered DOM tree including shadow DOM, dynamic dialogs, and iframe contexts.
              </p>
              <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl space-y-1">
                <p># Install Playwright & Chromium</p>
                <p className="text-slate-100">pip install playwright axe-core-python</p>
                <p className="text-slate-100">playwright install chromium</p>
              </div>
            </div>
          )}

          {activeTab === 'db' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-700">PostgreSQL Relational Schema (/backend/database.py):</span>
              <p className="text-slate-600">
                Stores historical scans, longitudinal compliance trends, and multi-site benchmarks.
              </p>
              <div className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl space-y-1">
                <p className="text-amber-400">TABLE scans (</p>
                <p>&nbsp;&nbsp;id VARCHAR(64) PRIMARY KEY,</p>
                <p>&nbsp;&nbsp;url VARCHAR(512),</p>
                <p>&nbsp;&nbsp;portal_name VARCHAR(256),</p>
                <p>&nbsp;&nbsp;accessgov_score INT,</p>
                <p>&nbsp;&nbsp;gigw_score INT,</p>
                <p>&nbsp;&nbsp;critical_blockers INT,</p>
                <p>&nbsp;&nbsp;scanned_at TIMESTAMP</p>
                <p className="text-amber-400">);</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
