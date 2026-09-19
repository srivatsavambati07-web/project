import { 
  CitizenJourneyStage, 
  AffectedDemographic, 
  IssuePriority, 
  IssueImpact, 
  CitizenJourneyMapping, 
  RemediationGuidance 
} from '../src/types';

export interface StageContextRule {
  keywords: string[];
  stage: CitizenJourneyStage;
  stageName: string;
  defaultTask: string;
  baseWeight: number; // 1 to 5
}

const STAGE_PATTERNS: StageContextRule[] = [
  {
    keywords: ['upload', 'file', 'attachment', 'certificate', 'pdf', 'document', 'dropzone', 'browse', 'dastavej'],
    stage: 'document_upload',
    stageName: 'Upload Documents & Certificates',
    defaultTask: 'Uploading required verification certificates (Income / Caste / Marksheet PDF)',
    baseWeight: 5,
  },
  {
    keywords: ['submit', 'pay', 'confirm', 'declaration', 'proceed', 'final', 'finish', 'complete', 'agreed', 'undertaking'],
    stage: 'submission',
    stageName: 'Declaration & Final Submission',
    defaultTask: 'Reviewing statutory declarations and submitting the final government application',
    baseWeight: 5,
  },
  {
    keywords: ['login', 'otp', 'aadhaar', 'captcha', 'signin', 'auth', 'passcode', 'verification', 'mobile-no', 'credential'],
    stage: 'authentication',
    stageName: 'Citizen Authentication & OTP Access',
    defaultTask: 'Verifying identity with Aadhaar / Mobile OTP / Security CAPTCHA to enter portal',
    baseWeight: 5,
  },
  {
    keywords: ['name', 'father', 'dob', 'gender', 'category', 'address', 'district', 'pincode', 'bank', 'ifsc', 'account', 'email', 'phone', 'detail', 'form', 'input'],
    stage: 'form_details',
    stageName: 'Personal Details & Scheme Form',
    defaultTask: 'Entering citizen identity, banking particulars, and demographic scheme details',
    baseWeight: 4,
  },
  {
    keywords: ['eligibility', 'criteria', 'guideline', 'notice', 'faq', 'instruction', 'circular', 'rule', 'scheme-info', 'table'],
    stage: 'guidelines',
    stageName: 'Eligibility Criteria & Scheme Guidelines',
    defaultTask: 'Reviewing qualifying income limits, application deadlines, and scheme norms',
    baseWeight: 3,
  },
  {
    keywords: ['search', 'find', 'home', 'header', 'nav', 'menu', 'footer', 'logo', 'portal', 'banner', 'portal-link'],
    stage: 'discovery',
    stageName: 'Portal Discovery & Scheme Finding',
    defaultTask: 'Locating relevant state/central welfare schemes and navigating the portal directory',
    baseWeight: 2,
  },
];

