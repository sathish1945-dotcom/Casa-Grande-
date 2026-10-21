import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent storage for server instance
interface ServerLead {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  preferredCity?: string;
  projectId?: string;
  projectName?: string;
  budgetRange: string;
  purchaseTimeline: string;
  status: 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Qualified' | 'Closed' | 'Archived';
  source: string;
  notes?: string;
  consent: boolean;
  scheduledVisitDate?: string;
  scheduledVisitSlot?: string;
}

const leadsStore: ServerLead[] = [
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

// Helper: forward event to n8n webhook if configured
async function dispatchN8nWebhook(payload: Record<string, unknown>): Promise<{ success: boolean; message: string }> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'N8N_WEBHOOK_URL is not configured in .env' };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Elvira-Realty-Webhook-Client/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true, message: `Dispatched to n8n successfully (Status: ${res.status})` };
    }
    return { success: false, message: `n8n responded with status ${res.status}` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Webhook connection error: ${errorMsg}` };
  }
}

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------

// 1. AI Property Assistant (HomeFinder AI)
app.post('/api/assistant', async (req, res) => {
  try {
    const { query, propertiesCatalogue } = req.body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on server. Client fallback active.',
        deterministic: true,
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const catalogSummary = JSON.stringify(propertiesCatalogue || []);

    const systemInstruction = `
You are "HomeFinder AI", the elite architectural property advisory intelligence for Elvira Crest Luxury Realty in Tamil Nadu (Chennai, Coimbatore, Bengaluru).
Your objective: Help buyers discover matching residences, explain value propositions accurately, and invite them to schedule a private site visit.

CRITICAL FACTUAL GROUNDING RULES:
1. ONLY recommend and reference projects and configurations present in the following verified catalogue:
${catalogSummary}
2. NEVER invent property prices, BHK availability, amenities, possession dates, or RERA IDs.
3. If no project matches the buyer's criteria (e.g. unrealistic budget or unavailable city), politely and clearly state that no verified match exists in the current catalogue, explain why, and suggest the closest luxury alternative or offer human consultation.
4. Output your response as a valid JSON object matching the requested schema.
`;

    const prompt = `Buyer Inquiry: "${query}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Helpful, elegant response explaining matches and offering next steps.',
            },
            recommendedProjectIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of project IDs from the catalogue that match.',
            },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 4 suggested follow-up questions or actions for the buyer.',
            },
          },
          required: ['reply', 'recommendedProjectIds', 'suggestedFollowUps'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      res.status(500).json({ error: 'Empty response from model' });
      return;
    }

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: unknown) {
    console.error('AI assistant error:', error);
    res.status(500).json({
      error: 'Failed to process AI response',
      deterministic: true,
    });
  }
});

// 2. Leads Endpoints
app.get('/api/leads', (_req, res) => {
  res.json({ leads: leadsStore });
});

app.post('/api/leads', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      preferredCity,
      projectId,
      projectName,
      budgetRange,
      purchaseTimeline,
      source,
      notes,
      consent,
      scheduledVisitDate,
      scheduledVisitSlot,
      honeypot, // anti-spam
    } = req.body;

    // Spam check
    if (honeypot) {
      res.status(400).json({ error: 'Invalid submission' });
      return;
    }

    if (!fullName || !phone || !email || !budgetRange || !purchaseTimeline) {
      res.status(400).json({ error: 'Missing required lead qualification fields' });
      return;
    }

    if (!consent) {
      res.status(400).json({ error: 'Consent is required for sales communication' });
      return;
    }

    // Generate unique ID
    const id = `ELV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: ServerLead = {
      id,
      createdAt: new Date().toISOString(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      preferredCity,
      projectId,
      projectName,
      budgetRange,
      purchaseTimeline,
      status: scheduledVisitDate ? 'Site Visit Scheduled' : 'New',
      source: source || 'Website',
      notes,
      consent: true,
      scheduledVisitDate,
      scheduledVisitSlot,
    };

    leadsStore.unshift(newLead);

    // Optional automation trigger
    const webhookResult = await dispatchN8nWebhook({
      event: 'lead.created',
      timestamp: new Date().toISOString(),
      lead: newLead,
    });

    res.status(201).json({
      lead: newLead,
      webhookNotification: webhookResult,
    });
  } catch (error: unknown) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const leadIndex = leadsStore.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  if (status) {
    leadsStore[leadIndex].status = status;
  }
  if (notes !== undefined) {
    leadsStore[leadIndex].notes = notes;
  }

  res.json({ lead: leadsStore[leadIndex] });
});

// 3. Site Visit Booking Endpoint
app.post('/api/site-visits', (req, res) => {
  const {
    projectId,
    projectName,
    fullName,
    phone,
    email,
    preferredDate,
    preferredTimeSlot,
    cabAssistanceRequired,
    pickupLocation,
    accompanyingGuests,
    consent,
  } = req.body;

  if (!fullName || !phone || !email || !preferredDate || !preferredTimeSlot || !consent) {
    res.status(400).json({ error: 'Incomplete site visit reservation details' });
    return;
  }

  const bookingId = `SV-${Math.floor(100000 + Math.random() * 900000)}`;

  // Also record as a High Priority Lead
  const leadId = `ELV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const siteVisitLead: ServerLead = {
    id: leadId,
    createdAt: new Date().toISOString(),
    fullName,
    phone,
    email,
    projectId,
    projectName,
    budgetRange: 'Site Visit Scheduled',
    purchaseTimeline: 'Immediate (Within 30 Days)',
    status: 'Site Visit Scheduled',
    source: 'Site Visit Form',
    notes: `Booking Ref #${bookingId}. Guests: ${accompanyingGuests || 1}. Cab assistance: ${cabAssistanceRequired ? 'Yes - ' + (pickupLocation || 'Requested') : 'No'}.`,
    consent: true,
    scheduledVisitDate: preferredDate,
    scheduledVisitSlot: preferredTimeSlot,
  };

  leadsStore.unshift(siteVisitLead);

  res.status(201).json({
    bookingId,
    status: 'Confirmed Demonstration Request',
    message: 'Your site visit request has been recorded. An Elvira relationship manager will reach out with gate security passes.',
    leadId,
    bookingDetails: {
      projectId,
      preferredDate,
      preferredTimeSlot,
      cabAssistanceRequired,
    },
  });
});

// 4. n8n Automation Test Endpoint
app.post('/api/automation/test-n8n', async (req, res) => {
  const targetUrl = req.body.webhookUrl || process.env.N8N_WEBHOOK_URL;
  if (!targetUrl) {
    res.status(400).json({
      success: false,
      message: 'No webhook URL provided or found in environment variables.',
    });
    return;
  }

  try {
    const testPayload = {
      event: 'test.ping',
      sender: 'Elvira Crest Luxury Realty Automation Engine',
      timestamp: new Date().toISOString(),
      sampleLead: leadsStore[0] || null,
    };

    const webhookRes = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    if (webhookRes.ok) {
      res.json({
        success: true,
        statusCode: webhookRes.status,
        message: `Successfully reached n8n webhook at ${targetUrl}! HTTP Status: ${webhookRes.status}`,
      });
    } else {
      res.status(webhookRes.status).json({
        success: false,
        statusCode: webhookRes.status,
        message: `n8n server returned HTTP ${webhookRes.status}`,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      success: false,
      message: `Failed to connect to webhook URL: ${msg}`,
    });
  }
});

// -----------------------------------------------------------------------------
// Vite Server Integration (Dev vs Production)
// -----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Elvira Crest Realty server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
