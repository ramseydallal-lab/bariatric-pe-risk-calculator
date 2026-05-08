# Bariatric PE Risk Calculator

Public informational calculator for 30-day post-discharge pulmonary embolism risk after minimally invasive bariatric surgery, with a secondary VTE estimate and event-triggered reassessment guidance for emergency visits and major complications.

## What is included

- Jefferson-branded static web interface
- Discharge PE risk calculator
- Secondary VTE estimate, defined as PE or DVT requiring therapy
- ED visit reassessment guidance
- Major complication reassessment guidance
- Local coefficient file and browser-side calculation logic
- No-op service worker files so the site does not cache user-entered values for offline use

## Public-site security posture

This repository is configured for a public informational deployment model.

- Do not enter direct patient identifiers
- No authentication is required
- No analytics, trackers, or ad scripts should be added
- No free-text patient note fields should be added
- Calculator inputs should not be logged at the web server, CDN, or analytics layer
- Coefficients are fetched with `cache: 'no-store'`
- The site includes CSP, referrer policy, permissions policy, and no-store cache directives
- Service workers are intentionally reduced to no-op behavior

Recommended host-level response headers:

- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`
- `Referrer-Policy: no-referrer`

## Local use

Open `index.html` in a modern browser, or serve the folder as a static site.

## Files

- `index.html`: main calculator UI
- `model.js`: risk calculation logic
- `coefficients.json`: primary PE model coefficients
- `vte_coefficients.json`: secondary VTE model coefficients
- `manifest.json`: web app metadata
- `sw.js`: no-op service worker
- `assets/brand`: Jefferson brand assets used by the UI

## Test

```bash
npm test
```
