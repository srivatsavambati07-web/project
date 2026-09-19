"""
AccessGov - GIGW 3.0 & WCAG 2.2 Standard Mapping Engine
Maps axe-core rule violations to Indian Government Website Standards (GIGW 3.0) and WCAG 2.2 AA.
"""

from typing import Dict, Any

GIGW_RULES_MAP: Dict[str, Dict[str, Any]] = {
    "color-contrast": {
        "wcag_criterion": "1.4.3 Contrast (Minimum) Level AA",
        "gigw_clause": "6.1.4 Text and Visual Contrast Ratio",
        "category": "Perceivable",
        "description": "Visual presentation of text and images of text must have at least 4.5:1 contrast.",
        "mandatory": True,
        "default_persona": "Citizens with low vision or elderly citizens navigating on mobile under bright sunlight."
    },
    "image-alt": {
        "wcag_criterion": "1.1.1 Non-text Content Level A",
        "gigw_clause": "6.1.1 Descriptive Alternate Text for Government Media",
        "category": "Perceivable",
        "description": "All government logos, State Emblems, and scheme infographics must provide descriptive alt text.",
        "mandatory": True,
        "default_persona": "Blind citizens using screen-readers (NVDA/JAWS/TalkBack) unable to identify portal emblems."
    },
    "button-name": {
        "wcag_criterion": "4.1.2 Name, Role, Value Level A",
        "gigw_clause": "6.4.1 Programmatic Identification of Action Controls",
        "category": "Robust",
        "description": "Buttons such as OTP submit, modal triggers, and document uploads must convey programmatic purpose.",
        "mandatory": True,
        "default_persona": "Screen reader users hearing unlabelled 'Button' without knowing if clicking submits or clears data."
    },
    "label": {
        "wcag_criterion": "1.3.1 Info and Relationships Level A",
        "gigw_clause": "6.3.2 Explicit Labels for Form Controls",
        "category": "Understandable",
        "description": "Every form field (Aadhaar, Bank A/C, IFSC, Mobile) must have a paired <label> or aria-label.",
        "mandatory": True,
        "default_persona": "Blind students and citizens unable to determine which field expects bank particulars."
    },
    "tabindex": {
        "wcag_criterion": "2.4.3 Focus Order Level A",
        "gigw_clause": "6.2.3 Intuitive Navigation Sequence",
        "category": "Operable",
        "description": "Tab sequence must strictly follow logical reading order without disruptive positive tabindexes.",
        "mandatory": True,
        "default_persona": "Keyboard-only and motor-impaired citizens navigating without a mouse."
    },
    "captcha-accessible": {
        "wcag_criterion": "1.1.1 Non-text Content (CAPTCHA Exception)",
        "gigw_clause": "8.2.1 Accessible CAPTCHA & Verification Alternatives",
        "category": "Indian Portal Specific",
        "description": "Visual distorted CAPTCHAs must mandatorily provide audio alternatives or OTP mechanisms.",
        "mandatory": True,
        "default_persona": "Visually impaired citizens who are completely blocked from logging in or submitting forms."
    },
    "file-upload-accessible": {
        "wcag_criterion": "2.1.1 Keyboard Accessible Level A",
        "gigw_clause": "6.2.1 Keyboard Operability for Certificate Uploads",
        "category": "Operable",
        "description": "Document upload dropzones for caste/income certificates must be operable via Tab & Enter.",
        "mandatory": True,
        "default_persona": "Motor-impaired citizens who cannot activate drag-and-drop zones via mouse."
    }
}

def get_gigw_mapping(rule_id: str) -> Dict[str, Any]:
    if rule_id in GIGW_RULES_MAP:
        return GIGW_RULES_MAP[rule_id]
    return {
        "wcag_criterion": "4.1.2 Name, Role, Value Level AA",
        "gigw_clause": "6.4.1 Robust Assistive Technology Compatibility",
        "category": "Robust",
        "description": "Content must be robust enough to be interpreted reliably by assistive devices.",
        "mandatory": True,
        "default_persona": "Citizens relying on assistive tech to access public digital services."
    }
