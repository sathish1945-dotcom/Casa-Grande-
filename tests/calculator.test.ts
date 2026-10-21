import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEmi,
  calculateTamilNaduRegistrationCosts,
  formatIndianCurrency,
  parseCurrencyQuery,
} from '../src/lib/calculator';

test('calculateEmi returns accurate monthly installment', () => {
  // ₹50 Lakh loan at 8.5% for 20 years
  const emi = calculateEmi(5000000, 8.5, 20);
  // Expected EMI is around ₹43,391
  assert.ok(emi > 43000 && emi < 44000, `Expected ~43391, got ${emi}`);
});

test('calculateEmi handles zero and edge cases', () => {
  assert.equal(calculateEmi(0, 8.5, 20), 0);
  assert.equal(calculateEmi(5000000, 0, 20), 0);
  assert.equal(calculateEmi(5000000, 8.5, 0), 0);
});

test('calculateTamilNaduRegistrationCosts calculates 7% stamp and 2% registration', () => {
  const result = calculateTamilNaduRegistrationCosts(10000000); // ₹1 Crore
  assert.equal(result.stampDuty, 700000); // 7%
  assert.equal(result.registrationCharge, 200000); // 2%
  assert.ok(result.totalStatutoryCost >= 900000);
  assert.equal(result.effectiveTotalOutlay, 10000000 + result.totalStatutoryCost);
});

test('formatIndianCurrency formats Lakhs and Crores properly', () => {
  assert.equal(formatIndianCurrency(7800000), '₹78 Lakh');
  assert.equal(formatIndianCurrency(14500000), '₹1.45 Cr');
  assert.equal(formatIndianCurrency(65000000), '₹6.5 Cr');
});

test('parseCurrencyQuery extracts numbers accurately from queries', () => {
  assert.equal(parseCurrencyQuery('under 80 lakh'), 8000000);
  assert.equal(parseCurrencyQuery('budget of 1.5 cr'), 15000000);
  assert.equal(parseCurrencyQuery('2 crore'), 20000000);
  assert.equal(parseCurrencyQuery('around 90 lakhs'), 9000000);
});
