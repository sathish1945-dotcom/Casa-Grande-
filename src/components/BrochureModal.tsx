import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  CheckCircle2,
  Lock,
  Building,
  User,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Project } from '../lib/types';
import { saveLead, validatePhoneNumber, validateEmail } from '../lib/lead-store';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!validatePhoneNumber(phone)) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Save lead
    saveLead({
      fullName,
      phone,
      email,
      preferredCity: project.city,
      projectId: project.id,
      projectName: project.name,
      budgetRange: project.startingPriceDisplay,
      purchaseTimeline: '3 to 6 Months',
      source: 'Brochure Download',
      status: 'New',
      notes: `Downloaded architectural brochure for ${project.name} (${project.brochureFileName})`,
      consent: true,
    });

    // Generate formatted brochure text summary download
    const brochureText = `
================================================================================
ELVIRA CREST LUXURY REALTY — ARCHITECTURAL PROJECT SUMMARY
Project: ${project.name}
Tagline: ${project.tagline}
RERA Registration ID: ${project.reraId}
================================================================================

1. PROJECT OVERVIEW
Locality: ${project.locality}, ${project.city}
Address: ${project.address}
Property Typology: ${project.propertyType}
Status: ${project.status} (${project.possessionDate})
Starting Price: ${project.startingPriceDisplay}
Total Land Area: ${project.totalAcreage} Acres | Open Green Space: ${project.openSpacePercentage}%

2. ARCHITECTURAL VISION
${project.longDescription}

3. AVAILABLE CONFIGURATIONS
${project.configurations
  .map(
    (c) =>
      `• ${c.type} — Carpet: ${c.carpetAreaSqFt} sq.ft | Super Built-up: ${c.superBuiltUpSqFt} sq.ft | Indicative: ${c.priceDisplay} (${c.availableUnits} units available)`
  )
  .join('\n')}

4. CLUB & WELLNESS AMENITIES
${project.amenities.map((a) => `• ${a}`).join('\n')}

5. CONNECTIVITY & COMMUTE DISTANCES
${project.nearbyLandmarks.map((l) => `• ${l.name} (${l.type}): ${l.distanceKm} km (~${l.commuteTimeMins} mins)`).join('\n')}

DISCLAIMER:
All dimensions and specifications are indicative and subject to change as per architectural guidance.
All projects are strictly RERA registered.
Inquiries: +91 44 4890 2200 | concierge@elviracrest.com
================================================================================
`;

    const blob = new Blob([brochureText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_Brochure.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsSubmitting(false);
    setDownloadSuccess(true);
  };

  const handleReset = () => {
    setDownloadSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brochure-modal-title"
    >
      <div className="bg-[#FAF8F5] text-[#161D1A] w-full max-w-lg rounded-sm shadow-2xl overflow-hidden border border-[#DDD6C8] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0D2818] text-[#FAF8F5] p-5 flex items-center justify-between border-b border-[#1C3E29]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div>
              <h3 id="brochure-modal-title" className="font-serif text-base font-bold text-[#FAF8F5]">
                Download Architectural Dossier
              </h3>
              <p className="text-xs text-[#A8BEB2] truncate max-w-xs">
                {project.name} • {project.locality}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#183F29] text-[#DFCCA8] hover:text-[#FAF8F5]"
            aria-label="Close brochure modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {downloadSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#0D2818]">
              Brochure Downloaded Successfully
            </h4>
            <p className="text-xs text-[#55615B] max-w-xs mx-auto">
              Your architectural dossier for <strong>{project.name}</strong> has been generated and saved to your device.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-[#0D2818] text-[#FAF8F5] hover:bg-[#183F29]"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDownloadSubmit} className="p-6 space-y-4">
            <div className="p-2.5 rounded bg-[#F2ECE1] border border-[#C5A880]/50 flex items-center justify-between gap-2 text-xs">
              <span className="text-[#0D2818] font-medium">Sample Demo Mode</span>
              <button
                type="button"
                onClick={() => {
                  setFullName('Divya Lakshmanan (Sample Demo)');
                  setPhone('9444188220');
                  setEmail('divya.demo@elviracrest.com');
                  setErrorMsg(null);
                }}
                className="px-2.5 py-1 rounded bg-[#0D2818] text-[#FAF8F5] hover:bg-[#183F29] font-semibold text-[11px] uppercase tracking-wider shrink-0"
              >
                Auto-Fill Sample Buyer
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded bg-[#FFFFFF] border border-[#E5DFD3]">
              <img src={project.heroImage} alt={project.name} className="w-16 h-12 object-cover rounded" />
              <div>
                <div className="text-xs font-bold text-[#0D2818]">{project.name}</div>
                <div className="text-[11px] text-[#7A8680]">
                  RERA: {project.reraId} • {project.startingPriceDisplay}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#55615B]">
              Enter your details to receive the comprehensive architectural blueprint, master plan, and specification sheet.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#8C7A63] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Meenakshi Sundaram"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded pl-9 pr-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680] mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#8C7A63] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98401 22345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded pl-9 pr-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#8C7A63] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. meenakshi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded pl-9 pr-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#0D2818] hover:bg-[#183F29] text-[#FAF8F5] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#C5A880]" />
              <span>Download Official Brochure</span>
            </button>

            <div className="text-[10px] text-center text-[#8C9690] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              <span>Zero-Spam Policy. Verified RERA Developer Communication.</span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
