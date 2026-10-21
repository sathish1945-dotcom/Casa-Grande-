import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle,
  HelpCircle,
  PhoneCall,
  SlidersHorizontal,
} from 'lucide-react';
import { Project, PropertyFilterParams, City } from './lib/types';
import { PROPERTIES } from './lib/data/properties';
import { filterProjects, sortProjects } from './lib/filter-utils';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectCard } from './components/ProjectCard';
import { ProjectFilter } from './components/ProjectFilter';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { HomeFinderAI } from './components/HomeFinderAI';
import { SiteVisitModal } from './components/SiteVisitModal';
import { SalesDashboard } from './components/SalesDashboard';
import { AmenitiesShowcase } from './components/AmenitiesShowcase';
import { WhyChooseUs } from './components/WhyChooseUs';
import { EmiCalculatorSection } from './components/EmiCalculatorSection';
import { BrochureModal } from './components/BrochureModal';
import { Footer } from './components/Footer';

export default function App() {
  // Global Filter State
  const [filters, setFilters] = useState<PropertyFilterParams>({
    city: 'All',
    bhk: 'All',
    propertyType: 'All',
    status: 'All',
    maxBudget: 0,
    searchQuery: '',
    sortBy: 'featured',
  });

  // Modal and Drawer States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [siteVisitTarget, setSiteVisitTarget] = useState<Project | null>(null);
  const [isHomeFinderOpen, setIsHomeFinderOpen] = useState(false);
  const [isAdminCrmOpen, setIsAdminCrmOpen] = useState(false);
  const [brochureTarget, setBrochureTarget] = useState<Project | null>(null);

  // Quick category tabs for residences section
  const [residencesTab, setResidencesTab] = useState<'all' | 'ready' | 'launches' | 'villas'>('all');

  // Filter and sort the inventory
  const filteredProjects = filterProjects(PROPERTIES, {
    ...filters,
    status:
      residencesTab === 'ready'
        ? 'Ready to Move'
        : residencesTab === 'launches'
        ? 'New Launch'
        : filters.status,
    propertyType:
      residencesTab === 'villas'
        ? 'Row Villa'
        : filters.propertyType,
  });

  const displayProjects = sortProjects(filteredProjects, filters.sortBy);

  // Smooth scroll helper
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearchSubmit = () => {
    handleNavigateSection('residences-section');
  };

  const handleOpenSiteVisit = (projectOrId?: Project | string) => {
    if (typeof projectOrId === 'string') {
      const found = PROPERTIES.find((p) => p.id === projectOrId);
      setSiteVisitTarget(found || null);
    } else {
      setSiteVisitTarget(projectOrId || null);
    }
    setIsSiteVisitOpen(true);
  };

  const handleDownloadBrochure = (project: Project) => {
    setBrochureTarget(project);
  };

  const handleResetFilters = () => {
    setFilters({
      city: 'All',
      bhk: 'All',
      propertyType: 'All',
      status: 'All',
      maxBudget: 0,
      searchQuery: '',
      sortBy: 'featured',
    });
    setResidencesTab('all');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161D1A] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-[#0D2818]">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        selectedCity={filters.city || 'All'}
        onSelectCity={(city: City | 'All') => setFilters((prev) => ({ ...prev, city }))}
        onOpenSiteVisit={handleOpenSiteVisit}
        onOpenHomeFinder={() => setIsHomeFinderOpen(true)}
        onOpenAdminCrm={() => setIsAdminCrmOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* 2. Hero Section with Architectural Photo & Search Console */}
      <Hero
        searchCity={filters.city || 'All'}
        setSearchCity={(city) => setFilters((prev) => ({ ...prev, city }))}
        searchType={filters.propertyType || 'All'}
        setSearchType={(type) => setFilters((prev) => ({ ...prev, propertyType: type }))}
        searchBhk={filters.bhk || 'All'}
        setSearchBhk={(bhk) => setFilters((prev) => ({ ...prev, bhk }))}
        searchBudget={filters.maxBudget || 0}
        setSearchBudget={(maxBudget) => setFilters((prev) => ({ ...prev, maxBudget }))}
        searchStatus={filters.status || 'All'}
        setSearchStatus={(status) => setFilters((prev) => ({ ...prev, status }))}
        onSearchSubmit={handleHeroSearchSubmit}
        onOpenHomeFinder={() => setIsHomeFinderOpen(true)}
      />

      {/* 3. Residences Portfolio Section */}
      <section id="residences-section" className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#9C7A4A] block mb-2">
                Tamil Nadu & Bengaluru Portfolio
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2818] tracking-tight">
                Architectural Residences & Estates
              </h2>
              <p className="text-xs sm:text-sm text-[#55615B] mt-2 max-w-xl">
                Explore verified luxury projects across prime localities in Chennai, Coimbatore, and Bengaluru.
                Every residence features RERA registration and clear statutory pricing.
              </p>
            </div>

            {/* Quick Segment Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setResidencesTab('all')}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  residencesTab === 'all'
                    ? 'bg-[#0D2818] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B] hover:bg-[#F2ECE1]'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setResidencesTab('ready')}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  residencesTab === 'ready'
                    ? 'bg-[#0D2818] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B] hover:bg-[#F2ECE1]'
                }`}
              >
                Ready to Move
              </button>
              <button
                onClick={() => setResidencesTab('launches')}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  residencesTab === 'launches'
                    ? 'bg-[#0D2818] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B] hover:bg-[#F2ECE1]'
                }`}
              >
                New Launches
              </button>
              <button
                onClick={() => setResidencesTab('villas')}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  residencesTab === 'villas'
                    ? 'bg-[#0D2818] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B] hover:bg-[#F2ECE1]'
                }`}
              >
                Exclusive Villas
              </button>
            </div>
          </div>

          {/* Interactive Search & Filter Controls */}
          <ProjectFilter
            filters={filters}
            onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
            onResetFilters={handleResetFilters}
            totalResults={displayProjects.length}
          />

          {/* Project Grid */}
          {displayProjects.length === 0 ? (
            /* Empty State */
            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F2ECE1] text-[#7A8680] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0D2818]">
                No verified residences match your active filters
              </h3>
              <p className="text-xs text-[#636F69]">
                Try adjusting your budget range, bedroom configuration, or location filter to see more homes.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded text-xs font-semibold uppercase bg-[#0D2818] text-[#FAF8F5] hover:bg-[#183F29]"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => setIsHomeFinderOpen(true)}
                  className="px-4 py-2 rounded text-xs font-semibold uppercase border border-[#0D2818] text-[#0D2818] hover:bg-[#FAF8F5]"
                >
                  Ask HomeFinder AI
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelectProject={setSelectedProject}
                  onBookSiteVisit={handleOpenSiteVisit}
                  onDownloadBrochure={handleDownloadBrochure}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. Amenities & Resort Lifestyle Showcase */}
      <AmenitiesShowcase />

      {/* 5. Why Choose Us (Developer Credibility & Craftsmanship) */}
      <WhyChooseUs />

      {/* 6. Financial Planning: Mortgage EMI & Tamil Nadu Stamp Duty Calculator */}
      <EmiCalculatorSection onOpenSiteVisit={() => handleOpenSiteVisit()} />

      {/* 7. Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenHomeFinder={() => setIsHomeFinderOpen(true)}
        onOpenAdminCrm={() => setIsAdminCrmOpen(true)}
        onOpenSiteVisit={() => handleOpenSiteVisit()}
      />

      {/* Floating HomeFinder AI Pill Launcher */}
      <aside aria-label="Quick AI property assistant" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsHomeFinderOpen(true)}
          className="group relative flex items-center gap-2.5 bg-[#0D2818] text-[#FAF8F5] border border-[#C5A880]/70 pl-3.5 pr-4 py-3 rounded-full shadow-2xl hover:bg-[#153D25] hover:scale-105 active:scale-95 transition-all"
          aria-label="Open HomeFinder AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#C5A880]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold tracking-wider text-[#FAF8F5]">
              HomeFinder AI™
            </div>
            <div className="text-[10px] text-[#C5A880] tracking-tight">
              Ask about 2 BHK, ECR, Budget...
            </div>
          </div>
        </button>
      </aside>

      {/* Modals & Overlays */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onBookSiteVisit={handleOpenSiteVisit}
          onDownloadBrochure={handleDownloadBrochure}
          allProjects={PROPERTIES}
          onSelectRelatedProject={(rel) => setSelectedProject(rel)}
        />
      )}

      {isSiteVisitOpen && (
        <SiteVisitModal
          isOpen={isSiteVisitOpen}
          onClose={() => setIsSiteVisitOpen(false)}
          selectedProject={siteVisitTarget}
          allProjects={PROPERTIES}
        />
      )}

      {isHomeFinderOpen && (
        <HomeFinderAI
          isOpen={isHomeFinderOpen}
          onClose={() => setIsHomeFinderOpen(false)}
          onSelectProject={(p) => setSelectedProject(p)}
          onBookSiteVisit={handleOpenSiteVisit}
        />
      )}

      {isAdminCrmOpen && (
        <SalesDashboard
          isOpen={isAdminCrmOpen}
          onClose={() => setIsAdminCrmOpen(false)}
          allProjects={PROPERTIES}
        />
      )}

      {brochureTarget && (
        <BrochureModal
          isOpen={Boolean(brochureTarget)}
          onClose={() => setBrochureTarget(null)}
          project={brochureTarget}
        />
      )}

    </div>
  );
}
