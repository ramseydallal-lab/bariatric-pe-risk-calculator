import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import { calculateRisk, categorizeAge, categorizeBMI, riskCategory } from '../model.js';

const peCoeffs = JSON.parse(fs.readFileSync(new URL('../coefficients.json', import.meta.url)));
const vteCoeffs = JSON.parse(fs.readFileSync(new URL('../vte_coefficients.json', import.meta.url)));

describe('updated PE and secondary VTE model', () => {
  it('uses the revised discharge categories', () => {
    assert.equal(categorizeAge(39), 1);
    assert.equal(categorizeAge(40), 2);
    assert.equal(categorizeAge(70), 5);
    assert.equal(categorizeBMI(34.9), 1);
    assert.equal(categorizeBMI(35), 2);
    assert.equal(categorizeBMI(65), 5);
  });

  it('keeps PE thresholds aligned with the revised manuscript calculator', () => {
    assert.equal(riskCategory(0.0019).category, 'Low Risk');
    assert.equal(riskCategory(0.002).category, 'Moderate Risk');
    assert.equal(riskCategory(0.004).category, 'High Risk');
    assert.equal(riskCategory(0.008).category, 'Very High Risk');
  });

  it('returns a secondary VTE risk that exceeds PE-only baseline risk', () => {
    const baselineInputs = {
      age: 45,
      bmi: 40,
      sex: 'F',
      asa: 1,
      procedure: 'sleeve',
      orTime: 2,
      los: 0,
      history_dvt: false,
      history_pe: false,
      immunosuppression: false,
      conversion: false,
      transfusion: false,
      unplanned_icu: false,
      pneumonia: false
    };

    const pe = calculateRisk(baselineInputs, peCoeffs);
    const vte = calculateRisk(baselineInputs, vteCoeffs);

    assert.ok(pe.prob > 0 && pe.prob < 0.01);
    assert.ok(vte.prob > pe.prob);
    assert.equal(vte.outcome, 'VTE');
  });
});
