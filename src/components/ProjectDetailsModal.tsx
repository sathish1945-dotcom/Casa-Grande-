import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  Download,
  Building,
  CheckCircle2,
  Car,
  ChevronRight,
  Maximize2,
  Trees,
  Sparkles,
  Phone,
} from 'lucide-react';
import { Project, Configuration } from '../lib/types';
import { formatIndianCurrency, calculateTamilNaduRegistrationCosts } from '../lib/calculator';

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
  onBookSiteVisit: (project: Project) => void;
  onDownloadBrochure: (project: Project) => void;
  allProjects: Project[];
  onSelectRelatedProject: (project: Project) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
  onBookSiteVisit,
  onDownloadBrochure,
  allProjects,
  onSelectRelatedProject,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState<Configuration>(project.configurations[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'floorplans' | 'amenities' | 'location'>('overview');

  const gallery = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.heroImage];

  // Statutory costs estimation
  const statutory = calculateTamilNaduRegistrationCosts(selectedConfig.indicativePrice);

  // Related projects in the same city or similar price tier
  const related = allProjects
    .filter((p) => p.id !== project.id && (p.city === project.city || Math.abs(p.startingPrice - project.startingPrice) < 30000000))
    .slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div className="bg-[#FAF8F5] text-[#161D1A] w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#DDD6C8]">
        
        {/* Sticky Header Bar */}
        <div className="bg-[#0D2818] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#1C3E29] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C5A880] text-[#0D2818]">
                {project.status}
              </span>
              <span className="text-xs text-[#A8BEB2] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C5A880]" /> {project.locality}, {project.city}
              </span>
            </div>
            <h2 id="modal-project-title" className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#FAF8F5] mt-1">
              {project.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onBookSiteVisit(project)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-[#C5A880] text-[#0D2818] hover:bg-[#D4BC9B] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" /> Book Site Visit
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-[#183F29] text-[#DFCCA8] hover:text-[#FAF8F5] transition-colors"
              aria-label="Close project modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          
          {/* Top Gallery & Quick Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gallery Left Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] bg-[#14261C] rounded overflow-hidden shadow-inner">
                <img
                  src={gallery[activeImageIndex] || project.heroImage}
                  alt={`${project.name} view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[11px] text-[#FAF8F5]">
                  Photo {activeImageIndex + 1} of {gallery.length}
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? 'border-[#0D2818] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Pricing & RERA Specs Column */}
            <div className="lg:col-span-5 bg-[#FFFFFF] p-5 rounded border border-[#E5DFD3] flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7A8680] font-semibold block">
                  Indicative Base Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-[#0D2818]">
                    {project.startingPriceDisplay}
                  </span>
                  <span className="text-xs text-[#8C7A63]">*Govt. taxes & registration extra</span>
                </div>

                <div className="mt-4 p-3 rounded bg-[#FAF8F5] border border-[#EDE7DC] space-y-2 text-xs">
                  <div className="flex justify-between text-[#47524C]">
                    <span>RERA Registration:</span>
                    <span className="font-semibold text-[#0D2818]">{project.reraId}</span>
                  </div>
                  <div className="flex justify-between text-[#47524C]">
                    <span>Possession Timeline:</span>
                    <span className="font-semibold text-[#0D2818]">{project.possessionDate}</span>
                  </div>
                  <div className="flex justify-between text-[#47524C]">
                    <span>Total Land Parcel:</span>
                    <span className="font-semibold text-[#0D2818]">{project.totalAcreage} Acres</span>
                  </div>
                  <div className="flex justify-between text-[#47524C]">
                    <span>Open Space Ratio:</span>
                    <span className="font-semibold text-[#0D2818]">{project.openSpacePercentage}% Landscaped</span>
                  </div>
                  <div className="flex justify-between text-[#47524C]">
                    <span>Total Inventory:</span>
                    <span className="font-semibold text-[#0D2818]">{project.totalUnits} Bespoke Homes</span>
                  </div>
                </div>

                {/* Construction Meter if under construction */}
                {project.constructionUpdates && (
                  <div className="mt-4 p-3 rounded bg-[#F2ECE1] border border-[#DDD6C8] text-xs">
                    <div className="flex justify-between font-semibold text-[#0D2818] mb-1">
                      <span>Construction Milestone</span>
                      <span>{project.constructionUpdates.percentComplete}% Complete</span>
                    </div>
                    <div className="w-full bg-[#DDD6C8] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2A5E3F] h-full rounded-full transition-all duration-500"
                        style={{ width: `${project.constructionUpdates.percentComplete}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#55615B] mt-1.5 italic">
                      Current stage: {project.constructionUpdates.stage}
                    </p>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-5 pt-4 border-t border-[#EDE7DC] space-y-2">
                <button
                  onClick={() => onBookSiteVisit(project)}
                  className="w-full py-3 rounded text-xs font-semibold uppercase tracking-wider bg-[#C5A880] hover:bg-[#D4BC9B] text-[#0D2818] shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" /> Schedule Accompanied Site Visit
                </button>
                <button
                  onClick={() => onDownloadBrochure(project)}
                  className="w-full py-2.5 rounded text-xs font-semibold uppercase tracking-wider border border-[#0D2818] text-[#0D2818] hover:bg-[#0D2818] hover:text-[#FAF8F5] flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-[#C5A880]" /> Download Architectural Brochure
                </button>
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-[#DDD6C8] flex gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-[#0D2818] text-[#0D2818]'
                  : 'border-transparent text-[#7A8680] hover:text-[#0D2818]'
              }`}
            >
              Architectural Concept
            </button>
            <button
              onClick={() => setActiveTab('floorplans')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'floorplans'
                  ? 'border-[#0D2818] text-[#0D2818]'
                  : 'border-transparent text-[#7A8680] hover:text-[#0D2818]'
              }`}
            >
              Floor Plans & Configurations ({project.configurations.length})
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'amenities'
                  ? 'border-[#0D2818] text-[#0D2818]'
                  : 'border-transparent text-[#7A8680] hover:text-[#0D2818]'
              }`}
            >
              Clubhouse & Amenities
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'location'
                  ? 'border-[#0D2818] text-[#0D2818]'
                  : 'border-transparent text-[#7A8680] hover:text-[#0D2818]'
              }`}
            >
              Location & Commute
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0D2818] mb-2">
                  The Vision Behind {project.name}
                </h3>
                <p className="text-sm text-[#47524C] leading-relaxed">
                  {project.longDescription}
                </p>
              </div>

              {/* Key Architectural Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded bg-[#FFFFFF] border border-[#E5DFD3]">
                  <div className="text-[#C5A880] mb-2 font-serif text-lg font-bold">11-Foot Ceilings</div>
                  <p className="text-xs text-[#55615B] leading-relaxed">
                    Volumetric spatial luxury with full-height French glazing, designed for maximum coastal and natural cross-ventilation.
                  </p>
                </div>
                <div className="p-4 rounded bg-[#FFFFFF] border border-[#E5DFD3]">
                  <div className="text-[#C5A880] mb-2 font-serif text-lg font-bold">Zero Shared Walls</div>
                  <p className="text-xs text-[#55615B] leading-relaxed">
                    Independent structural engineering providing acoustic isolation and 270-degree panoramic sightlines.
                  </p>
                </div>
                <div className="p-4 rounded bg-[#FFFFFF] border border-[#E5DFD3]">
                  <div className="text-[#C5A880] mb-2 font-serif text-lg font-bold">Private Elevator Lobby</div>
                  <p className="text-xs text-[#55615B] leading-relaxed">
                    Direct high-speed biometric access straight into your private foyer with dedicated butler service passages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Floor Plans & Configurations */}
          {activeTab === 'floorplans' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {project.configurations.map((cfg) => (
                  <button
                    key={cfg.id}
                    onClick={() => setSelectedConfig(cfg)}
                    className={`px-4 py-2 rounded text-xs font-semibold tracking-wider transition-all ${
                      selectedConfig.id === cfg.id
                        ? 'bg-[#0D2818] text-[#FAF8F5] shadow-sm'
                        : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#47524C] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {cfg.type} ({cfg.carpetAreaSqFt} sq.ft)
                  </button>
                ))}
              </div>

              {/* Selected Configuration Viewer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FFFFFF] p-5 rounded border border-[#E5DFD3]">
                {/* 2D Plan Visual */}
                <div className="md:col-span-7 bg-[#FAF8F5] p-3 rounded border border-[#DDD6C8] flex flex-col items-center justify-center">
                  <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-[#ECE5D8] flex items-center justify-center">
                    <img
                      src={selectedConfig.floorPlanUrl}
                      alt={`${selectedConfig.type} Architectural 2D Floor Plan`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white">
                      Architectural Sample 2D Layout
                    </div>
                  </div>
                  <span className="text-[11px] text-[#7A8680] mt-2 italic">
                    *Detailed CAD dimension blueprints available during accompanied site visit
                  </span>
                </div>

                {/* Configuration Specs & Cost Breakdown */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0D2818]">
                      {selectedConfig.type} Specifications
                    </h4>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                        <span className="text-[#636F69]">Carpet Area (RERA):</span>
                        <span className="font-semibold text-[#161D1A]">{selectedConfig.carpetAreaSqFt} sq.ft</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                        <span className="text-[#636F69]">Super Built-up Area:</span>
                        <span className="font-semibold text-[#161D1A]">{selectedConfig.superBuiltUpSqFt} sq.ft</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                        <span className="text-[#636F69]">Bathrooms:</span>
                        <span className="font-semibold text-[#161D1A]">{selectedConfig.bathrooms} En-suite</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                        <span className="text-[#636F69]">Expansive Balconies:</span>
                        <span className="font-semibold text-[#161D1A]">{selectedConfig.balconies}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                        <span className="text-[#636F69]">Available Inventory:</span>
                        <span className="font-bold text-emerald-800">{selectedConfig.availableUnits} Residences Left</span>
                      </div>
                    </div>

                    {/* Tamil Nadu Estimated Statutory Cost Box */}
                    <div className="mt-4 p-3 rounded bg-[#FAF8F5] border border-[#DDD6C8] text-[11px] space-y-1">
                      <div className="font-semibold text-[#0D2818] text-xs mb-1">
                        Tamil Nadu Indicative Cost Outlay:
                      </div>
                      <div className="flex justify-between text-[#55615B]">
                        <span>Base Price:</span>
                        <span className="font-semibold">{selectedConfig.priceDisplay}</span>
                      </div>
                      <div className="flex justify-between text-[#55615B]">
                        <span>TN Stamp Duty (~7%):</span>
                        <span>{formatIndianCurrency(statutory.stampDuty)}</span>
                      </div>
                      <div className="flex justify-between text-[#55615B]">
                        <span>Registration Fee (~2%):</span>
                        <span>{formatIndianCurrency(statutory.registrationCharge)}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-[#DDD6C8] font-bold text-[#0D2818]">
                        <span>Approx. Total Outlay:</span>
                        <span>{formatIndianCurrency(statutory.effectiveTotalOutlay)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookSiteVisit(project)}
                    className="w-full py-2.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#C5A880] text-[#0D2818] hover:bg-[#D4BC9B] transition-colors"
                  >
                    Enquire for {selectedConfig.type}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Amenities */}
          {activeTab === 'amenities' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#0D2818]">
                Bespoke Club & Wellness Amenities
              </h3>
              <p className="text-xs text-[#55615B]">
                Curated for health, connection, and mindful luxury across multi-acre podium greenery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {project.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded bg-[#FFFFFF] border border-[#E5DFD3] flex items-center gap-3 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2A5E3F] shrink-0" />
                    <span className="text-xs font-medium text-[#1A2620]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Location & Commute */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0D2818] mb-1">
                  Location Intelligence & Connectivity
                </h3>
                <p className="text-xs text-[#55615B]">
                  Address: {project.address}
                </p>
              </div>

              {/* Commute Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.nearbyLandmarks.map((lm, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded bg-[#FFFFFF] border border-[#E5DFD3] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#1A2620]">{lm.name}</div>
                      <span className="text-[10px] text-[#7A8680] uppercase tracking-wider">{lm.type}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-[#0D2818]">{lm.commuteTimeMins} mins drive</div>
                      <div className="text-[10px] text-[#8C7A63]">{lm.distanceKm} km</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grounded AI Recommendations Section */}
          {related.length > 0 && (
            <div className="pt-6 border-t border-[#DDD6C8] space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <h4 className="font-serif text-base font-bold text-[#0D2818]">
                  Verified Alternative Residences in Portfolio
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedProject(rel)}
                    className="p-3 rounded bg-[#FFFFFF] border border-[#E5DFD3] hover:border-[#0D2818] cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <img src={rel.heroImage} alt={rel.name} className="w-20 h-16 object-cover rounded shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#0D2818] group-hover:text-[#2A5E3F] transition-colors truncate">
                        {rel.name}
                      </div>
                      <div className="text-[11px] text-[#7A8680] truncate">{rel.locality}, {rel.city}</div>
                      <div className="text-xs font-semibold text-[#0D2818] mt-1">{rel.startingPriceDisplay}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Disclaimer Bar */}
        <div className="bg-[#FAF8F5] border-t border-[#DDD6C8] px-6 py-3 text-[11px] text-[#8C9690] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <span>
            *Indicative base prices subject to floor rise, preferred location charges, and statutory GST / registration.
          </span>
          <span className="font-medium text-[#55615B]">
            RERA ID: {project.reraId}
          </span>
        </div>

      </div>
    </div>
  );
};