export function determineCitizenJourney(
  ruleId: string,
  targetSelector: string,
  htmlSnippet: string,
  portalContext: string = 'scholarship'
): CitizenJourneyMapping {
  const combined = `${targetSelector} ${htmlSnippet}`.toLowerCase();

  let matchedStage: StageContextRule = STAGE_PATTERNS[3]; // default to form_details

  for (const pattern of STAGE_PATTERNS) {
    if (pattern.keywords.some((k) => combined.includes(k))) {
      matchedStage = pattern;
      break;
    }
  }

  // Refine affected citizen persona based on rule and stage
  let affectedCitizen = 'Screen-reader user relying on audio feedback';
  let affectedDemographic: AffectedDemographic = 'screen_reader';
  let impactDescription = 'May prevent understanding or completing this step of the service';

  if (ruleId === 'color-contrast') {
    affectedDemographic = 'low_vision';
    affectedCitizen = 'Citizen with low vision, cataract, or viewing on affordable mobile screen in daylight';
    impactDescription = `Text in the ${matchedStage.stageName} stage is difficult or impossible to read without straining.`;
  } else if (ruleId === 'tabindex' || ruleId === 'file-upload-accessible') {
    affectedDemographic = 'motor_impaired';
    affectedCitizen = 'Citizen navigating without mouse using keyboard Tab / Enter or switch assistive device';
    impactDescription = `Cannot activate or navigate through the ${matchedStage.stageName} controls using standard keyboard access.`;
  } else if (ruleId === 'captcha-accessible') {
    affectedDemographic = 'screen_reader';
    affectedCitizen = 'Visually impaired citizen or senior citizen blocked by graphical verification';
    impactDescription = `Total blocking barrier: Citizen cannot solve the image CAPTCHA without sighted assistance to complete login/submission.`;
  } else if (ruleId === 'label') {
    affectedDemographic = 'screen_reader';
    affectedCitizen = 'Screen reader user (blind or low-vision student/applicant)';
    impactDescription = `The input field is announced without context (e.g. "blank edit box"), risking submission of invalid data or abandonment.`;
  } else if (ruleId === 'button-name') {
    affectedDemographic = 'screen_reader';
    affectedCitizen = 'Screen reader user';
    impactDescription = `Control is read as unlabelled "Button", so the citizen cannot determine whether clicking initiates an upload, clears fields, or submits.`;
  } else if (ruleId === 'language-attribute') {
    affectedDemographic = 'regional_language';
    affectedCitizen = 'Citizen using Hindi or regional text-to-speech assistive synthesis';
    impactDescription = `Assistive synthesis reads Hindi text with English pronunciation rules, causing unintelligible audio output.`;
  }

  // Contextualize specific government task
  let task = matchedStage.defaultTask;
  if (portalContext.includes('scholarship')) {
    if (matchedStage.stage === 'document_upload') task = 'Uploading caste/income verification certificate for student scholarship';
    if (matchedStage.stage === 'form_details') task = 'Filling student demographic and DBT bank account details';
    if (matchedStage.stage === 'authentication') task = 'Logging into National Scholarship Portal with OTR / Student ID';
  } else if (portalContext.includes('transport') || portalContext.includes('parivahan')) {
    if (matchedStage.stage === 'document_upload') task = 'Uploading medical certificate and age proof for Driving License';
    if (matchedStage.stage === 'form_details') task = 'Entering vehicle registration and permanent address';
  } else if (portalContext.includes('uidai')) {
    if (matchedStage.stage === 'authentication') task = 'Receiving and entering 6-digit Aadhaar OTP';
  }

  return {
    stage: matchedStage.stage,
    stageName: matchedStage.stageName,
    task,
    affectedCitizen,
    affectedDemographic,
    impactDescription,
    taskWeight: matchedStage.baseWeight,
  };
}

export function calculateTaskAwarePriority(
  impact: IssueImpact,
  taskWeight: number,
  ruleId: string
): { priority: IssuePriority; scorePenalty: number } {
  // Task-aware scoring: High task weight (e.g., OTP, document upload, submit)
  // elevates even moderate issues to High or Critical priority because they block real citizens!
  if (ruleId === 'captcha-accessible' || (taskWeight >= 5 && (impact === 'critical' || impact === 'serious'))) {
    return { priority: 'critical', scorePenalty: 20 };
  }

  if (taskWeight >= 4 && (impact === 'critical' || impact === 'serious')) {
    return { priority: 'high', scorePenalty: 14 };
  }

  if (taskWeight >= 3 || impact === 'serious') {
    return { priority: 'medium', scorePenalty: 8 };
  }

  return { priority: 'low', scorePenalty: 4 };
}

