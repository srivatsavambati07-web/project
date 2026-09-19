"""
AccessGov - Playwright + Chromium + axe-core Automation Runner
Automates browser evaluation on real .gov.in / .nic.in URLs.
"""

import asyncio
from typing import Dict, Any, List
try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None

AXE_CDN_SCRIPT = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js"

async def run_axe_scan(url: str) -> Dict[str, Any]:
    """
    Launches headless Chromium, navigates to target Indian Government URL,
    injects axe-core, and extracts WCAG 2.1/2.2 violations.
    """
    if not async_playwright:
        raise RuntimeError("Playwright is not installed. Run: pip install playwright && playwright install chromium")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AccessGov-AuditEngine/1.0"
        )
        page = await context.new_page()

        try:
            # Navigate with 25s timeout
            await page.goto(url, wait_until="domcontentloaded", timeout=25000)
            
            # Inject axe-core
            await page.add_script_tag(url=AXE_CDN_SCRIPT)
            
            # Execute axe.run()
            axe_results = await page.evaluate("""
                async () => {
                    return await axe.run(document, {
                        runOnly: {
                            type: 'tag',
                            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
                        }
                    });
                }
            """)
            
            # Capture viewport screenshot for DOM evidence
            screenshot_bytes = await page.screenshot(type="jpeg", quality=60)

            await browser.close()
            return {
                "axe_results": axe_results,
                "screenshot": screenshot_bytes
            }
        except Exception as e:
            await browser.close()
            raise e
