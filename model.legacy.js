/* Legacy non-module fallback for model.js
   Attaches `window.model.calculateRisk(...)` and helpers so the page works when ES modules aren't available. */
(function(global){
  function categorizeBMI(bmi) {
    if (bmi < 35) return 1;
    if (bmi < 45) return 2;
    if (bmi < 55) return 3;
    if (bmi < 65) return 4;
    return 5;
  }

  function categorizeAge(age) {
    if (age < 40) return 1;
    if (age < 50) return 2;
    if (age < 60) return 3;
    if (age < 70) return 4;
    return 5;
  }

  function stableLogistic(lp) {
    if (!Number.isFinite(lp)) return 0;
    if (lp >= 0) {
      var expNegLP = Math.exp(-lp);
      return 1 / (1 + expNegLP);
    } else {
      var expLP = Math.exp(lp);
      return expLP / (1 + expLP);
    }
  }

  function riskCategory(prob) {
    var category = 'Low Risk', categoryClass = 'risk-low';
    if (prob >= 0.008) { category = 'Very High Risk'; categoryClass = 'risk-very-high'; }
    else if (prob >= 0.004) { category = 'High Risk'; categoryClass = 'risk-high'; }
    else if (prob >= 0.002) { category = 'Moderate Risk'; categoryClass = 'risk-elevated'; }
    return {category: category, categoryClass: categoryClass};
  }

  function calculateRisk(inputs, coefficients) {
    if (!coefficients) throw new Error('Coefficients are required');
    var terms = [];
    var lp = Number(coefficients._cons) || 0;
    terms.push('Intercept: ' + ((Number(coefficients._cons) || 0).toFixed(6)));

    var age = inputs.age, bmi = inputs.bmi, sex = inputs.sex, asa = inputs.asa, procedure = inputs.procedure,
        orTime = inputs.orTime, los = inputs.los, history_dvt = inputs.history_dvt, history_pe = inputs.history_pe,
        immunosuppression = inputs.immunosuppression, conversion = inputs.conversion, transfusion = inputs.transfusion,
        unplanned_icu = inputs.unplanned_icu, pneumonia = inputs.pneumonia;

    age = Number.isFinite(age) ? Math.min(Math.max(age, 18), 120) : 18;
    bmi = Number.isFinite(bmi) ? Math.max(bmi, 0) : 0;

    var ageCat = categorizeAge(age);
    var ageKey = ageCat + '.age_cat';
    if (Object.prototype.hasOwnProperty.call(coefficients, ageKey)) { lp += coefficients[ageKey]; terms.push('Age cat ' + ageCat + ': +' + coefficients[ageKey].toFixed(6)); }
    else { terms.push('Age cat ' + ageCat + ': Reference (0)'); }

    var bmiCat = categorizeBMI(bmi);
    var bmiKey = bmiCat + '.bmi_cat';
    if (Object.prototype.hasOwnProperty.call(coefficients, bmiKey)) { lp += coefficients[bmiKey]; terms.push('BMI cat ' + bmiCat + ': +' + coefficients[bmiKey].toFixed(6)); }
    else { terms.push('BMI cat ' + bmiCat + ': Reference (0)'); }

    if (sex === 'F') {
      if (Object.prototype.hasOwnProperty.call(coefficients, '2.sex2')) { lp += coefficients['2.sex2']; terms.push('Sex (Female): +' + coefficients['2.sex2'].toFixed(6)); }
      else { terms.push('Sex (Female): Coefficient missing'); }
    } else { terms.push('Sex (Male): Reference (0)'); }

    var asaKey = asa + '.asa2';
    if (Object.prototype.hasOwnProperty.call(coefficients, asaKey)) { lp += coefficients[asaKey]; terms.push('ASA ' + asa + ': +' + coefficients[asaKey].toFixed(6)); }
    else { terms.push('ASA ' + asa + ': Reference (0)'); }

    var procedureCat = 1; if (procedure === 'rygb') procedureCat = 2; if (procedure === 'ds_sadi') procedureCat = 3;
    var procKey = procedureCat + '.final_anatomy_cat';
    if (Object.prototype.hasOwnProperty.call(coefficients, procKey)) { lp += coefficients[procKey]; terms.push('Procedure cat ' + procedureCat + ': +' + coefficients[procKey].toFixed(6)); }
    else { terms.push('Procedure cat ' + procedureCat + ': Reference (0)'); }

    var orKey = orTime + '.or_cat';
    if (Object.prototype.hasOwnProperty.call(coefficients, orKey)) { lp += coefficients[orKey]; terms.push('OR Time cat ' + orTime + ': +' + coefficients[orKey].toFixed(6)); }
    else { terms.push('OR Time cat ' + orTime + ': Reference (0)'); }

    var losKey = los + '.los_cat';
    if (Object.prototype.hasOwnProperty.call(coefficients, losKey)) { lp += coefficients[losKey]; terms.push('LOS cat ' + los + ': +' + coefficients[losKey].toFixed(6)); }
    else { terms.push('LOS cat ' + los + ': Reference (0)'); }

    if (history_dvt && Object.prototype.hasOwnProperty.call(coefficients, '2.HISTORY_DVT_cat')) { lp += coefficients['2.HISTORY_DVT_cat']; terms.push('History DVT: +' + coefficients['2.HISTORY_DVT_cat'].toFixed(6)); }
    if (history_pe && Object.prototype.hasOwnProperty.call(coefficients, '2.HISTORY_PE_cat')) { lp += coefficients['2.HISTORY_PE_cat']; terms.push('History PE: +' + coefficients['2.HISTORY_PE_cat'].toFixed(6)); }
    if (immunosuppression && Object.prototype.hasOwnProperty.call(coefficients, 'immu_b')) { lp += coefficients.immu_b; terms.push('Immunosuppression: +' + coefficients.immu_b.toFixed(6)); }
    if (conversion && Object.prototype.hasOwnProperty.call(coefficients, '1.conversion_case')) { lp += coefficients['1.conversion_case']; terms.push('Conversion: +' + coefficients['1.conversion_case'].toFixed(6)); }
    if (transfusion && Object.prototype.hasOwnProperty.call(coefficients, '1.transf_inhosp')) { lp += coefficients['1.transf_inhosp']; terms.push('Transfusion: +' + coefficients['1.transf_inhosp'].toFixed(6)); }
    if (unplanned_icu && Object.prototype.hasOwnProperty.call(coefficients, '1.icu_inhosp')) { lp += coefficients['1.icu_inhosp']; terms.push('Unplanned ICU: +' + coefficients['1.icu_inhosp'].toFixed(6)); }
    if (pneumonia && Object.prototype.hasOwnProperty.call(coefficients, '1.pna_inhosp')) { lp += coefficients['1.pna_inhosp']; terms.push('Pneumonia: +' + coefficients['1.pna_inhosp'].toFixed(6)); }

    var prob = stableLogistic(lp);
    var percentage = Number.isFinite(prob) ? (prob * 100) : NaN;
    var cat = riskCategory(prob);
    var oneInNText = 'N/A', per1000 = 'N/A';
    if (prob > 0 && Number.isFinite(prob)) { var oneInN = Math.round(1 / prob); oneInNText = oneInN.toLocaleString(); per1000 = Math.round(prob * 1000); }

    return { lp: lp, prob: prob, percentage: percentage, category: cat.category, categoryClass: cat.categoryClass, terms: terms,
             ageCat: ageCat, bmiCat: bmiCat, age: age, bmi: bmi, orTime: orTime, los: los, oneInNText: oneInNText, per1000: per1000,
             outcome: coefficients.outcome || 'PE' };
  }

  global.model = global.model || {};
  global.model.categorizeBMI = categorizeBMI;
  global.model.categorizeAge = categorizeAge;
  global.model.stableLogistic = stableLogistic;
  global.model.calculateRisk = calculateRisk;

})(window);