export function generateRemediationGuidance(
  ruleId: string,
  targetSelector: string,
  htmlSnippet: string
): RemediationGuidance {
  switch (ruleId) {
    case 'label':
      return {
        summary: 'Add an explicit <label for="..."> or aria-label attribute matching the citizen field purpose.',
        effort: 'low',
        beforeCode: htmlSnippet.length > 5 ? htmlSnippet : `<input type="text" id="citizen_id" placeholder="Enter Registration No">`,
        afterCode: `<label for="citizen_id" class="gov-label">Citizen Registration / Application Number <span class="required">*</span></label>\n<input type="text" id="citizen_id" name="citizen_id" class="gov-input" required aria-required="true">`,
        steps: [
          'Locate the form input in the government template.',
          'Ensure the input element has a unique id attribute.',
          'Associate a visible <label> with a matching for="..." attribute.',
          'If visual space is constrained, provide aria-label="Descriptive Field Name".',
        ],
      };

    case 'color-contrast':
      return {
        summary: 'Increase color contrast ratio of text and background to at least 4.5:1 (WCAG AA & GIGW 6.1.4).',
        effort: 'low',
        beforeCode: `<span style="color: #94a3b8; background-color: #ffffff;">Application Deadline: 31st Oct</span>`,
        afterCode: `<span style="color: #1e293b; background-color: #ffffff; font-weight: 600;">Application Deadline: 31st Oct</span>`,
        steps: [
          'Audit foreground text color against the container background using a contrast checker.',
          'Darken light gray text (e.g. change #94a3b8 to #1e293b or darker).',
          'Avoid using yellow or light green text on white government cards.',
        ],
      };

    case 'button-name':
      return {
        summary: 'Provide an accessible text name via text content, aria-label, or title for assistive devices.',
        effort: 'low',
        beforeCode: `<button class="btn-icon" onclick="uploadDoc()"><i class="fa fa-upload"></i></button>`,
        afterCode: `<button class="btn-icon" aria-label="Upload Supporting Caste Certificate PDF" onclick="uploadDoc()">\n  <i class="fa fa-upload" aria-hidden="true"></i>\n  <span class="sr-only">Upload Certificate</span>\n</button>`,
        steps: [
          'Inspect icon-only buttons (such as search, upload, or refresh icons).',
          'Add aria-label="Specific Action Name" to the <button>.',
          'Mark internal vector icons with aria-hidden="true" to avoid screen-reader stutter.',
        ],
      };

    case 'captcha-accessible':
      return {
        summary: 'Provide an accessible audio CAPTCHA alternative or fallback to SMS/Email OTP (GIGW 3.0 Clause 8.2).',
        effort: 'medium',
        beforeCode: `<div class="captcha-box">\n  <img src="/captcha.png" alt="captcha">\n  <input type="text" name="captcha_val">\n</div>`,
        afterCode: `<div class="captcha-box">\n  <img src="/captcha.png" alt="Visual verification code">\n  <button type="button" aria-label="Play audio CAPTCHA" onclick="playAudioCaptcha()">🔊 Listen</button>\n  <button type="button" aria-label="Refresh verification image" onclick="refreshCaptcha()">🔄 Refresh</button>\n  <label for="captcha_val">Enter characters seen or heard:</label>\n  <input type="text" id="captcha_val" name="captcha_val">\n</div>`,
        steps: [
          'Add an audio streaming endpoint for synthesized numerical speech.',
          'Provide a dedicated "Listen to CAPTCHA" keyboard-accessible button.',
          'Alternatively offer Mobile OTP verification as sanctioned by GIGW 3.0.',
        ],
      };

    case 'file-upload-accessible':
      return {
        summary: 'Ensure certificate drag-and-drop zones allow standard keyboard activation and file selection.',
        effort: 'medium',
        beforeCode: `<div class="drop-zone" ondrop="handleDrop(event)">Drop PDF Certificate here</div>`,
        afterCode: `<div class="drop-zone" tabindex="0" role="button" aria-label="Upload Certificate (Press Enter to browse files)" onkeydown="if(event.key==='Enter') fileInput.click()">\n  <input type="file" id="cert_file" class="sr-only" onchange="handleFile(this)">\n  <span>Drag certificate PDF here or press Enter to browse</span>\n</div>`,
        steps: [
          'Add tabindex="0" and role="button" to the custom container.',
          'Add keyboard listeners for "Enter" and "Space" keys to trigger the hidden file input.',
          'Include live region (aria-live="polite") to announce upload status upon selection.',
        ],
      };

    default:
      return {
        summary: 'Ensure valid accessibility semantics and programmatic labels according to GIGW 3.0 guidelines.',
        effort: 'medium',
        beforeCode: htmlSnippet || `<div onclick="doAction()">Submit</div>`,
        afterCode: `<button type="button" class="gov-btn" onclick="doAction()">Submit</button>`,
        steps: [
          'Use native semantic HTML elements where possible (<button>, <a href>, <input>).',
          'Verify keyboard tab sequence and focus states.',
          'Test with free screen readers like NVDA or ChromeVox.',
        ],
      };
  }
}
