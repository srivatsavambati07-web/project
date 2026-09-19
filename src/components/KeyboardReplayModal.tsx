import React, { useState } from 'react';
import { 
  X, 
  Keyboard, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { ScanResult } from '../types';

interface KeyboardReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult;
}

interface FocusStep {
  step: number;
  selector: string;
  elementName: string;
  tabAccessible: boolean;
  hasVisibleFocus: boolean;
  hasLabel: boolean;
  screenReaderAnnouncement: string;
  barrierNote?: string;
  stageName: string;
}

export const KeyboardReplayModal: React.FC<KeyboardReplayModalProps> = ({
  isOpen,
  onClose,
  scanResult,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  // Build realistic focus progression for the scanned portal
  const steps: FocusStep[] = [
    {
      step: 1,
      selector: '#skip_link',
      elementName: 'Skip to Main Content Link',
      tabAccessible: true,
      hasVisibleFocus: true,
      hasLabel: true,
      screenReaderAnnouncement: '"Link, Skip to Main Content"',
      stageName: '1. Scheme Discovery',
    },
    {
      step: 2,
      selector: 'nav a[href="/faq"]',
      elementName: 'Scheme FAQ Link',
      tabAccessible: true,
      hasVisibleFocus: true,
      hasLabel: false,
      screenReaderAnnouncement: '"Link, Click Here"',
      barrierNote: 'Ambiguous link text fails GIGW 6.2.4; screen reader user cannot tell destination.',
      stageName: '2. Eligibility & Guidelines',
    },
    {
      step: 3,
      selector: '#otr_number',
      elementName: 'Student OTR Registration Input',
      tabAccessible: true,
      hasVisibleFocus: false,
      hasLabel: false,
      screenReaderAnnouncement: '"Edit text, blank"',
      barrierNote: 'CRITICAL BLOCKER: Missing programmatic label. Blind student does not know this expects their 14-digit OTR.',
      stageName: '3. Authentication & OTP Access',
    },
    {
      step: 4,
      selector: '.captcha-container img',
      elementName: 'Security Image CAPTCHA',
      tabAccessible: false,
      hasVisibleFocus: false,
      hasLabel: false,
      screenReaderAnnouncement: '"Graphic, security code"',
      barrierNote: 'CRITICAL BLOCKER: No audio CAPTCHA alternative (GIGW Clause 8.2). Completely stops blind applicants.',
      stageName: '3. Authentication & OTP Access',
    },
    {
      step: 5,
      selector: '#student_full_name',
      elementName: 'Applicant Aadhaar Name Field',
      tabAccessible: true,
      hasVisibleFocus: true,
      hasLabel: false,
      screenReaderAnnouncement: '"Edit text, blank"',
      barrierNote: 'Placeholder is not an accessible label (WCAG 1.3.1 & 3.3.2).',
      stageName: '4. Personal Details Form',
    },
    {
      step: 6,
      selector: '#dropzone_cert',
      elementName: 'Certificate Dropzone Container',
      tabAccessible: false,
      hasVisibleFocus: false,
      hasLabel: false,
      screenReaderAnnouncement: '[Silence - Element skipped by keyboard Tab key]',
      barrierNote: 'CRITICAL BLOCKER: Custom <div> lacks tabindex="0" and role="button". Motor-impaired citizen cannot upload certificate.',
      stageName: '5. Document Upload',
    },
    {
      step: 7,
      selector: '#final_submit_btn',
      elementName: 'Submit Application Button',
      tabAccessible: true,
      hasVisibleFocus: true,
      hasLabel: true,
      screenReaderAnnouncement: '"Button, Submit Scholarship Application"',
      stageName: '6. Declaration & Final Submission',
    },
  ];

  const currentStep = steps[currentStepIdx] || steps[0];

  const handleNext = () => {
    setCurrentStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentStepIdx((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Keyboard & Screen-Reader Navigation Replay
              </h3>
              <p className="text-xs text-slate-500">
                Interactive simulator demonstrating what a disabled citizen hears and experiences on {scanResult.portalName}.
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Stepper Progress Indicator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Focus Stop {currentStep.step} of {steps.length}: <strong className="text-slate-900">{currentStep.elementName}</strong></span>
              <span className="text-blue-700 font-mono text-[11px]">{currentStep.stageName}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex gap-1">
              {steps.map((s, idx) => (
                <div
                  key={s.step}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`h-full flex-1 cursor-pointer transition-all ${
                    idx === currentStepIdx
                      ? 'bg-blue-600'
                      : idx < currentStepIdx
                      ? 'bg-slate-400'
                      : 'bg-slate-200'
                  } ${s.barrierNote ? 'ring-1 ring-rose-400' : ''}`}
                  title={`Step ${s.step}: ${s.elementName}`}
                />
              ))}
            </div>
          </div>

          {/* Virtual Browser Visualizer */}
          <div className="border border-slate-300 rounded-xl bg-slate-900 text-slate-100 p-5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-300">https://{scanResult.url.replace(/^https?:\/\//, '')}</span>
              </span>
              <span className="font-mono text-[11px] text-amber-400">
                Active DOM Element: {currentStep.selector}
              </span>
            </div>

            {/* Simulated Element Display */}
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Target Element Inspection</span>
                <div className="flex items-center gap-2">
                  {currentStep.tabAccessible ? (
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-sm">
                      ✓ Tab Accessible
                    </span>
                  ) : (
                    <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-sm font-bold">
                      ✗ Skipped by Tab Key!
                    </span>
                  )}

                  {currentStep.hasVisibleFocus ? (
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-sm">
                      ✓ Visible Outline
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-sm">
                      ! Missing Focus Indicator
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-md border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
                {currentStep.elementName} ({currentStep.selector})
              </div>
            </div>

            {/* Screen Reader Voice Announcement Simulator */}
            <div className="bg-blue-950/80 border border-blue-800 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Screen Reader Voice Output (NVDA / TalkBack):</span>
              </div>
              <p className="font-mono text-sm text-white bg-black/40 p-2.5 rounded-md border border-blue-900">
                {currentStep.screenReaderAnnouncement}
              </p>
            </div>

            {/* Barrier Warning if any */}
            {currentStep.barrierNote && (
              <div className="bg-rose-950/80 border border-rose-800 rounded-lg p-3 text-xs text-rose-200 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300">Accessibility Friction Identified: </span>
                  <span>{currentStep.barrierNote}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Tab Stop (Shift+Tab)</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                Step {currentStep.step} of {steps.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next Tab Stop (Tab key)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
