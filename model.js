// model.js - canonical ES module for PE risk calculation
export function categorizeBMI(bmi) {
  if (bmi < 30) return 1;
  if (bmi < 40) return 2;
  if (bmi < 50) return 3;
  if (bmi < 60) return 4;
  if (bmi < 70) return 5;
  return 6;
}

export function categorizeAge(age) {
  if (age < 30) return 1;
  if (age < 40) return 2;
  if (age < 50) return 3;
  if (age < 60) return 4;
  if (age < 70) return 5;
  return 6;
}

export function stableLogistic(lp) {
  if (!Number.isFinite(lp)) return 0;
  if (lp >= 0) {
    const expNegLP = Math.exp(-lp);
    return 1 / (1 + expNegLP);
  } else {
    const expLP = Math.exp(lp);
    return expLP / (1 + expLP);
  }
}

export function riskCategory(prob) {
  let category = 'Low Risk';
  let categoryClass = 'risk-low';
  if (prob >= 0.006) {
    category = 'Very High Risk';
    categoryClass = 'risk-very-high';
  } else if (prob >= 0.003) {
    category = 'High Risk';
    categoryClass = 'risk-high';
  } else if (prob >= 0.001) {
    category = 'Elevated Risk';
    categoryClass = 'risk-elevated';
  }
  return { category, categoryClass };
}

