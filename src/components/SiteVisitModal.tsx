import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Project, SiteVisitBookingRequest } from '../lib/types';
import { saveLead, validatePhoneNumber, validateEmail } from '../lib/lead-store';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject?: Project | null;
  allProjects: Project[];
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  isOpen,
  onClose,
  selectedProject,
  allProjects,
}) => {
  const [projectId, setProjectId] = useState<string>(selectedProject?.id || allProjects[0]?.id || '');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Future dates only: default tomorrow
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(tomorrow);
  const [timeSlot, setTimeSlot] = useState<SiteVisitBookingRequest['preferredTimeSlot']>('Morning (10:00 AM - 12:00 PM)');
  const [cabAssistance, setCabAssistance] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [guests, setGuests] = useState(2);
  const [consent, setConsent] = useState(true);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    bookingId: string;
    leadId: string;
    projectName: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentProject = allProjects.find((p) => p.id === projectId) || selectedProject || allProjects[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!validatePhoneNumber(phone)) {
      setErrorMessage('Please provide a valid 10-digit mobile number (+91)');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage('Please provide a valid email address');
      return;
    }
    if (!consent) {
      setErrorMessage('Consent is required to schedule and coordinate your visit');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try server endpoint
      const res = await fetch('/api/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProject.id,
          projectName: currentProject.name,
          fullName,
          phone,
          email,
          preferredDate,
          preferredTimeSlot: timeSlot,
          cabAssistanceRequired: cabAssistance,
          pickupLocation: pickupAddress,
          accompanyingGuests: guests,
          consent: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingResult({
          bookingId: data.bookingId,
          leadId: data.leadId,
          projectName: currentProject.name,
        });
      } else {
        throw new Error('Server fallback');
      }
    } catch {
      // Local deterministic fallback
      const savedLead = saveLead({
        fullName,
        phone,
        email,
        preferredCity: currentProject.city,
        projectId: currentProject.id,
        projectName: currentProject.name,
        budgetRange: currentProject.startingPriceDisplay,
        purchaseTimeline: 'Immediate (Within 30 Days)',
        source: 'Site Visit Form',
        status: 'Site Visit Scheduled',
        notes: `Simulated Demo Booking. Date: ${preferredDate}, Slot: ${timeSlot}. Cab: ${cabAssistance ? 'Yes (' + pickupAddress + ')' : 'No'}.`,
        consent: true,
        scheduledVisitDate: preferredDate,
        scheduledVisitSlot: timeSlot,
      });

      const fallbackBookingId = `SV-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingResult({
        bookingId: fallbackBookingId,
        leadId: savedLead.id,
        projectName: currentProject.name,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingResult(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-visit-title"
    >
      <div className="bg-[#FAF8F5] text-[#161D1A] w-full max-w-xl rounded-sm shadow-2xl overflow-hidden border border-[#DDD6C8] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0D2818] text-[#FAF8F5] p-5 flex items-center justify-between border-b border-[#1C3E29]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#C5A880]/20 border border-[#C5A880]/50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h3 id="site-visit-title" className="font-serif text-lg font-bold text-[#FAF8F5]">
                Book Accompanied Site Visit
              </h3>
              <p className="text-xs text-[#A8BEB2]">
                Experience architecture, construction quality & sample mock-ups firsthand
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#183F29] text-[#DFCCA8] hover:text-[#FAF8F5]"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {bookingResult ? (
          /* Confirmation State */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 mb-2">
                Demonstration Booking Simulation
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#0D2818]">
                Visit Request Registered
              </h4>
              <p className="text-xs text-[#55615B] mt-2 max-w-md mx-auto">
                Your demonstration request for <strong>{bookingResult.projectName}</strong> has been recorded in the sales CRM pipeline.
              </p>
            </div>

            {/* Pass details */}
            <div className="p-4 rounded bg-[#FFFFFF] border border-[#DDD6C8] text-xs max-w-md mx-auto space-y-2 text-left">
              <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                <span className="text-[#636F69]">Booking Reference:</span>
                <span className="font-mono font-bold text-[#0D2818]">{bookingResult.bookingId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                <span className="text-[#636F69]">CRM Lead ID:</span>
                <span className="font-mono text-[#0D2818]">{bookingResult.leadId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                <span className="text-[#636F69]">Date & Slot:</span>
                <span className="font-semibold text-[#0D2818]">{preferredDate} • {timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                <span className="text-[#636F69]">Primary Contact:</span>
                <span className="font-semibold text-[#0D2818]">{fullName} ({phone})</span>
              </div>
              {cabAssistance && (
                <div className="flex justify-between py-1">
                  <span className="text-[#636F69]">Chauffeur Pickup:</span>
                  <span className="font-semibold text-emerald-800">Requested ({pickupAddress || 'City address'})</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 text-left max-w-md mx-auto">
              <strong>Notice:</strong> This is an interactive demo simulation. In production, real WhatsApp and SMS credentials send entry QR security passes and sales relationship manager contact details.
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#0D2818] text-[#FAF8F5] hover:bg-[#183F29] transition-colors"
            >
              Done & Return to Portfolio
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* One-Click Sample Demo Banner */}
            <div className="p-3 rounded bg-[#F2ECE1] border border-[#C5A880]/50 flex items-center justify-between gap-2 text-xs">
              <div className="text-[#0D2818]">
                <span className="font-bold">Sample Demo Mode:</span> Test without typing real info
              </div>
              <button
                type="button"
                onClick={() => {
                  setFullName('Aravind Krishnan (Sample Demo)');
                  setPhone('9840955112');
                  setEmail('aravind.demo@elviracrest.com');
                  setCabAssistance(true);
                  setPickupAddress('Boat Club Road, Adyar, Chennai');
                  setGuests(3);
                  setErrorMessage(null);
                }}
                className="px-3 py-1.5 rounded bg-[#0D2818] text-[#FAF8F5] hover:bg-[#183F29] font-semibold text-[11px] uppercase tracking-wider shrink-0 transition-colors"
              >
                Auto-Fill Sample Buyer
              </button>
            </div>

            {/* Project Selection */}
            <div>
              <label htmlFor="site-visit-project-select" className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680] mb-1">
                Select Residence
              </label>
              <select
                id="site-visit-project-select"
                aria-label="Select Residence for site visit"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded px-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
              >
                {allProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.locality}, {p.city}) — From {p.startingPriceDisplay}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Slot Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="site-visit-date-input" className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680] mb-1">
                  Preferred Date
                </label>
                <input
                  id="site-visit-date-input"
                  aria-label="Preferred Date for site visit"
                  type="date"
                  min={tomorrow}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded px-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                />
              </div>

              <div>
                <label htmlFor="site-visit-time-select" className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680] mb-1">
                  Time Slot
                </label>
                <select
                  id="site-visit-time-select"
                  aria-label="Time Slot for site visit"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as SiteVisitBookingRequest['preferredTimeSlot'])}
                  className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded px-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                >
                  <option value="Morning (10:00 AM - 12:00 PM)">Morning (10:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
                  <option value="Evening (04:30 PM - 06:30 PM)">Evening (04:30 PM - 06:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-3 pt-2 border-t border-[#EDE7DC]">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#8C7A63] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Ramachandran"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded pl-9 pr-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680] mb-1">
                    Mobile Phone *
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
                      placeholder="e.g. suresh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded pl-9 pr-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                    />
                  </div>
                </div>
              </div>

              {/* Accompanying Guests */}
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[#636F69]">Accompanying Family Members:</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGuests(n)}
                      className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                        guests === n
                          ? 'bg-[#0D2818] text-[#FAF8F5]'
                          : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chauffeur Assistance Toggle */}
              <div className="p-3 bg-[#FFFFFF] border border-[#DDD6C8] rounded space-y-2">
                <label className="flex items-center justify-between cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#C5A880]" />
                    <span className="font-medium text-[#161D1A]">Complimentary Chauffeur Transit</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cabAssistance}
                    onChange={(e) => setCabAssistance(e.target.checked)}
                    className="accent-[#0D2818] w-4 h-4 cursor-pointer"
                  />
                </label>
                {cabAssistance && (
                  <input
                    type="text"
                    placeholder="Enter pickup locality in Chennai / Coimbatore..."
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded px-3 py-1.5 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                  />
                )}
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-2 pt-1 text-[11px] text-[#636F69] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="accent-[#0D2818] mt-0.5"
                />
                <span>
                  I consent to receive verified property documentation, security gate access passes, and call updates regarding {currentProject.name} in accordance with RERA guidelines.
                </span>
              </label>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded text-xs font-semibold uppercase tracking-wider bg-[#C5A880] hover:bg-[#D4BC9B] text-[#0D2818] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Request...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Accompanied Site Visit</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-[#8C9690] mt-2">
                Demonstration flow: Instantly queues lead into the Staff CRM and triggers automation.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
