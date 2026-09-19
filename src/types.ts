export type CitizenJourneyStage = 
  | 'discovery'
  | 'guidelines'
  | 'authentication'
  | 'form_details'
  | 'document_upload'
  | 'submission';

export type AffectedDemographic = 
  | 'screen_reader'
  | 'low_vision'
  | 'motor_impaired'
  | 'elderly_cognitive'
  | 'regional_language';

export type IssueConfidence = 'auto_verified' | 'likely_issue' | 'manual_review';
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';
export type IssueImpact = 'critical' | 'serious' | 'moderate' | 'minor';

export interface GIGWClause {
  ruleNumber: string; // e.g. "6.1.1", "6.3.2", "8.2.1"
  clauseName: string;
  description: string;
  mandatoryForGov: boolean;
  category: 'Perceivable' | 'Operable' | 'Understandable' | 'Robust' | 'Indian Portal Specific';
}

export interface WCAGCriterion {
  number: string; // e.g. "1.1.1", "1.3.1", "2.1.1"
  title: string;
  level: 'A' | 'AA' | 'AAA';
  version: '2.1' | '2.2';
}

export interface CitizenJourneyMapping {
  stage: CitizenJourneyStage;
  stageName: string;
  task: string;
  affectedCitizen: string;
  affectedDemographic: AffectedDemographic;
  impactDescription: string;
  taskWeight: number; // 1 to 5 (e.g. document upload & OTP submit are high weight)
}

export interface RemediationGuidance {
  summary: string;
  effort: 'low' | 'medium' | 'high';
  beforeCode: string;
  afterCode: string;
  steps: string[];
  referenceLink?: string;
}

export interface AccessibilityViolation {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  impact: IssueImpact;
  priority: IssuePriority;
  confidence: IssueConfidence;
  targetSelector: string;
  htmlSnippet: string;
  failureSummary: string;
  wcagTags: string[];
  wcagCriterion: WCAGCriterion;
  gigwClause: GIGWClause;
  citizenJourney: CitizenJourneyMapping;
  plainLanguageCitizenExplanation?: string;
  aiExplanation?: string;
  remediation: RemediationGuidance;
  isRemediated?: boolean;
}

export interface CitizenStageSummary {
  stage: CitizenJourneyStage;
  stageName: string;
  description: string;
  issueCount: number;
  criticalBlockers: number;
  stageScore: number; // 0 to 100
  status: 'smooth' | 'friction' | 'blocked';
  topBarrier: string;
}

export interface ScanStats {
  totalIssues: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  accessGovScore: number; // 0 - 100 Government Accessibility Index
  gigwCompliancePercentage: number;
  wcagCompliancePercentage: number;
  confidenceBreakdown: {
    autoVerified: number;
    likelyIssue: number;
    manualReview: number;
  };
  demographicsImpacted: {
    screenReader: number;
    lowVision: number;
    motorImpaired: number;
    elderlyCognitive: number;
    regionalLanguage: number;
  };
  journeyBlockersCount: number;
}

export interface ScanResult {
  id: string;
  url: string;
  portalName: string;
  department: string;
  scannedAt: string;
  durationMs: number;
  mode: 'real_axe' | 'deep_journey' | 'custom_html';
  targetId?: string;
  auditScope?: string;
  serviceName?: string;
  flowRef?: string;
  pagesScanned?: number;
  statusText?: string;
  protocol?: string;
  stats: ScanStats;
  journeyStages: CitizenStageSummary[];
  issues: AccessibilityViolation[];
  executiveSummary: string;
  citizenSummary: string;
  departmentSummary: string;
}

export interface PortalPreset {
  id: string;
  name: string;
  domain: string;
  department: string;
  serviceName: string;
  badge: string;
  description: string;
  defaultUrl: string;
  sampleHtml?: string;
}

export interface BenchmarkItem {
  id: string;
  domain: string;
  name: string;
  department: string;
  sector: string;
  score: number;
  gigwReadiness: 'Certified / High' | 'Moderate' | 'Critical Gaps';
  criticalBlockers: number;
  lastAudited: string;
  primaryIssue: string;
}
