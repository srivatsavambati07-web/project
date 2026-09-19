"""
AccessGov - Government Service Intelligence Layer (Python)
Maps technical barriers to:
Technical Barrier -> Affected User -> Government Task -> Citizen Journey Stage -> Impact -> Priority
"""

from typing import Dict, Any, Tuple

STAGE_PATTERNS = [
    {
        "keywords": ["upload", "file", "attachment", "certificate", "pdf", "document", "dropzone", "dastavej"],
        "stage": "document_upload",
        "stage_name": "Upload Documents & Certificates",
        "task": "Uploading caste, income, or eligibility certificates",
        "weight": 5
    },
    {
        "keywords": ["submit", "pay", "declaration", "confirm", "proceed", "final", "complete"],
        "stage": "submission",
        "stage_name": "Declaration & Final Submission",
        "task": "Accepting declaration and final scheme application submission",
        "weight": 5
    },
    {
        "keywords": ["login", "otp", "aadhaar", "captcha", "signin", "auth", "verification"],
        "stage": "authentication",
        "stage_name": "Citizen Authentication & OTP Access",
        "task": "Aadhaar / Mobile OTP verification and login",
        "weight": 5
    },
    {
        "keywords": ["name", "father", "dob", "gender", "address", "bank", "ifsc", "form", "input"],
        "stage": "form_details",
        "stage_name": "Personal Details & Scheme Form",
        "task": "Entering citizen identification and DBT bank credentials",
        "weight": 4
    },
    {
        "keywords": ["eligibility", "criteria", "guideline", "notice", "faq", "circular"],
        "stage": "guidelines",
        "stage_name": "Eligibility Criteria & Guidelines",
        "task": "Verifying scheme income limits and qualifying conditions",
        "weight": 3
    },
    {
        "keywords": ["search", "find", "home", "header", "menu", "nav", "banner"],
        "stage": "discovery",
        "stage_name": "Portal Discovery & Scheme Finding",
        "task": "Locating welfare schemes and navigating public portal directory",
        "weight": 2
    }
]

def map_citizen_journey(rule_id: str, target: str, snippet: str) -> Dict[str, Any]:
    context = f"{target} {snippet}".lower()
    matched = STAGE_PATTERNS[3] # default form details

    for pattern in STAGE_PATTERNS:
        if any(k in context for k in pattern["keywords"]):
            matched = pattern
            break

    # Persona & impact mapping
    if rule_id == "color-contrast":
        affected = "Citizen with low vision or cataract"
        impact = f"Text in {matched['stage_name']} stage cannot be read clearly."
        demographic = "low_vision"
    elif rule_id in ["tabindex", "file-upload-accessible"]:
        affected = "Motor-impaired citizen using keyboard Tab/Enter"
        impact = f"Cannot activate or complete {matched['stage_name']} controls without a mouse."
        demographic = "motor_impaired"
    elif rule_id == "captcha-accessible":
        affected = "Screen-reader user (blind citizen)"
        impact = "Total transaction blocker: Citizen cannot solve image CAPTCHA."
        demographic = "screen_reader"
    elif rule_id == "label":
        affected = "Screen-reader user"
        impact = "Field announced as blank unlabelled box, risking incorrect form data."
        demographic = "screen_reader"
    else:
        affected = "Citizen using assistive technology"
        impact = f"Friction in completing {matched['task']}."
        demographic = "screen_reader"

    return {
        "stage": matched["stage"],
        "stage_name": matched["stage_name"],
        "task": matched["task"],
        "affected_citizen": affected,
        "affected_demographic": demographic,
        "impact_description": impact,
        "task_weight": matched["weight"]
    }

def calculate_task_priority(impact: str, task_weight: int, rule_id: str) -> Tuple[str, int]:
    if rule_id == "captcha-accessible" or (task_weight >= 5 and impact in ["critical", "serious"]):
        return "critical", 20
    if task_weight >= 4 and impact in ["critical", "serious"]:
        return "high", 14
    if task_weight >= 3 or impact == "serious":
        return "medium", 8
    return "low", 4
