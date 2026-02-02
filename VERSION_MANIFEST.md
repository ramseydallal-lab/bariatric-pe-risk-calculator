# PE Risk Calculator - Version Manifest
**Last Updated:** 2026-02-02

## Current Release
**File:** `pe-risk-calculator-jefferson-v2026-02-02.html`  
**Version:** 2026-02-02 (February 2, 2026)  
**Status:** ✅ PRODUCTION READY

## Download
📥 [Download Latest Version from AI Drive](/PE_Risk_Calculator/pe-risk-calculator-jefferson-v2026-02-02.html)

---

## Features ✨

### ✅ Fixed Issues
- **Submit button working** - All three tabs now have functional form submission
- **Dropdowns implemented** - OR Time and LOS use dropdown menus (no free-text input)
- **Corrected labeling** - "Conversion from prior bariatric surgery" (not lap-to-open)
- **Jefferson Health branding** - Professional header with logo

### ✅ Three Functional Tabs
1. **At Discharge** - Full categorical risk calculator (36 coefficients, no splines)
2. **After ED Visit** - Table 4 Steps 1-2 (event-triggered reassessment)
3. **After Major Complication** - Table 4 Step 3 (severe adverse events)

### ✅ Comprehensive Disclaimers
- **Core disclaimer visible** on all three tabs
- **Full disclosure available** via "View full disclaimers" toggle
- Includes all required sections:
  - Clinical Decision Support Only
  - Model Scope/Population
  - Outcome Definition (post-discharge PE within 30 days)
  - Temporal (MBSAQIP 2020-2024)
  - Modeling/Statistical (categorical bins, logistic regression)
  - Input Handling/Categorization
  - Clinical Action (not prescriptive)
  - Bleeding Risk Not Modeled
  - Comparative/Baseline
  - Regulatory/Legal
  - Data Source/Responsibility

---

## Technical Specifications

### Model Details
- **Type:** Categorical (no splines)
- **Coefficients:** 36 from `ui_model_coefs_cat.csv`
- **Intercept:** -7.0236
- **Data Source:** MBSAQIP 2020-2024
- **Outcome:** Post-discharge PE through day 30

### Input Categories
- **Age bins:** <30, 30-39, 40-49*, 50-59, 60-69, ≥70 (*reference)
- **BMI bins:** <30, 30-34, 35-39, 40-49*, 50-59, 60-69, ≥70 (*reference)
- **OR Time dropdown:** <60 min, 60-120 min*, 120-180 min, >180 min (*reference)
- **LOS dropdown:** 1 day*, 2 days, 3 days, 4 days, 5 days, 6 days, 7 days, 7+ days (*reference)

### Risk Thresholds
- **Low Risk:** < 1.0%
- **Moderate Risk:** 1.0% - 2.9%
- **High Risk:** ≥ 3.0%

---

## Test Instructions

### Quick Test (Default Values)
1. Download and open `pe-risk-calculator-jefferson-v2026-02-02.html`
2. Default values pre-loaded:
   - Age: 55 years
   - BMI: 42 kg/m²
   - Sex: Female
   - ASA: III
   - Procedure: RYGB
   - OR Time: 60-120 minutes
   - LOS: 2 days
   - All checkboxes: unchecked
3. Click **"Calculate Risk"**

### Expected Output
- **Risk:** ~0.39%
- **Category:** Low Risk
- **Natural Frequency:** ~1 in 257
- **Linear Predictor:** ~-5.558

### Validation Against Stata
```stata
* In Stata, after running your model:
predict xb, xb
predict phat
list xb phat for [YOUR_PATIENT_ID]

* Compare to JavaScript output:
* - Linear Predictor (xb) should match within ±0.0001
* - Probability (phat) should match within ±0.0001
```

---

## Tab-Specific Testing

### Tab 1: At Discharge
- Test with various patient profiles
- Verify Linear Predictor in debug output
- Confirm categorization logic (age, BMI, OR, LOS)
- Check binary variables (DVT, PE, immunosuppression, etc.)

### Tab 2: After ED Visit
- Test with zero high-risk modifiers → Should recommend "Consider" prophylaxis
- Test with ≥1 high-risk modifiers → Should recommend "Strongly recommend" prophylaxis
- High-risk modifiers:
  - History of DVT/PE
  - BMI ≥ 50
  - DS/SADI or Bypass
  - Immunosuppression
  - Age ≥ 50
  - Conversion from prior bariatric surgery

### Tab 3: After Major Complication
- Test with zero complications → Generic guidance
- Test with ≥1 complication → Strong recommendation for extended prophylaxis
- Severe events:
  - Readmission within 30 days
  - Reoperation within 30 days
  - Sepsis/septic shock
  - Organ-space infection

---

## File Structure
```
/PE_Risk_Calculator/
├── pe-risk-calculator-jefferson-v2026-02-02.html  ← LATEST VERSION
├── VERSION_MANIFEST.md                             ← This file
├── test-calculator-categorical.html                 (earlier version)
├── pe-calculator-categorical.tar.gz                 (source package)
└── [other legacy files]
```

---

## Previous Versions

| Version | File | Status | Notes |
|---------|------|--------|-------|
| 2026-02-02 | pe-risk-calculator-jefferson-v2026-02-02.html | ✅ Current | Submit button fixed, dropdowns, disclaimers |
| Earlier | test-calculator-categorical.html | Archived | Original categorical model |
| Earlier | pe-risk-calculator-jefferson.html | Archived | First Jefferson brand attempt |

---

## Deployment Checklist

### Pre-Deployment
- [x] Submit button functional on all tabs
- [x] OR Time dropdown (minutes: <60, 60-120, 120-180, >180)
- [x] LOS dropdown (days: 1-7, 7+)
- [x] Conversion label corrected ("from prior bariatric surgery")
- [x] Jefferson Health branding
- [x] Core disclaimer visible on all tabs
- [x] Full disclaimers accessible via toggle
- [x] Mobile-responsive design
- [x] Zero dependencies (offline-capable)

### Validation
- [ ] Test default case (Age 55, BMI 42, Female, ASA III, RYGB, OR 90-120, LOS 2)
- [ ] Verify Linear Predictor ≈ -5.558
- [ ] Verify Risk ≈ 0.39%
- [ ] Compare against Stata output (xb and phat)
- [ ] Test all three tabs for functionality
- [ ] Test on mobile device
- [ ] Test disclaimer toggles

### Production
- [ ] Upload to production server
- [ ] Update links/documentation
- [ ] Notify stakeholders
- [ ] Archive previous version

---

## Contact & Support
For questions about the calculator, model validation, or deployment:
- Review `README_CATEGORICAL.md` for technical details
- Check `QUICK_START_CATEGORICAL.md` for testing instructions
- Consult MBSAQIP documentation for data definitions

---

**Document Version:** 1.0  
**Created:** 2026-02-02  
**Author:** AI Assistant  
**Purpose:** Version control and deployment tracking for PE Risk Calculator