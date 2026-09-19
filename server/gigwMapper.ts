import { GIGWClause, WCAGCriterion } from '../src/types';

export interface RuleStandardMapping {
  wcag: WCAGCriterion;
  gigw: GIGWClause;
  defaultDemographic: 'screen_reader' | 'low_vision' | 'motor_impaired' | 'elderly_cognitive' | 'regional_language';
  defaultCitizenPersona: string;
}

export const GIGW_WCAG_RULES: Record<string, RuleStandardMapping> = {
  'color-contrast': {
    wcag: {
      number: '1.4.3',
      title: 'Contrast (Minimum)',
      level: 'AA',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.1.4',
      clauseName: 'Text and Visual Contrast Ratio',
      description: 'The visual presentation of text and images of text must have a contrast ratio of at least 4.5:1 for standard text and 3:1 for large text across Indian government portals.',
      mandatoryForGov: true,
      category: 'Perceivable',
    },
    defaultDemographic: 'low_vision',
    defaultCitizenPersona: 'Citizens with low vision or elderly citizens using non-backlit monitors or mobile devices in bright outdoor sunlight.',
  },
  'image-alt': {
    wcag: {
      number: '1.1.1',
      title: 'Non-text Content',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.1.1',
      clauseName: 'Descriptive Alternate Text for Government Media',
      description: 'All non-text content including State Emblems, Ministry logos, scheme banners, and infographics must have a meaningful textual alternative in English/Hindi.',
      mandatoryForGov: true,
      category: 'Perceivable',
    },
    defaultDemographic: 'screen_reader',
    defaultCitizenPersona: 'Blind or visually impaired citizens relying on screen-readers (NVDA, JAWS, or mobile TalkBack) who cannot interpret unlabelled scheme icons.',
  },
  'button-name': {
    wcag: {
      number: '4.1.2',
      title: 'Name, Role, Value',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.4.1',
      clauseName: 'Programmatic Identification of Action Controls',
      description: 'Action elements such as OTP verification, submit buttons, modal triggers, and document download icons must convey their functional purpose programmatically.',
      mandatoryForGov: true,
      category: 'Robust',
    },
    defaultDemographic: 'screen_reader',
    defaultCitizenPersona: 'Screen reader users who hear generic phrases like "button" or "unlabeled item" without knowing if clicking will submit the form or clear data.',
  },
  'label': {
    wcag: {
      number: '1.3.1',
      title: 'Info and Relationships',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.3.2',
      clauseName: 'Explicit Labels for Form Controls',
      description: 'Every input element in citizen workflows (Aadhaar, Bank Account, Mobile Number, IFSC) must be explicitly paired with a <label> or aria-label.',
      mandatoryForGov: true,
      category: 'Understandable',
    },
    defaultDemographic: 'screen_reader',
    defaultCitizenPersona: 'Visually impaired citizens filling out official online application forms who cannot discern which field asks for Bank Account vs Mobile Number.',
  },
  'link-name': {
    wcag: {
      number: '2.4.4',
      title: 'Link Purpose (In Context)',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.2.4',
      clauseName: 'Informative Hyperlink Purpose',
      description: 'Hyperlinks must explicitly state their destination or action. Ambiguous phrases like "Click Here" or "Read More" are strictly prohibited.',
      mandatoryForGov: true,
      category: 'Operable',
    },
    defaultDemographic: 'screen_reader',
    defaultCitizenPersona: 'Citizens browsing links via screen reader link lists who encounter repeated ambiguous entries like "Click Here" for downloading different scheme guidelines.',
  },
  'document-title': {
    wcag: {
      number: '2.4.2',
      title: 'Page Titled',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.2.2',
      clauseName: 'Unique and Descriptive Page Titles',
      description: 'Each public portal page must provide a unique, descriptive <title> tag reflecting the ministry name and specific service or form stage.',
      mandatoryForGov: true,
      category: 'Operable',
    },
    defaultDemographic: 'screen_reader',
    defaultCitizenPersona: 'Screen-reader users with multiple open government tabs who cannot tell whether they are on the application form, fee receipt, or home portal.',
  },
  'tabindex': {
    wcag: {
      number: '2.4.3',
      title: 'Focus Order',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.2.3',
      clauseName: 'Intuitive Navigation Sequence',
      description: 'Focus navigation via Tab key must strictly preserve the reading and operational logic of citizen forms without arbitrary positive tabindexes.',
      mandatoryForGov: true,
      category: 'Operable',
    },
    defaultDemographic: 'motor_impaired',
    defaultCitizenPersona: 'Keyboard-only citizens or persons with motor disabilities who get disoriented when the Tab key jumps unpredictably across the page.',
  },
  'aria-required-children': {
    wcag: {
      number: '1.3.1',
      title: 'Info and Relationships',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.4.1',
      clauseName: 'Assistive Tree Semantics Integrity',
      description: 'Complex citizen widgets (application step tabs, dropdown menus, service accordions) must maintain valid ARIA child relationships.',
      mandatoryForGov: true,
      category: 'Robust',
    },
    defaultDemographic: 'screen_reader',
    defaultCitizenPersona: 'Assistive technology users whose screen reader fails to recognize expandable scheme categories or active application steps.',
  },
  'captcha-accessible': {
    wcag: {
      number: '1.1.1',
      title: 'Non-text Content (CAPTCHA Exception)',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '8.2.1',
      clauseName: 'Accessible CAPTCHA & Verification Alternatives',
      description: 'Indian Government websites using visual distorted image CAPTCHAs must mandatorily provide an audio CAPTCHA alternative or SMS/Email OTP mechanism.',
      mandatoryForGov: true,
      category: 'Indian Portal Specific',
    },
    defaultDemographic: 'screen_reader',
    defaultCitizenPersona: 'Visually impaired citizens who are completely blocked from logging in or submitting applications due to distorted graphic security codes.',
  },
  'language-attribute': {
    wcag: {
      number: '3.1.1',
      title: 'Language of Page',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '7.1.1',
      clauseName: 'Multilingual Page and Language Tagging',
      description: 'Pages published in Hindi or other 8th Schedule official languages must declare standard lang codes (e.g. lang="hi") for Bhashini and text-to-speech tools.',
      mandatoryForGov: true,
      category: 'Indian Portal Specific',
    },
    defaultDemographic: 'regional_language',
    defaultCitizenPersona: 'Citizens using regional Indian speech synthesizers whose screen readers attempt to pronounce Hindi or regional text using English phonetics.',
  },
  'file-upload-accessible': {
    wcag: {
      number: '2.1.1',
      title: 'Keyboard',
      level: 'A',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.2.1',
      clauseName: 'Keyboard Operability for Certificate Uploads',
      description: 'Document upload interfaces for income/caste certificates must support standard keyboard navigation and clear status announcements.',
      mandatoryForGov: true,
      category: 'Operable',
    },
    defaultDemographic: 'motor_impaired',
    defaultCitizenPersona: 'Motor-impaired applicants unable to use a mouse who cannot activate the "Drag & Drop Certificate" target using only the keyboard.',
  },
};

export function getStandardMapping(ruleId: string): RuleStandardMapping {
  if (GIGW_WCAG_RULES[ruleId]) {
    return GIGW_WCAG_RULES[ruleId];
  }

  // Fallback for general axe-core rules
  return {
    wcag: {
      number: '4.1.2',
      title: 'Name, Role, Value (General Accessibility)',
      level: 'AA',
      version: '2.1',
    },
    gigw: {
      ruleNumber: '6.4.1',
      clauseName: 'Robust Assistive Technology Compatibility',
      description: 'Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.',
      mandatoryForGov: true,
      category: 'Robust',
    },
    defaultDemographic: 'screen_reader',
    defaultCitizenPersona: 'Citizens relying on assistive devices to interact with digital government services.',
  };
}
