import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateRisk } from '../model.js';
import fs from 'node:fs';

const coeffs = JSON.parse(fs.readFileSync(new URL('../coefficients.json', import.meta.url)));

describe('model.calculateRisk', () => {
  it('returns expected shape and handles typical inputs', () => {
    const inputs = {
      age: 55,
      bmi: 42,
      sex: 'F',
      asa: 3,
      procedure: 'rygb',
      orTime: 2,
      los: 2,
      history_dvt: false,
      history_pe: false,
      immunosuppression: false,
      conversion: false,
      transfusion: false,
      unplanned_icu: false,
      pneumonia: false
    };

    const result = calculateRisk(inputs, coeffs);
    assert.ok(result && typeof result.prob === 'number');
    assert.ok(result.terms && Array.isArray(result.terms));
  });

  it('handles edge cases (extreme BMI and age)', () => {
    const inputs = {
      age: 120,
      bmi: 200,
      sex: 'M',
      asa: 3,
      procedure: 'sleeve',
      orTime: 1,
      los: 0,
      history_dvt: true,
      history_pe: true,
      immunosuppression: true,
      conversion: true,
      transfusion: true,
      unplanned_icu: true,
      pneumonia: true
    };

    const result = calculateRisk(inputs, coeffs);
    assert.ok(Number.isFinite(result.lp));
    assert.ok(result.prob >= 0 && result.prob <= 1);
  });
});
