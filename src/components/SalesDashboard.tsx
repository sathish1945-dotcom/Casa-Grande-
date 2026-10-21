import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  Zap,
  TrendingUp,
  Users,
  ShieldCheck,
  Send,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Lead, Project } from '../lib/types';
import {
  getStoredLeads,
  updateLeadStatus,
  exportLeadsToCsv,
  calculateLeadIntentScore,
} from '../lib/lead-store';

interface SalesDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  allProjects: Project[];
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  isOpen,
  onClose,
  allProjects,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Leads & CRM state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'automation'>('pipeline');

  // n8n Webhook Test state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load leads
  useEffect(() => {
    if (isOpen) {
      setLeads(getStoredLeads());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo passcode
    if (passcode === 'admin123' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const updated = updateLeadStatus(leadId, newStatus);
    if (updated) {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
    }
  };

  const handleExportCsv = () => {
    const csvContent = exportLeadsToCsv(filteredLeads);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `elvira_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestN8n = async () => {
    setWebhookTesting(true);
    setWebhookResult(null);
    try {
      const res = await fetch('/api/automation/test-n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl }),
      });
      const data = await res.json();
      setWebhookResult({
        success: data.success,
        message: data.message || 'Webhook response received',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setWebhookResult({
        success: false,
        message: `Network error: ${msg}`,
      });
    } finally {
      setWebhookTesting(false);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'All' && lead.status !== statusFilter) return false;
    if (projectFilter !== 'All' && lead.projectId !== projectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.fullName.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchEmail = lead.email.toLowerCase().includes(q);
      const matchProject = (lead.projectName || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchProject) return false;
    }
    return true;
  });

  // KPI calculations
  const totalLeads = leads.length;
  const siteVisitsCount = leads.filter((l) => l.status === 'Site Visit Scheduled' || l.scheduledVisitDate).length;
  const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length;
  const newTodayCount = leads.filter((l) => l.status === 'New').length;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sales-dashboard-title"
    >
      <div className="bg-[#FAF8F5] text-[#161D1A] w-full max-w-6xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-[#DDD6C8]">
        
        {/* Top Header */}
        <div className="bg-[#0A1F13] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#1C3E29]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="sales-dashboard-title" className="font-serif text-lg font-bold text-[#FAF8F5]">
                  Sales Operations & Lead Qualification CRM
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#183F29] text-[#D8BA8F] uppercase font-semibold">
                  Restricted Staff Access
                </span>
              </div>
              <p className="text-xs text-[#A8BEB2]">
                Elvira Crest Realty • Authorized Acquisitions & Client Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#183F29] text-[#DFCCA8] hover:text-[#FAF8F5]"
            aria-label="Close sales dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Passcode Gate */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#0D2818] text-[#C5A880] flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-serif text-2xl font-bold text-[#0D2818]">
                Authorized Staff Authentication
              </h4>
              <p className="text-xs text-[#636F69] mt-1">
                Enter your administrative PIN to access lead records, site-visit schedules, and workflow webhooks.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter staff passcode (demo: admin123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD6C8] rounded px-4 py-2.5 text-sm text-center tracking-widest text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                />
              </div>

              {authError && (
                <p className="text-xs text-red-600 font-medium">
                  Invalid passcode. Use demo passcode: <code>admin123</code>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#0D2818] text-[#FAF8F5] hover:bg-[#183F29] transition-all shadow-sm"
              >
                Authenticate & Access Pipeline
              </button>
            </form>

            <div className="text-[11px] text-[#8C9690] border-t border-[#EDE7DC] pt-4 w-full">
              Demo Access PIN: <span className="font-mono font-bold text-[#0D2818]">admin123</span>
            </div>
          </div>
        ) : (
          /* Authenticated CRM Panel */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#FFFFFF] p-4 rounded border border-[#E5DFD3] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#7A8680] font-semibold uppercase tracking-wider">
                  <span>Total Leads</span>
                  <Users className="w-4 h-4 text-[#0D2818]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#0D2818] mt-1">
                  {totalLeads}
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  +{newTodayCount} new inquiries
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-4 rounded border border-[#E5DFD3] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#7A8680] font-semibold uppercase tracking-wider">
                  <span>Site Visits</span>
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#0D2818] mt-1">
                  {siteVisitsCount}
                </div>
                <div className="text-[11px] text-[#636F69] mt-0.5">
                  Physical appointments
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-4 rounded border border-[#E5DFD3] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#7A8680] font-semibold uppercase tracking-wider">
                  <span>Qualified Buyers</span>
                  <TrendingUp className="w-4 h-4 text-[#2A5E3F]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#0D2818] mt-1">
                  {qualifiedCount}
                </div>
                <div className="text-[11px] text-[#636F69] mt-0.5">
                  High purchasing intent
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-4 rounded border border-[#E5DFD3] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#7A8680] font-semibold uppercase tracking-wider">
                  <span>Pipeline Value</span>
                  <Zap className="w-4 h-4 text-[#C5A880]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#0D2818] mt-1">
                  ₹32.4 Cr
                </div>
                <div className="text-[11px] text-[#636F69] mt-0.5">
                  Tamil Nadu Portfolio
                </div>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="border-b border-[#DDD6C8] flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'pipeline'
                      ? 'border-[#0D2818] text-[#0D2818]'
                      : 'border-transparent text-[#7A8680] hover:text-[#0D2818]'
                  }`}
                >
                  Active Lead Pipeline ({filteredLeads.length})
                </button>
                <button
                  onClick={() => setActiveTab('automation')}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'automation'
                      ? 'border-[#0D2818] text-[#0D2818]'
                      : 'border-transparent text-[#7A8680] hover:text-[#0D2818]'
                  }`}
                >
                  n8n & WhatsApp Integrations
                </button>
              </div>

              {activeTab === 'pipeline' && (
                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded text-xs font-semibold bg-[#FFFFFF] border border-[#DDD6C8] text-[#0D2818] hover:bg-[#F2ECE1] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Export to CSV</span>
                </button>
              )}
            </div>

            {/* Tab 1: Pipeline Table */}
            {activeTab === 'pipeline' && (
              <div className="space-y-4">
                
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded border border-[#E5DFD3]">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-[#8C7A63] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search lead by name, phone, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded pl-8 pr-3 py-1.5 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-[#FAF8F5] border border-[#DDD6C8] rounded px-2.5 py-1.5 text-xs text-[#161D1A]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Closed">Closed</option>
                    </select>

                    {/* Project filter */}
                    <select
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                      className="bg-[#FAF8F5] border border-[#DDD6C8] rounded px-2.5 py-1.5 text-xs text-[#161D1A]"
                    >
                      <option value="All">All Projects</option>
                      {allProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Leads Table */}
                <div className="overflow-x-auto rounded border border-[#E5DFD3] bg-[#FFFFFF]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E5DFD3] text-[11px] font-semibold uppercase tracking-wider text-[#7A8680]">
                      <tr>
                        <th className="p-3">Lead ID & Date</th>
                        <th className="p-3">Prospect Details</th>
                        <th className="p-3">Interested Project</th>
                        <th className="p-3">Budget & Timeline</th>
                        <th className="p-3">Source & Score</th>
                        <th className="p-3">Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE1]">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-[#8C9690]">
                            No matching lead records found.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => {
                          const intent = calculateLeadIntentScore(lead);
                          return (
                            <tr key={lead.id} className="hover:bg-[#FAF8F5] transition-colors">
                              <td className="p-3 align-top">
                                <span className="font-mono font-bold text-[#0D2818] block">{lead.id}</span>
                                <span className="text-[10px] text-[#8C9690]">
                                  {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </td>

                              <td className="p-3 align-top">
                                <div className="font-semibold text-[#161D1A]">{lead.fullName}</div>
                                <div className="text-[11px] text-[#55615B] flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-[#C5A880]" /> {lead.phone}
                                </div>
                                <div className="text-[11px] text-[#55615B] flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3 text-[#C5A880]" /> {lead.email}
                                </div>
                                {lead.notes && (
                                  <div className="mt-1 text-[10px] text-[#7A8680] italic bg-[#F8F5EE] p-1 rounded max-w-xs">
                                    {lead.notes}
                                  </div>
                                )}
                              </td>

                              <td className="p-3 align-top">
                                <span className="font-medium text-[#0D2818] block">
                                  {lead.projectName || 'General Inquiry'}
                                </span>
                                {lead.scheduledVisitDate && (
                                  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-900 border border-amber-200">
                                    <Calendar className="w-2.5 h-2.5" /> Visit: {lead.scheduledVisitDate}
                                  </span>
                                )}
                              </td>

                              <td className="p-3 align-top">
                                <span className="font-semibold text-[#161D1A] block">{lead.budgetRange}</span>
                                <span className="text-[11px] text-[#636F69]">{lead.purchaseTimeline}</span>
                              </td>

                              <td className="p-3 align-top">
                                <span className="text-[11px] text-[#55615B] block">{lead.source}</span>
                                <span
                                  className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    intent.tier === 'High Priority'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : intent.tier === 'Warm Prospect'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-neutral-100 text-neutral-700'
                                  }`}
                                >
                                  {intent.score}/100 • {intent.tier}
                                </span>
                              </td>

                              <td className="p-3 align-top">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                                  className="bg-[#FFFFFF] border border-[#DDD6C8] rounded px-2 py-1 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                                  <option value="Qualified">Qualified</option>
                                  <option value="Closed">Closed</option>
                                  <option value="Archived">Archived</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Automation & Integrations */}
            {activeTab === 'automation' && (
              <div className="space-y-6">
                
                {/* n8n Webhook Configuration Box */}
                <div className="p-5 rounded bg-[#FFFFFF] border border-[#E5DFD3] space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#C5A880]" />
                    <h4 className="font-serif text-base font-bold text-[#0D2818]">
                      n8n Workflow Automation Bridge
                    </h4>
                  </div>
                  <p className="text-xs text-[#55615B]">
                    When enabled, every verified lead and site-visit request is dispatched in real-time as a JSON payload to your custom n8n workflow for automated CRM sync, WhatsApp routing, and Slack notifications.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A8680]">
                      n8n Webhook Listener URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://n8n.yourcompany.com/webhook/realty-leads"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="flex-1 bg-[#FAF8F5] border border-[#DDD6C8] rounded px-3 py-2 text-xs text-[#161D1A] focus:outline-none focus:border-[#0D2818]"
                      />
                      <button
                        onClick={handleTestN8n}
                        disabled={webhookTesting}
                        className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-[#0D2818] text-[#FAF8F5] hover:bg-[#183F29] disabled:opacity-50 transition-colors"
                      >
                        {webhookTesting ? 'Pinging...' : 'Send Test Ping'}
                      </button>
                    </div>
                  </div>

                  {webhookResult && (
                    <div
                      className={`p-3 rounded text-xs flex items-center gap-2 ${
                        webhookResult.success
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border border-amber-200 text-amber-800'
                      }`}
                    >
                      {webhookResult.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{webhookResult.message}</span>
                    </div>
                  )}
                </div>

                {/* WhatsApp Cloud Platform Integration Status */}
                <div className="p-5 rounded bg-[#FFFFFF] border border-[#E5DFD3] space-y-4">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-serif text-base font-bold text-[#0D2818]">
                      WhatsApp Business Cloud Platform
                    </h4>
                  </div>
                  <p className="text-xs text-[#55615B]">
                    Enables verified WhatsApp notifications, brochure delivery, and gated QR passes to high-intent Tamil Nadu luxury buyers.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded bg-[#FAF8F5] border border-[#DDD6C8]">
                      <div className="text-[10px] uppercase font-bold text-[#7A8680]">Status</div>
                      <div className="font-semibold text-emerald-800 mt-1">Ready for Meta Approval</div>
                    </div>
                    <div className="p-3 rounded bg-[#FAF8F5] border border-[#DDD6C8]">
                      <div className="text-[10px] uppercase font-bold text-[#7A8680]">Phone Number ID</div>
                      <div className="font-mono text-[#161D1A] mt-1 truncate">Configured via .env</div>
                    </div>
                    <div className="p-3 rounded bg-[#FAF8F5] border border-[#DDD6C8]">
                      <div className="text-[10px] uppercase font-bold text-[#7A8680]">Template Approved</div>
                      <div className="font-semibold text-[#161D1A] mt-1">elvira_site_visit_pass_v1</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
