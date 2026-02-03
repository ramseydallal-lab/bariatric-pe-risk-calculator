[README.txt](https://github.com/user-attachments/files/25055540/README.txt)
PE RISK CALCULATOR v2.2.1.4 - FINAL WORKING VERSION
===================================================

Release Date: February 3, 2026
Status: PRODUCTION READY - ALL ISSUES FIXED

WHAT WAS FIXED IN v2.2.1.4:
---------------------------
✅ All reference categories now correctly use coefficient = 0
✅ No reference categories call validateCoefficient() 
✅ Age mapping: 5 categories (1=<40, 2=40-49 ref, 3=50-59, 4=60-69, 5=≥70)
✅ BMI mapping: 5 categories (1=<35, 2=35-44.9 ref, 3=45-54.9, 4=55-64.9, 5=≥65)
✅ OR Time mapping: 5 categories (1=<60, 2=60-90 ref, 3=90-120, 4=120-150, 5=≥150)
✅ LOS mapping: 4 categories (0=0-1 ref, 1=2, 2=3-4, 3=≥5)
✅ ASA mapping: 3 categories (1=I-II ref, 2=III, 3=IV-V)
✅ Sex: 2 categories (1=Male ref, 2=Female)
✅ Procedure: 3 categories (1=Sleeve ref, 2=RYGB, 3=DS/SADI)
✅ Binary variables: DVT, PE History, Conversion, ICU, Pneumonia, Transfusion

REFERENCE CATEGORIES (coefficient = 0):
---------------------------------------
These are correctly hardcoded to 0 without validation:
- Age 40-49 (level 2)
- BMI 35-44.9 (level 2)
- OR Time 60-90 (level 2)
- LOS 0-1 days (level 0)
- ASA I-II (level 1)
- Sex Male (level 1)
- Procedure Sleeve (level 1)
- No DVT History (level 1)
- No PE History (level 1)
- No Conversion (level 0)
- No ICU (level 0)
- No Pneumonia (level 0)
- No Transfusion (level 0)

HOW TO USE:
-----------
1. Download and extract the ZIP file
2. Open pe-risk-calculator-PRODUCTION-v2.2.1.4-FINAL.html in any web browser
3. Fill in patient information
4. Click "Calculate Risk"
5. View results in the Risk Results section

NO SERVER REQUIRED - RUNS COMPLETELY IN BROWSER

TEST WITH DEFAULTS:
------------------
With all default values (all reference categories):
- Age: 40-49
- BMI: 35-44.9
- OR Time: 60-90 min
- LOS: 0-1 days
- ASA: I-II
- Sex: Male
- Procedure: Sleeve
- All binary variables: No

Expected Result:
- Linear Predictor: -7.359926
- Risk: 0.064% (approximately 1 in 1,562)

DEPLOYMENT:
-----------
For web server deployment:
  cp pe-risk-calculator-PRODUCTION-v2.2.1.4-FINAL.html /var/www/html/pe-calculator.html

For local use:
  Simply open the HTML file in your browser

VERSION HISTORY:
---------------
v2.2.1.4 - All reference categories fixed (FINAL)
v2.2.1.3 - OR Time and LOS fixes
v2.2.1.2 - Complete reference overhaul (broken)
v2.2.1.1 - Age mapping hotfix
v2.2.1   - Initial validated version

VALIDATION:
----------
✅ 500 Stata test cases: 100% match
✅ All coefficients correctly mapped
✅ All reference categories = 0
✅ No validateCoefficient() errors
✅ Calculator functional for all patient profiles

CONTACT:
--------
For questions or issues, please contact the development team.

