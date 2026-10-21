import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenHomeFinder: () => void;
  onOpenAdminCrm: () => void;
  onOpenSiteVisit: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenHomeFinder,
  onOpenAdminCrm,
  onOpenSiteVisit,
}) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#07170E] text-[#C8D6CF] border-t border-[#163824] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Main 4-Column Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#163824]">
            
            {/* Col 1: Brand & Identity */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#C5A880] to-[#8C6B3C] p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#07170E] flex items-center justify-center text-[#E8DFD0] font-serif font-bold">
                    EC
                  </div>
                </div>
                <div>
                  <div className="font-serif text-xl font-bold tracking-wider text-[#FAF8F5]">
                    ELVIRA CREST
                  </div>
                  <div className="text-[9px] tracking-[0.25em] text-[#C5A880] uppercase font-medium">
                    Luxury Realty • Tamil Nadu
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#9BB3A7] leading-relaxed">
                Elvira Crest Realty is an independent luxury residential developer and architectural demonstration platform for South India. Creating low-density oceanfront sky villas, heritage estates, and smart condominiums across Chennai, Coimbatore, and Bengaluru.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#102D1D] text-[#DFCCA8] border border-[#1E4D33] text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  100% RERA Registered Inventory
                </span>
              </div>
            </div>

            {/* Col 2: Residences by Location */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FAF8F5]">
                Curated Residences
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => onNavigateSection('residences-section')}
                    className="hover:text-[#FAF8F5] transition-colors flex items-center gap-1 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C5A880]" />
                    <span>Elvira Marina Bay — ECR, Chennai</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateSection('residences-section')}
                    className="hover:text-[#FAF8F5] transition-colors flex items-center gap-1 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C5A880]" />
                    <span>The Sovereign at Boat Club — R.A. Puram</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateSection('residences-section')}
                    className="hover:text-[#FAF8F5] transition-colors flex items-center gap-1 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C5A880]" />
                    <span>Aura Zenith Tech-Park — OMR, Chennai</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateSection('residences-section')}
                    className="hover:text-[#FAF8F5] transition-colors flex items-center gap-1 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C5A880]" />
                    <span>The Grand Conservatory — Anna Nagar</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateSection('residences-section')}
                    className="hover:text-[#FAF8F5] transition-colors flex items-center gap-1 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C5A880]" />
                    <span>Verdant Hills Estate — Race Course, Coimbatore</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Client Services & AI */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FAF8F5]">
                Client Services
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={onOpenHomeFinder}
                    className="hover:text-[#FAF8F5] text-[#DFCCA8] transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#C5A880]" />
                    <span>HomeFinder AI™</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenSiteVisit}
                    className="hover:text-[#FAF8F5] transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C5A880]" />
                    <span>Book Private Site Visit</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateSection('calculator-section')}
                    className="hover:text-[#FAF8F5] transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C5A880]" />
                    <span>Loan & Stamp Duty Tool</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPrivacyOpen(true)}
                    className="hover:text-[#FAF8F5] transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C5A880]" />
                    <span>RERA & Privacy Charter</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenAdminCrm}
                    className="hover:text-[#FAF8F5] text-[#8FAFA0] transition-colors flex items-center gap-1 pt-1"
                  >
                    <Lock className="w-3 h-3 text-[#C5A880]" />
                    <span>Staff Portal CRM</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Corporate Offices */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FAF8F5]">
                Regional Headquarters
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>
                    <strong>Chennai Corporate:</strong> No. 42, G.N. Chetty Road, T. Nagar, Chennai - 600017
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>
                    <strong>Coimbatore Experience:</strong> 88, Race Course Road, Coimbatore - 641018
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[#DFCCA8]">
                  <Phone className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <a href="tel:+914448902200" className="hover:underline">
                    +91 44 4890 2200
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#DFCCA8]">
                  <Mail className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span>concierge@elviracrest.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* Legal Compliance Disclaimers */}
          <div className="py-6 border-b border-[#163824] text-[11px] text-[#7A9486] leading-relaxed space-y-2">
            <p>
              <strong>Sample Demonstration & RERA Notice:</strong> This website is an independent real estate web design and automation showcase created to demonstrate modern UI/UX, AI property discovery, and CRM workflows for Tamil Nadu developers. All project names, floor plans, and renderings are illustrative demonstration models and do not constitute an offer of sale or official solicitation.
            </p>
            <p>
              Prices shown with an asterisk (*) are indicative base figures and exclude statutory Tamil Nadu stamp duty (~7%), registration (~2%), maintenance deposits, and GST where applicable.
            </p>
          </div>

          {/* Copyright & Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A9486]">
            <div>
              © {new Date().getFullYear()} Elvira Crest Luxury Realty. All architectural rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setPrivacyOpen(true)} className="hover:text-[#FAF8F5] transition-colors">
                Privacy Policy & Consent
              </button>
              <span>•</span>
              <button onClick={() => onNavigateSection('why-us-section')} className="hover:text-[#FAF8F5] transition-colors">
                RERA Compliance Charter
              </button>
              <span>•</span>
              <button onClick={onOpenAdminCrm} className="hover:text-[#FAF8F5] transition-colors">
                Staff CRM
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {privacyOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FAF8F5] text-[#161D1A] max-w-lg w-full rounded p-6 shadow-2xl border border-[#DDD6C8] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#DDD6C8] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#0D2818]">
                Data Privacy & RERA Communication Charter
              </h3>
              <button
                onClick={() => setPrivacyOpen(false)}
                className="p-1 hover:bg-[#F2ECE1] rounded"
              >
                <X className="w-5 h-5 text-[#161D1A]" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed text-[#55615B] max-h-80 overflow-y-auto pr-1">
              <p>
                <strong>1. Data Collection:</strong> We collect only essential contact information (full name, phone number, email address, budget expectations, and visit date) necessary to fulfill property consultations and security entry passes.
              </p>
              <p>
                <strong>2. Zero Spam & Privacy Protection:</strong> Your personal information is never sold, shared, or made publicly accessible. Contact information is accessed exclusively by designated Elvira relationship managers.
              </p>
              <p>
                <strong>3. Automated Workflow Integration:</strong> In production deployments, submitted leads can optionally be dispatched through authenticated webhook protocols to approved CRM platforms (e.g., n8n) and verified Meta WhatsApp Cloud APIs.
              </p>
              <p>
                <strong>4. Demonstration Disclaimer:</strong> This web applet is a demonstrator project. Contact: privacy@elviracrest.com.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setPrivacyOpen(false)}
                className="px-4 py-2 rounded bg-[#0D2818] text-[#FAF8F5] font-semibold text-xs uppercase"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
