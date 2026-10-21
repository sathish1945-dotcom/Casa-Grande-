import { Lead } from './types';

const STORAGE_KEY = 'elvira_realty_leads_v1';

// Seed sample leads for demonstrating the sales CRM pipeline
const INITIAL_SAMPLE_LEADS: Lead[] = [
  {
    id: 'ELV-2026-8911',
    createdAt: '2026-10-20T14:30:00.000Z',
    fullName: 'Suresh Ramachandran',
    phone: '+91 98401 22345',
    email: 'suresh.r@techholdings.in',
    preferredCity: 'Chennai',
    projectId: 'elvira-marina-bay',
    projectName: 'Elvira Marina Bay',
    budgetRange: '₹3 Cr - ₹5 Cr',
    purchaseTimeline: 'Immediate (Within 30 Days)',
    status: 'Site Visit Scheduled',
    source: 'HomeFinder AI',
    notes: 'Looking for 4 BHK sea-facing sky villa on high floor. Requested Saturday morning pick-up.',
    consent: true,
    scheduledVisitDate: '2026-10-24',
    scheduledVisitSlot: 'Morning (10:00 AM - 12:00 PM)',
  },
  {
    id: 'ELV-2026-8912',
    createdAt: '2026-10-20T16:15:00.000Z',
    fullName: 'Dr. Anandhi Natarajan',
    phone: '+91 94440 98765',
    email: 'anandhi.nat@apollohealth.org',
    preferredCity: 'Chennai',
    projectId: 'the-sovereign-boat-club',
    projectName: 'The Sovereign at Boat Club',
    budgetRange: '₹6 Cr - ₹10 Cr',
    purchaseTimeline: '3 to 6 Months',
    status: 'Qualified',
    source: 'Project Details',
    notes: 'Interested in bespoke floor duplex, private elevator configuration.',
    consent: true,
  },
  {
    id: 'ELV-2026-8913',
    createdAt: '2026-10-21T09:20:00.000Z',
    fullName: 'Karthik Subramanian',
    phone: '+91 98845 67123',
    email: 'karthik.s@cloudscale.io',
    preferredCity: 'Chennai',
    projectId: 'aura-zenith-tech-park',
    projectName: 'Aura Zenith Tech-Park',
    budgetRange: '₹75 Lakh - ₹1 Cr',
    purchaseTimeline: 'Immediate (Within 30 Days)',
    status: 'New',
    source: 'Homepage Hero',
    notes: 'Senior Architect at ELCOT SEZ. Wants ready to move 2 or 3 BHK with clubhouse.',
    consent: true,
  },
  {
    id: 'ELV-2026-8914',
    createdAt: '2026-10-21T11:45:00.000Z',
    fullName: 'Meenakshi Sundaram',
    phone: '+91 98940 33411',
    email: 'meenakshi.s@textilecorp.com',
    preferredCity: 'Coimbatore',
    projectId: 'verdant-hills-estate',
    projectName: 'Verdant Hills Estate',
    budgetRange: '₹1.5 Cr - ₹3 Cr',
    purchaseTimeline: '1 to 3 Months',
    status: 'Contacted',
    source: 'Brochure Download',
    notes: 'Inquired about Race Course road villa private backyard space.',
    consent: true,
  },
];

/**
 * Validates 10-digit Indian mobile number or international phone format
 */
export function validatePhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  // Valid if 10 digits (e.g. 9840123456) or 12 digits starting with 91 (e.g. 919840123456)
  return digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Computes qualification intent score (1 to 100) based on buyer signals
 */
export function calculateLeadIntentScore(lead: Lead): {
  score: number;
  tier: 'High Priority' | 'Warm Prospect' | 'Nurture';
  reasons: string[];
} {
  let score = 30; // base score for completing enquiry
  const reasons: string[] = ['Completed verified enquiry form'];

  if (lead.scheduledVisitDate) {
    score += 35;
    reasons.push('Requested physical site-visit appointment');
  }

  if (lead.purchaseTimeline.toLowerCase().includes('immediate') || lead.purchaseTimeline.includes('30 Days')) {
    score += 20;
    reasons.push('Immediate purchase timeline');
  } else if (lead.purchaseTimeline.includes('1 to 3 Months')) {
    score += 10;
    reasons.push('Near-term purchase timeline');
  }

  if (lead.budgetRange.includes('Cr') || lead.budgetRange.includes('₹2 Cr') || lead.budgetRange.includes('₹5 Cr')) {
    score += 15;
    reasons.push('Ultra-luxury capital allocation');
  }

  const clampedScore = Math.min(100, score);
  let tier: 'High Priority' | 'Warm Prospect' | 'Nurture' = 'Nurture';
  if (clampedScore >= 75) tier = 'High Priority';
  else if (clampedScore >= 50) tier = 'Warm Prospect';

  return { score: clampedScore, tier, reasons };
}

/**
 * Lead Store functions: reads/writes to localStorage with memory fallback
 */
export function getStoredLeads(): Lead[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LEADS));
      return INITIAL_SAMPLE_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SAMPLE_LEADS;
  } catch {
    return INITIAL_SAMPLE_LEADS;
  }
}

export function saveLead(newLeadData: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: Lead['status'] }): Lead {
  const existing = getStoredLeads();
  const id = `ELV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const fullLead: Lead = {
    ...newLeadData,
    id,
    createdAt: new Date().toISOString(),
    status: newLeadData.status || 'New',
  };

  const updated = [fullLead, ...existing];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage quota or error
    }
  }

  // Also trigger optional background webhook to n8n if configured
  notifyWebhook(fullLead);

  return fullLead;
}

export function updateLeadStatus(id: string, status: Lead['status'], notes?: string): Lead | null {
  const leads = getStoredLeads();
  let updatedLead: Lead | null = null;
  const next = leads.map((l) => {
    if (l.id === id) {
      updatedLead = {
        ...l,
        status,
        notes: notes !== undefined ? notes : l.notes,
      };
      return updatedLead;
    }
    return l;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // fallback
    }
  }

  return updatedLead;
}

/**
 * Dispatches optional webhook payload to n8n or CRM listener
 */
async function notifyWebhook(lead: Lead): Promise<void> {
  const webhookUrl = typeof window !== 'undefined' ? (window as unknown as { VITE_N8N_WEBHOOK_URL?: string }).VITE_N8N_WEBHOOK_URL : undefined;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'lead.created',
        timestamp: new Date().toISOString(),
        lead,
      }),
    });
  } catch {
    // quiet fail for optional webhook
  }
}

/**
 * Generates CSV string for sales team download
 */
export function exportLeadsToCsv(leads: Lead[]): string {
  const headers = [
    'Lead ID',
    'Date',
    'Full Name',
    'Phone',
    'Email',
    'Preferred City',
    'Project Name',
    'Budget Range',
    'Purchase Timeline',
    'Status',
    'Source',
    'Site Visit Date',
    'Site Visit Slot',
    'Notes',
  ];

  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${new Date(l.createdAt).toLocaleDateString('en-IN')}"`,
    `"${(l.fullName || '').replace(/"/g, '""')}"`,
    `"${l.phone}"`,
    `"${l.email}"`,
    `"${l.preferredCity || ''}"`,
    `"${(l.projectName || '').replace(/"/g, '""')}"`,
    `"${l.budgetRange}"`,
    `"${l.purchaseTimeline}"`,
    `"${l.status}"`,
    `"${l.source}"`,
    `"${l.scheduledVisitDate || 'N/A'}"`,
    `"${l.scheduledVisitSlot || 'N/A'}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
