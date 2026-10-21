import React, { useState } from 'react';
import {
  Calculator,
  IndianRupee,
  Clock,
  Percent,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import {
  calculateEmi,
  calculateTamilNaduRegistrationCosts,
  formatIndianCurrency,
} from '../lib/calculator';

interface EmiCalculatorSectionProps {
  onOpenSiteVisit: () => void;
}

export const EmiCalculatorSection: React.FC<EmiCalculatorSectionProps> = ({
  onOpenSiteVisit,
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(15000000); // ₹1.5 Cr
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // 20%
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  const downPaymentAmount = Math.round(propertyPrice * (downPaymentPercent / 100));
  const principalLoan = propertyPrice - downPaymentAmount;
  const monthlyEmi = calculateEmi(principalLoan, interestRate, tenureYears);
  const totalLoanRepayment = monthlyEmi * tenureYears * 12;
  const totalInterest = Math.max(0, totalLoanRepayment - principalLoan);

  // Tamil Nadu statutory acquisition costs
  const statutory = calculateTamilNaduRegistrationCosts(propertyPrice);

  return (
    <section id="calculator-section" className="py-20 bg-[#F4EFE6] border-t border-[#E5DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9C7A4A] block mb-2">
            Acquisition Financial Planning
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2818] tracking-tight">
            Mortgage EMI & Tamil Nadu Stamp Duty Calculator
          </h2>
          <p className="text-sm text-[#55615B] mt-2">
            Calculate your estimated monthly commitments and statutory government registration charges for luxury residences.
          </p>
        </div>

        {/* Two-Column Interactive Financial Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders Console Left */}
          <div className="lg:col-span-7 bg-[#FFFFFF] p-6 sm:p-8 rounded border border-[#DDD6C8] shadow-xs space-y-6">
            
            {/* Property Value Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="property-val-slider" className="text-xs font-semibold uppercase tracking-wider text-[#7A8680]">
                  Property Value (Indicative)
                </label>
                <span className="font-serif text-xl font-bold text-[#0D2818]">
                  {formatIndianCurrency(propertyPrice)}
                </span>
              </div>
              <input
                id="property-val-slider"
                aria-label="Property Value Indicative"
                type="range"
                min={7500000}
                max={120000000}
                step={2500000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full accent-[#C5A880] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8C9690] mt-1">
                <span>₹75 Lakh</span>
                <span>₹5.0 Cr</span>
                <span>₹12.0 Cr</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="down-payment-slider" className="text-xs font-semibold uppercase tracking-wider text-[#7A8680]">
                  Down Payment ({downPaymentPercent}%)
                </label>
                <span className="text-sm font-bold text-[#0D2818]">
                  {formatIndianCurrency(downPaymentAmount)}
                </span>
              </div>
              <input
                id="down-payment-slider"
                aria-label="Down Payment Percentage"
                type="range"
                min={10}
                max={50}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#C5A880] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8C9690] mt-1">
                <span>10%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Loan Tenure & Interest Rate Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="tenure-slider" className="text-xs font-semibold uppercase tracking-wider text-[#7A8680]">
                    Tenure (Years)
                  </label>
                  <span className="text-sm font-bold text-[#0D2818]">{tenureYears} Years</span>
                </div>
                <input
                  id="tenure-slider"
                  aria-label="Loan Tenure in Years"
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="interest-slider" className="text-xs font-semibold uppercase tracking-wider text-[#7A8680]">
                    Interest Rate (% p.a.)
                  </label>
                  <span className="text-sm font-bold text-[#0D2818]">{interestRate}%</span>
                </div>
                <input
                  id="interest-slider"
                  aria-label="Interest Rate per annum"
                  type="range"
                  min={7.5}
                  max={11.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
              </div>
            </div>

            {/* Statutory Charges Box */}
            <div className="pt-4 border-t border-[#EDE7DC]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0D2818] block mb-2">
                Tamil Nadu Statutory Acquisition Breakdown:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#EDE7DC]">
                  <div className="text-[10px] text-[#7A8680] uppercase">Stamp Duty (7%)</div>
                  <div className="font-semibold text-[#161D1A] mt-0.5">{formatIndianCurrency(statutory.stampDuty)}</div>
                </div>
                <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#EDE7DC]">
                  <div className="text-[10px] text-[#7A8680] uppercase">Registration (2%)</div>
                  <div className="font-semibold text-[#161D1A] mt-0.5">{formatIndianCurrency(statutory.registrationCharge)}</div>
                </div>
                <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#EDE7DC]">
                  <div className="text-[10px] text-[#7A8680] uppercase">Est. Outlay</div>
                  <div className="font-bold text-[#0D2818] mt-0.5">{formatIndianCurrency(statutory.effectiveTotalOutlay)}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Results Summary Card Right */}
          <div className="lg:col-span-5 bg-[#0D2818] text-[#FAF8F5] p-6 sm:p-8 rounded border border-[#1E452E] shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880] block">
                Estimated Monthly Outlay
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F5]">
                  {formatIndianCurrency(monthlyEmi)}
                </span>
                <span className="text-xs text-[#A8BEB2]">/ month</span>
              </div>
              <p className="text-xs text-[#A8BEB2] mt-1">
                Principal Loan: {formatIndianCurrency(principalLoan)} at {interestRate}% for {tenureYears} years
              </p>

              {/* Loan Breakdown Table */}
              <div className="mt-6 pt-4 border-t border-[#1C3E29] space-y-3 text-xs">
                <div className="flex justify-between text-[#C8D6CF]">
                  <span>Total Principal Amount:</span>
                  <span className="font-semibold text-[#FAF8F5]">{formatIndianCurrency(principalLoan)}</span>
                </div>
                <div className="flex justify-between text-[#C8D6CF]">
                  <span>Total Interest Payable:</span>
                  <span className="font-semibold text-[#FAF8F5]">{formatIndianCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between text-[#C8D6CF]">
                  <span>Total Repayment (P + I):</span>
                  <span className="font-semibold text-[#FAF8F5]">{formatIndianCurrency(totalLoanRepayment)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#1C3E29] text-[#DFCCA8] font-bold text-sm">
                  <span>Down Payment Required:</span>
                  <span>{formatIndianCurrency(downPaymentAmount)}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-[#1C3E29] space-y-3">
              <button
                onClick={onOpenSiteVisit}
                className="w-full py-3 rounded text-xs font-semibold uppercase tracking-wider bg-[#C5A880] hover:bg-[#D4BC9B] text-[#0D2818] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4" /> Book Consultation with Private Wealth Manager
              </button>
              <div className="flex items-center gap-1.5 text-[10px] text-[#A8BEB2] justify-center">
                <ShieldAlert className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Tie-ups with SBI, HDFC, ICICI & Standard Chartered for luxury mortgages</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
