import React, { useState } from 'react';
import {
  Compass,
  Phone,
  Calendar,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { City, Project } from '../lib/types';

interface NavbarProps {
  selectedCity: City | 'All';
  onSelectCity: (city: City | 'All') => void;
  onOpenSiteVisit: (projectOrId?: Project | string) => void;
  onOpenHomeFinder: () => void;
  onOpenAdminCrm: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onSelectCity,
  onOpenSiteVisit,
  onOpenHomeFinder,
  onOpenAdminCrm,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const cities: (City | 'All')[] = ['All', 'Chennai', 'Coimbatore', 'Bengaluru'];

  const handleCitySelect = (city: City | 'All') => {
    onSelectCity(city);
    setCityDropdownOpen(false);
    onNavigateSection('residences-section');
  };

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#0A1F13] text-[#E8DFD0] border-b border-[#1E3B2B] text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-[#C5A880]/20 text-[#D8BA8F] uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% RERA Certified Portfolio
            </span>
            <span className="hidden md:inline text-[#A8BEB2]">
              Tamil Nadu’s benchmark in architectural sky villas & estates
            </span>
          </div>

          <div className="flex items-center gap-5 text-[11px] tracking-wide">
            <a
              href="tel:+914448902200"
              className="flex items-center gap-1.5 text-[#E8DFD0] hover:text-[#D8BA8F] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C5A880]" />
              <span>Priority Helpline: +91 44 4890 2200</span>
            </a>
            <button
              onClick={onOpenAdminCrm}
              className="flex items-center gap-1 text-[#A8BEB2] hover:text-[#E8DFD0] transition-colors underline decoration-[#C5A880]/50"
              title="Protected Sales CRM"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#0D2818]/95 backdrop-blur-md border-b border-[#1C3E29] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div
            onClick={() => onNavigateSection('hero-section')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#C5A880] to-[#8C6B3C] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0D2818] flex items-center justify-center text-[#E8DFD0] font-serif text-lg font-bold tracking-tighter">
                EC
              </div>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#FAF8F5] group-hover:text-[#D8BA8F] transition-colors">
                ELVIRA CREST
              </div>
              <div className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-medium">
                Luxury Realty • Tamil Nadu
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#D1DDD6]">
            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#2B543D] text-[#E8DFD0] bg-[#143522] hover:border-[#C5A880] transition-all"
                aria-expanded={cityDropdownOpen}
                aria-label="Filter residences by city"
              >
                <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{selectedCity === 'All' ? 'All Cities' : selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A8BEB2]" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full mt-2 w-44 bg-[#0A1F13] border border-[#2B543D] rounded-md shadow-2xl py-2 z-50">
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCitySelect(c)}
                      className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                        selectedCity === c
                          ? 'bg-[#183F29] text-[#D8BA8F] font-semibold'
                          : 'text-[#D1DDD6] hover:bg-[#123120] hover:text-[#FAF8F5]'
                      }`}
                    >
                      {c === 'All' ? 'All Cities' : c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigateSection('residences-section')}
              className="hover:text-[#FAF8F5] transition-colors"
            >
              Residences
            </button>
            <button
              onClick={() => onNavigateSection('amenities-section')}
              className="hover:text-[#FAF8F5] transition-colors"
            >
              Lifestyle & Amenities
            </button>
            <button
              onClick={() => onNavigateSection('calculator-section')}
              className="hover:text-[#FAF8F5] transition-colors"
            >
              Financial Planning
            </button>
            <button
              onClick={() => onNavigateSection('why-us-section')}
              className="hover:text-[#FAF8F5] transition-colors"
            >
              Heritage & Craft
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* HomeFinder AI Button */}
            <button
              onClick={onOpenHomeFinder}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-semibold tracking-wider text-[#0D2818] bg-gradient-to-r from-[#DFCCA8] to-[#C5A880] hover:from-[#E8DFD0] hover:to-[#D8BA8F] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              aria-label="Open HomeFinder AI property assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0D2818]" />
              <span>HomeFinder AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
            </button>

            {/* Book Site Visit CTA */}
            <button
              onClick={() => onOpenSiteVisit()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold tracking-wider uppercase text-[#E8DFD0] border border-[#C5A880]/60 hover:bg-[#C5A880]/15 hover:border-[#C5A880] transition-all active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Book Site Visit</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenHomeFinder}
              className="p-2 rounded bg-[#C5A880] text-[#0D2818]"
              aria-label="HomeFinder AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#E8DFD0] hover:text-[#FAF8F5]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A1F13] border-b border-[#1E3B2B] px-6 py-5 text-sm space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">Filter by Location</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      handleCitySelect(c);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 px-3 text-xs rounded border text-left ${
                      selectedCity === c
                        ? 'bg-[#183F29] border-[#C5A880] text-[#D8BA8F] font-semibold'
                        : 'border-[#1C3E29] text-[#D1DDD6]'
                    }`}
                  >
                    {c === 'All' ? 'All Cities' : c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C3E29] flex flex-col gap-3 font-medium text-[#D1DDD6]">
              <button
                onClick={() => {
                  onNavigateSection('residences-section');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-[#FAF8F5]"
              >
                Explore Residences
              </button>
              <button
                onClick={() => {
                  onNavigateSection('amenities-section');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-[#FAF8F5]"
              >
                Amenities & Clubhouse
              </button>
              <button
                onClick={() => {
                  onNavigateSection('calculator-section');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-[#FAF8F5]"
              >
                Home Loan & Stamp Duty Calculator
              </button>
              <button
                onClick={() => {
                  onNavigateSection('why-us-section');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-[#FAF8F5]"
              >
                Heritage & Quality Audits
              </button>
            </div>

            <div className="pt-3 border-t border-[#1C3E29] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onOpenSiteVisit();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#C5A880] text-[#0D2818] flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Accompanied Site Visit
              </button>
              <button
                onClick={() => {
                  onOpenAdminCrm();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded text-xs border border-[#2B543D] text-[#D1DDD6] hover:bg-[#143522] flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-[#C5A880]" /> Staff Sales CRM Login
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