export function calculateRisk(inputs, coefficients) {
  if (!coefficients) throw new Error('Coefficients are required');

  const terms = [];
  const cons = Number(coefficients._cons) || 0;
  let lp = cons;
  terms.push(`Intercept: ${cons.toFixed(6)}`);

  let {
    age,
    bmi,
    sex,
    asa,
    procedure,
    orTime,
    los,
    history_dvt,
    history_pe,
    immunosuppression,
    conversion,
    transfusion,
    unplanned_icu,
    pneumonia
  } = inputs;

  age = Number.isFinite(age) ? Math.min(Math.max(age, 18), 120) : 18;
  bmi = Number.isFinite(bmi) ? Math.max(bmi, 0) : 0;

  const ageCat = categorizeAge(age);
  const ageKey = `${ageCat}.age_cat`;
  if (Object.prototype.hasOwnProperty.call(coefficients, ageKey)) {
    lp += Number(coefficients[ageKey]);
    terms.push(`Age cat ${ageCat}: +${Number(coefficients[ageKey]).toFixed(6)}`);
  } else {
    terms.push(`Age cat ${ageCat}: Reference (0)`);
  }

  const bmiCat = categorizeBMI(bmi);
  const bmiKey = `${bmiCat}.bmi_cat`;
  if (Object.prototype.hasOwnProperty.call(coefficients, bmiKey)) {
    lp += Number(coefficients[bmiKey]);
    terms.push(`BMI cat ${bmiCat}: +${Number(coefficients[bmiKey]).toFixed(6)}`);
  } else {
    terms.push(`BMI cat ${bmiCat}: Reference (0)`);
  }

  // Sex (Female coded)
  if (sex === 'F') {
    if (Object.prototype.hasOwnProperty.call(coefficients, '2.sex2')) {
      lp += Number(coefficients['2.sex2']);
      terms.push(`Sex (Female): +${Number(coefficients['2.sex2']).toFixed(6)}`);
    } else {
      terms.push(`Sex (Female): Coefficient missing`);
    }
  } else {
    terms.push(`Sex (Male): Reference (0)`);
  }

  // ASA
  const asaKey = `${asa}.asa2`;
  if (Object.prototype.hasOwnProperty.call(coefficients, asaKey)) {
    lp += Number(coefficients[asaKey]);
    terms.push(`ASA ${asa}: +${Number(coefficients[asaKey]).toFixed(6)}`);
  } else {
    terms.push(`ASA ${asa}: Reference (0)`);
  }

  // Procedure mapping
  let procedureCat = 1;
  if (procedure === 'rygb') procedureCat = 2;
  if (procedure === 'ds_sadi') procedureCat = 3;
  const procKey = `${procedureCat}.final_anatomy_cat`;
  if (Object.prototype.hasOwnProperty.call(coefficients, procKey)) {
    lp += Number(coefficients[procKey]);
    terms.push(`Procedure cat ${procedureCat}: +${Number(coefficients[procKey]).toFixed(6)}`);
  } else {
    terms.push(`Procedure cat ${procedureCat}: Reference (0)`);
  }

  // OR Time
  const orKey = `${orTime}.or_cat`;
  if (Object.prototype.hasOwnProperty.call(coefficients, orKey)) {
    lp += Number(coefficients[orKey]);
    terms.push(`OR Time cat ${orTime}: +${Number(coefficients[orKey]).toFixed(6)}`);
  } else {
    terms.push(`OR Time cat ${orTime}: Reference (0)`);
  }

  // LOS
  const losKey = `${los}.los_cat`;
  if (Object.prototype.hasOwnProperty.call(coefficients, losKey)) {
    lp += Number(coefficients[losKey]);
    terms.push(`LOS cat ${los}: +${Number(coefficients[losKey]).toFixed(6)}`);
  } else {
    terms.push(`LOS cat ${los}: Reference (0)`);
  }

  // Binary variables
  if (history_dvt && Object.prototype.hasOwnProperty.call(coefficients, '2.HISTORY_DVT_cat')) {
    lp += Number(coefficients['2.HISTORY_DVT_cat']);
    terms.push(`History DVT: +${Number(coefficients['2.HISTORY_DVT_cat']).toFixed(6)}`);
  }
  if (history_pe && Object.prototype.hasOwnProperty.call(coefficients, '2.HISTORY_PE_cat')) {
    lp += Number(coefficients['2.HISTORY_PE_cat']);
    terms.push(`History PE: +${Number(coefficients['2.HISTORY_PE_cat']).toFixed(6)}`);
  }
  if (immunosuppression && Object.prototype.hasOwnProperty.call(coefficients, 'immu_b')) {
    lp += Number(coefficients.immu_b);
    terms.push(`Immunosuppression: +${Number(coefficients.immu_b).toFixed(6)}`);
  }
  if (conversion && Object.prototype.hasOwnProperty.call(coefficients, '1.conversion_case')) {
    lp += Number(coefficients['1.conversion_case']);
    terms.push(`Conversion: +${Number(coefficients['1.conversion_case']).toFixed(6)}`);
  }
  if (transfusion && Object.prototype.hasOwnProperty.call(coefficients, '1.transf_inhosp')) {
    lp += Number(coefficients['1.transf_inhosp']);
    terms.push(`Transfusion: +${Number(coefficients['1.transf_inhosp']).toFixed(6)}`);
  }
  if (unplanned_icu && Object.prototype.hasOwnProperty.call(coefficients, '1.icu_inhosp')) {
    lp += Number(coefficients['1.icu_inhosp']);
    terms.push(`Unplanned ICU: +${Number(coefficients['1.icu_inhosp']).toFixed(6)}`);
  }
  if (pneumonia && Object.prototype.hasOwnProperty.call(coefficients, '1.pna_inhosp')) {
    lp += Number(coefficients['1.pna_inhosp']);
    terms.push(`Pneumonia: +${Number(coefficients['1.pna_inhosp']).toFixed(6)}`);
  }

  const prob = stableLogistic(lp);
  const percentage = Number.isFinite(prob) ? (prob * 100) : NaN;
  const { category, categoryClass } = riskCategory(prob);

  let oneInNText = 'N/A';
  let per1000 = 'N/A';
  if (prob > 0 && Number.isFinite(prob)) {
    const oneInN = Math.round(1 / prob);
    oneInNText = oneInN.toLocaleString();
    per1000 = Math.round(prob * 1000);
  }

  return {
    lp, prob, percentage, category, categoryClass, terms,
    ageCat, bmiCat, age, bmi, orTime, los, oneInNText, per1000
  };
}

// For non-module environments attach to window as well
if (typeof window !== 'undefined') {
  window.model = window.model || {};
  window.model.categorizeBMI = categorizeBMI;
  window.model.categorizeAge = categorizeAge;
  window.model.stableLogistic = stableLogistic;
  window.model.riskCategory = riskCategory;
  window.model.calculateRisk = calculateRisk;
}
