import React from 'react';
import {
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Building,
  CheckCircle,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% RERA & Title Compliance',
      description: 'Every project carries an unblemished, clear legal title verified by Tier-1 legal counsels and backed by registered RERA completion certificates.',
    },
    {
      icon: Layers,
      title: 'Zero Shared Walls Architecture',
      description: 'Our proprietary structural engineering guarantees acoustic privacy. No adjoining walls between residences ensure complete serenity and uninhibited light.',
    },
    {
      icon: Sparkles,
      title: '11-Foot Clear Ceiling Heights',
      description: 'Experience true volumetric grandeur. Higher ceilings naturally dissipate tropical heat, enhancing air circulation and creating majestic interior volumes.',
    },
    {
      icon: Award,
      title: '100-Point Pre-Handover Quality Audit',
      description: 'Before handing over keys, every villa and suite undergoes rigorous laser-guided snagging inspections covering acoustics, plumbing, waterproofing, and fenestration.',
    },
  ];

  return (
    <section id="why-us-section" className="py-20 bg-[#0D2818] text-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880] block mb-2">
            The Elvira Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF8F5]">
            Engineering Excellence Without Compromise
          </h2>
          <p className="text-sm text-[#C8D6CF] mt-3 font-light leading-relaxed">
            Over two decades of building Tamil Nadu’s most celebrated residential benchmarks with an unwavering commitment to craftsmanship and transparency.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[#123321] border border-[#1E452E] rounded p-6 flex flex-col justify-between hover:border-[#C5A880]/60 transition-all group"
              >
                <div>
                  <div className="w-12 h-12 rounded bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center text-[#DFCCA8] mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#C5A880]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#FAF8F5] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#A8BEB2] leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1C3E29] flex items-center gap-1.5 text-[11px] text-[#C5A880] font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Developer Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded bg-[#143522] border border-[#245237] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#FAF8F5]">
              Experience Tamil Nadu’s Finest Residences
            </h4>
            <p className="text-xs text-[#C8D6CF] mt-1">
              Visit our customer experience centers in Chennai (Boat Club & ECR) or Coimbatore (Race Course).
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-[#DFCCA8]">Call Helpline:</span>
            <a
              href="tel:+914448902200"
              className="px-4 py-2 rounded text-xs font-semibold bg-[#C5A880] text-[#0D2818] hover:bg-[#D4BC9B] transition-colors"
            >
              +91 44 4890 2200
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
