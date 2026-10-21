import React from 'react';
import {
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Trees,
} from 'lucide-react';
import { Project } from '../lib/types';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  onBookSiteVisit: (project: Project) => void;
  onDownloadBrochure: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  onBookSiteVisit,
  onDownloadBrochure,
}) => {
  // Status badge styling
  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Ready to Move':
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-600/40';
      case 'Under Construction':
        return 'bg-[#291B0C]/90 text-[#F5C27A] border-[#915B1E]/40';
      case 'New Launch':
        return 'bg-[#181F3B]/90 text-[#9BB7F5] border-[#364A85]/40';
      default:
        return 'bg-neutral-800 text-neutral-200 border-neutral-700';
    }
  };

  // Config BHK summary: e.g. "2, 3 & 4 BHK"
  const bhkSet = Array.from(new Set(project.configurations.map((c) => c.bhk))).sort();
  const bhkSummary = bhkSet.length > 1
    ? `${bhkSet.slice(0, -1).join(', ')} & ${bhkSet.slice(-1)} BHK`
    : `${bhkSet[0]} BHK`;

  // Carpet area range
  const minCarpet = Math.min(...project.configurations.map((c) => c.carpetAreaSqFt));
  const maxCarpet = Math.max(...project.configurations.map((c) => c.carpetAreaSqFt));

  return (
    <article
      className="group bg-[#FFFFFF] rounded-sm border border-[#E8E2D7] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
      aria-labelledby={`project-title-${project.id}`}
    >
      {/* Property Hero Image with Status Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE5DC] cursor-pointer" onClick={() => onSelectProject(project)}>
        <img
          src={project.heroImage}
          alt={`${project.name} - ${project.locality}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className={`px-2.5 py-1 rounded text-[11px] font-semibold tracking-wider uppercase border backdrop-blur-sm ${getStatusBadge(project.status)}`}>
            {project.status}
          </span>
          <span className="px-2.5 py-1 rounded text-[11px] font-medium tracking-wide bg-[#0D2818]/90 text-[#E8DFD0] border border-[#2B543D] backdrop-blur-sm flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            RERA Reg.
          </span>
        </div>

        {/* Bottom Property Typology Pill */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-[#0D2818]/85 text-[#FAF8F5] border border-[#2B543D]/50 backdrop-blur-sm">
            {project.propertyType}
          </span>
        </div>
      </div>

      {/* Property Body Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Title */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B7570] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span className="truncate">{project.locality}, {project.city}</span>
          </div>

          <h3
            id={`project-title-${project.id}`}
            onClick={() => onSelectProject(project)}
            className="font-serif text-xl font-bold text-[#14261C] hover:text-[#25603D] cursor-pointer transition-colors leading-snug"
          >
            {project.name}
          </h3>

          <p className="text-xs text-[#525B56] mt-1.5 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Quick Specifications Grid */}
          <div className="mt-4 pt-3 border-t border-[#F0EBE1] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#FAF8F5] p-2 rounded border border-[#EDE7DC]">
              <div className="text-[10px] uppercase font-semibold text-[#8C7A63] flex items-center justify-center gap-1">
                <Layers className="w-3 h-3 text-[#C5A880]" /> Typology
              </div>
              <div className="font-semibold text-[#161D1A] mt-0.5">{bhkSummary}</div>
            </div>

            <div className="bg-[#FAF8F5] p-2 rounded border border-[#EDE7DC]">
              <div className="text-[10px] uppercase font-semibold text-[#8C7A63] flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-[#C5A880]" /> Possession
              </div>
              <div className="font-semibold text-[#161D1A] mt-0.5 truncate">{project.possessionDate}</div>
            </div>

            <div className="bg-[#FAF8F5] p-2 rounded border border-[#EDE7DC]">
              <div className="text-[10px] uppercase font-semibold text-[#8C7A63] flex items-center justify-center gap-1">
                <Trees className="w-3 h-3 text-[#C5A880]" /> Open Area
              </div>
              <div className="font-semibold text-[#161D1A] mt-0.5">{project.openSpacePercentage}% Green</div>
            </div>
          </div>

          {/* Carpet Area Specification */}
          <div className="mt-3 text-[11px] text-[#636F69] flex items-center justify-between">
            <span>Carpet Area:</span>
            <span className="font-medium text-[#1A2620]">
              {minCarpet} - {maxCarpet} sq.ft
            </span>
          </div>
        </div>

        {/* Pricing & Call to Actions */}
        <div className="mt-5 pt-4 border-t border-[#EDE7DC]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#7A8680] block">Starting Indicative Price</span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl font-bold text-[#0D2818]">
                  {project.startingPriceDisplay}
                </span>
                <span className="text-[10px] text-[#8C7A63]" title="Excludes statutory registration and taxes">*Govt. taxes extra</span>
              </div>
            </div>
            
            <button
              onClick={() => onDownloadBrochure(project)}
              className="text-xs text-[#2A5E3F] hover:text-[#0D2818] font-medium flex items-center gap-1 p-1 rounded hover:bg-[#F2EFE8] transition-colors"
              title="Download Architectural Brochure"
              aria-label={`Download brochure for ${project.name}`}
            >
              <Download className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Brochure</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectProject(project)}
              className="py-2.5 px-3 rounded text-xs font-semibold tracking-wider uppercase border border-[#0D2818] text-[#0D2818] hover:bg-[#0D2818] hover:text-[#FAF8F5] transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onBookSiteVisit(project)}
              className="py-2.5 px-3 rounded text-xs font-semibold tracking-wider uppercase bg-[#C5A880] hover:bg-[#D4BC9B] text-[#0D2818] transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm"
            >
              <span>Site Visit</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
