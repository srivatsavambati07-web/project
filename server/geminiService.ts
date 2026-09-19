import { GoogleGenAI } from '@google/genai';
import { AccessibilityViolation } from '../src/types';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY' && key.trim().length > 0) {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

export async function generatePlainLanguageExplanation(violation: AccessibilityViolation): Promise<{
  citizenExplanation: string;
  developerNotes: string;
}> {
  const client = getAiClient();
  if (!client) {
    return {
      citizenExplanation: `On the ${violation.citizenJourney.stageName} stage, an accessibility issue (${violation.title}) prevents ${violation.citizenJourney.affectedCitizen} from easily completing this task. Sighted or mouse assistance might be required.`,
      developerNotes: `Ensure compliance with GIGW 3.0 Clause ${violation.gigwClause.ruleNumber} and WCAG ${violation.wcagCriterion.number}. Use standard semantic markup and associated ARIA labels.`,
    };
  }

  try {
    const prompt = `You are the AI Intelligence Engine for AccessGov, an accessibility platform for Indian Government websites (GIGW 3.0 & WCAG 2.2).
Given this technical barrier detected on an Indian government portal:
- Rule: ${violation.ruleId} (${violation.title})
- Element snippet: ${violation.htmlSnippet}
- Government Task: ${violation.citizenJourney.task}
- Journey Stage: ${violation.citizenJourney.stageName}
- Affected Citizen Persona: ${violation.citizenJourney.affectedCitizen}
- GIGW 3.0 Clause: ${violation.gigwClause.ruleNumber} - ${violation.gigwClause.clauseName}

Produce a JSON object with:
1. "citizenExplanation": Exactly 2 simple, empathetic sentences in plain Indian English (no technical jargon like "DOM", "ARIA", "attributes") explaining to an ordinary student or citizen how this barrier interferes with their application process.
2. "developerNotes": 2 concise, actionable technical directives for National Informatics Centre (NIC) or government portal developers to fix it cleanly.

Respond with ONLY valid JSON:
{
  "citizenExplanation": "...",
  "developerNotes": "..."
}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return {
        citizenExplanation: parsed.citizenExplanation || `This step contains an accessibility barrier that may prevent ${violation.citizenJourney.affectedCitizen} from completing the form smoothly.`,
        developerNotes: parsed.developerNotes || `Review GIGW Clause ${violation.gigwClause.ruleNumber} and associate appropriate semantic elements.`,
      };
    }
  } catch (error) {
    console.warn('Gemini explanation fallback triggered:', error);
  }

  return {
    citizenExplanation: `On the ${violation.citizenJourney.stageName} step, an issue with ${violation.title.toLowerCase()} may confuse or block citizens using assistive speech or keyboard navigation.`,
    developerNotes: `Inspect ${violation.targetSelector} and implement GIGW 3.0 Clause ${violation.gigwClause.ruleNumber} guidelines.`,
  };
}

export async function generateDepartmentAndCitizenSummaries(
  portalName: string,
  url: string,
  issues: AccessibilityViolation[]
): Promise<{
  citizenSummary: string;
  departmentSummary: string;
}> {
  const criticalCount = issues.filter((i) => i.priority === 'critical').length;
  const highCount = issues.filter((i) => i.priority === 'high').length;
  const stagesImpacted = Array.from(new Set(issues.map((i) => i.citizenJourney.stageName)));

  const client = getAiClient();
  if (!client) {
    return {
      citizenSummary: `The ${portalName} contains ${criticalCount} critical barriers that directly obstruct citizens from finishing key steps like ${stagesImpacted.slice(0, 2).join(' and ')}. Students and applicants with visual or motor impairments will need assistance to submit applications.`,
      departmentSummary: `Comprehensive audit against GIGW 3.0 and WCAG 2.2 AA revealed ${issues.length} compliance findings (${criticalCount} critical blockers, ${highCount} high priority). Primary remediation is required in form labelling, accessible verification CAPTCHA, and keyboard certificate upload mechanisms.`,
    };
  }

  try {
    const prompt = `You are AccessGov's Accessibility Intelligence Engine for Indian Government websites.
Portal: ${portalName} (${url})
Total Findings: ${issues.length}
Critical Blockers: ${criticalCount}
High Priority: ${highCount}
Stages impacted: ${stagesImpacted.join(', ')}
Key barriers detected: ${issues.slice(0, 4).map((i) => `${i.title} on task: ${i.citizenJourney.task}`).join('; ')}

Generate two summaries:
1. "citizenSummary": A warm, easy-to-understand 2-3 sentence overview for citizens and advocacy groups explaining how accessible this service is for persons with disabilities.
2. "departmentSummary": A formal executive summary for Ministry IT Officers and NIC developers referencing GIGW 3.0 readiness, critical transaction blockers, and remediation urgency.

Respond in JSON only:
{
  "citizenSummary": "...",
  "departmentSummary": "..."
}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return {
        citizenSummary: parsed.citizenSummary,
        departmentSummary: parsed.departmentSummary,
      };
    }
  } catch (err) {
    console.warn('Summary generation fallback:', err);
  }

  return {
    citizenSummary: `The ${portalName} has ${criticalCount} critical issues affecting citizen tasks, especially in ${stagesImpacted[0] || 'forms'}. Applicants using screen readers may encounter difficulty without assistance.`,
    departmentSummary: `Automated assessment identified ${issues.length} accessibility findings against GIGW 3.0 criteria. Priority must be assigned to ${criticalCount} blocking barriers in citizen authentication and document verification.`,
  };
}
