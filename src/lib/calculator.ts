/**
 * Financial and property utility functions for luxury real estate in India (Tamil Nadu focus).
 */

export function calculateEmi(principal: number, annualInterestRatePercent: number, tenureYears: number): number {
  if (principal <= 0 || annualInterestRatePercent <= 0 || tenureYears <= 0) {
    return 0;
  }
  const monthlyRate = annualInterestRatePercent / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi);
}

/**
 * Calculates Tamil Nadu estimated statutory acquisition costs:
 * Stamp Duty: 7%
 * Registration: 2%
 * Legal & Documentation: ~₹50,000 or 0.2%
 */
export function calculateTamilNaduRegistrationCosts(propertyValue: number): {
  stampDuty: number;
  registrationCharge: number;
  legalAndDocumentation: number;
  totalStatutoryCost: number;
  effectiveTotalOutlay: number;
} {
  const stampDuty = Math.round(propertyValue * 0.07);
  const registrationCharge = Math.round(propertyValue * 0.02);
  const legalAndDocumentation = Math.max(35000, Math.round(propertyValue * 0.002));
  const totalStatutoryCost = stampDuty + registrationCharge + legalAndDocumentation;
  const effectiveTotalOutlay = propertyValue + totalStatutoryCost;

  return {
    stampDuty,
    registrationCharge,
    legalAndDocumentation,
    totalStatutoryCost,
    effectiveTotalOutlay,
  };
}

/**
 * Format Indian Currency with Lakh / Crore notations
 */
export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    const formatted = cr % 1 === 0 ? cr.toString() : parseFloat(cr.toFixed(2)).toString();
    return `₹${formatted} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toString() : parseFloat(lakh.toFixed(2)).toString();
    return `₹${formatted} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parses user input queries like "80 lakh", "1.5 cr", "80L", "2 crore" into INR numbers.
 */
export function parseCurrencyQuery(text: string): number | null {
  const clean = text.toLowerCase().replace(/,/g, '');
  
  // Crore match: e.g. "2.5 cr", "2.5 crore", "1cr"
  const crMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/);
  if (crMatch) {
    return parseFloat(crMatch[1]) * 10000000;
  }

  // Lakh match: e.g. "80 lakh", "75 lakhs", "90 l", "85lac"
  const lakhMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l\b)/);
  if (lakhMatch) {
    return parseFloat(lakhMatch[1]) * 100000;
  }

  // Bare number match if > 100000
  const numMatch = clean.match(/\b(\d{6,10})\b/);
  if (numMatch) {
    return parseInt(numMatch[1], 10);
  }

  return null;
}
