import React from 'react';
import { Search, Sparkles, Shield, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { City, PropertyType, ProjectStatus } from '../lib/types';

interface HeroProps {
  searchCity: City | 'All';
  setSearchCity: (city: City | 'All') => void;
  searchType: PropertyType | 'All';
  setSearchType: (type: PropertyType | 'All') => void;
  searchBhk: number | 'All';
  setSearchBhk: (bhk: number | 'All') => void;
  searchBudget: number;
  setSearchBudget: (budget: number) => void;
  searchStatus: ProjectStatus | 'All';
  setSearchStatus: (status: ProjectStatus | 'All') => void;
  onSearchSubmit: () => void;
  onOpenHomeFinder: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchCity,
  setSearchCity,
  searchType,
  setSearchType,
  searchBhk,
  setSearchBhk,
  searchBudget,
  setSearchBudget,
  searchStatus,
  setSearchStatus,
  onSearchSubmit,
  onOpenHomeFinder,
}) => {
  const budgetOptions = [
    { label: 'All Budgets', value: 0 },
    { label: 'Under ₹1.00 Cr', value: 10000000 },
    { label: 'Under ₹2.00 Cr', value: 20000000 },
    { label: 'Under ₹3.50 Cr', value: 35000000 },
    { label: 'Under ₹7.00 Cr', value: 70000000 },
    { label: 'Ultra Luxury (₹7 Cr+)', value: 150000000 },
  ];

  const handleChipClick = (city: City | 'All', bhk: number | 'All', type?: PropertyType) => {
    setSearchCity(city);
    setSearchBhk(bhk);
    if (type) setSearchType(type);
    onSearchSubmit();
  };

  return (
    <section id="hero-section" className="relative min-h-[90vh] flex flex-col justify-center bg-[#091C12] text-[#FAF8F5] overflow-hidden">
      {/* Background Architectural Imagery with Deep Vignette & Dark Forest Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
          alt="Elvira Marina Bay Seafront Architectural Sky Villa"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-[pulse_12s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091C12] via-[#0D2818]/85 to-[#091C12]/75 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C5A880]/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-20 pb-16 flex-1 flex flex-col justify-center">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#DFCCA8]">
            <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
            Official Developer Portfolio • Tamil Nadu & Bengaluru
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#A8BEB2]">
            <Award className="w-3.5 h-3.5 text-[#C5A880]" />
            CRISIL Real Estate Star Rated Projects
          </span>
        </div>

        {/* Editorial Headline */}
        <div className="max-w-3xl mb-8">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5] leading-[1.12]">
            Architectural Grandeur. <br />
            <span className="italic font-normal text-[#D8BA8F]">Uncompromising</span> Serenity.
          </h1>
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-[#C8D6CF] font-light leading-relaxed max-w-2xl">
            Discover limited-edition coastal sky villas along Chennai’s ECR, palatial Boat Club penthouses,
            and tranquil courtyard villas in Coimbatore’s Race Course. Designed with 11-foot clear ceilings,
            zero shared walls, and RERA delivery guarantees.
          </p>
        </div>

        {/* Multi-Dimensional Property Search Console */}
        <div className="bg-[#0A1F13]/90 backdrop-blur-md border border-[#2B543D] rounded-lg p-4 sm:p-6 shadow-2xl max-w-5xl">
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            
            {/* City Dropdown */}
            <div className="flex-1 min-w-[140px]">
              <label htmlFor="search-city-select" className="block text-[11px] font-semibold uppercase tracking-wider text-[#C5A880] mb-1.5">
                City / Location
              </label>
              <select
                id="search-city-select"
                aria-label="City or Location"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value as City | 'All')}
                className="w-full bg-[#133522] border border-[#245237] rounded px-3 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
              >
                <option value="All">All Cities (TN & KA)</option>
                <option value="Chennai">Chennai (ECR, OMR, Boat Club, Anna Nagar)</option>
                <option value="Coimbatore">Coimbatore (Race Course)</option>
                <option value="Bengaluru">Bengaluru (Whitefield)</option>
              </select>
            </div>

            {/* BHK Dropdown */}
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="search-bhk-select" className="block text-[11px] font-semibold uppercase tracking-wider text-[#C5A880] mb-1.5">
                Bedrooms (BHK)
              </label>
              <select
                id="search-bhk-select"
                aria-label="Bedrooms BHK"
                value={searchBhk}
                onChange={(e) => setSearchBhk(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                className="w-full bg-[#133522] border border-[#245237] rounded px-3 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
              >
                <option value="All">Any BHK</option>
                <option value={2}>2 BHK Smart Homes</option>
                <option value={3}>3 BHK Residences</option>
                <option value={4}>4 BHK Sky Villas</option>
                <option value={5}>5 BHK Penthouses</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="flex-1 min-w-[130px]">
              <label htmlFor="search-type-select" className="block text-[11px] font-semibold uppercase tracking-wider text-[#C5A880] mb-1.5">
                Property Type
              </label>
              <select
                id="search-type-select"
                aria-label="Property Type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as PropertyType | 'All')}
                className="w-full bg-[#133522] border border-[#245237] rounded px-3 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
              >
                <option value="All">All Typologies</option>
                <option value="Sky Villa">Sky Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Penthouse">Bespoke Penthouse</option>
                <option value="Row Villa">Courtyard Villa</option>
              </select>
            </div>

            {/* Budget Cap */}
            <div className="flex-1 min-w-[140px]">
              <label htmlFor="search-budget-select" className="block text-[11px] font-semibold uppercase tracking-wider text-[#C5A880] mb-1.5">
                Max Budget
              </label>
              <select
                id="search-budget-select"
                aria-label="Max Budget"
                value={searchBudget}
                onChange={(e) => setSearchBudget(Number(e.target.value))}
                className="w-full bg-[#133522] border border-[#245237] rounded px-3 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex-1 min-w-[130px]">
              <label htmlFor="search-status-select" className="block text-[11px] font-semibold uppercase tracking-wider text-[#C5A880] mb-1.5">
                Project Status
              </label>
              <select
                id="search-status-select"
                aria-label="Project Status"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value as ProjectStatus | 'All')}
                className="w-full bg-[#133522] border border-[#245237] rounded px-3 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
              >
                <option value="All">All Statuses</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                <option value="New Launch">New Launch</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="flex items-end">
              <button
                onClick={onSearchSubmit}
                className="w-full md:w-auto h-[38px] px-6 rounded bg-[#C5A880] hover:bg-[#D8BA8F] text-[#0A1F13] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Assistant Prompt Banner & Quick Chips */}
          <div className="mt-4 pt-4 border-t border-[#1C3E29] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#8FAFA0] font-medium">Quick Curations:</span>
              <button
                onClick={() => handleChipClick('Chennai', 2)}
                className="px-2.5 py-1 rounded bg-[#133522] hover:bg-[#1A452C] text-[#DFCCA8] border border-[#245237] transition-colors"
              >
                Chennai 2 BHK under ₹80L
              </button>
              <button
                onClick={() => handleChipClick('Chennai', 4, 'Sky Villa')}
                className="px-2.5 py-1 rounded bg-[#133522] hover:bg-[#1A452C] text-[#DFCCA8] border border-[#245237] transition-colors"
              >
                ECR Oceanfront Sky Villas
              </button>
              <button
                onClick={() => handleChipClick('Coimbatore', 3, 'Row Villa')}
                className="px-2.5 py-1 rounded bg-[#133522] hover:bg-[#1A452C] text-[#DFCCA8] border border-[#245237] transition-colors"
              >
                Race Course Coimbatore Villas
              </button>
            </div>

            <button
              onClick={onOpenHomeFinder}
              className="inline-flex items-center gap-1.5 text-[#C5A880] hover:text-[#FAF8F5] transition-colors font-medium cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Or ask HomeFinder AI in natural language</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Developer Trust Metrics Ribbon */}
        <div className="mt-10 pt-6 border-t border-[#1C3E29]/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-[#DFCCA8]">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
            <div>
              <div className="font-serif text-lg font-bold text-[#FAF8F5]">22+ Years</div>
              <div className="text-[11px] text-[#A8BEB2] tracking-wide">Developer Heritage in TN</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
            <div>
              <div className="font-serif text-lg font-bold text-[#FAF8F5]">45+ Delivered</div>
              <div className="text-[11px] text-[#A8BEB2] tracking-wide">Iconic Residential Projects</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
            <div>
              <div className="font-serif text-lg font-bold text-[#FAF8F5]">15,000+</div>
              <div className="text-[11px] text-[#A8BEB2] tracking-wide">Delighted Homeowners</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
            <div>
              <div className="font-serif text-lg font-bold text-[#FAF8F5]">Zero-Delay</div>
              <div className="text-[11px] text-[#A8BEB2] tracking-wide">RERA Handover Guarantee</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
