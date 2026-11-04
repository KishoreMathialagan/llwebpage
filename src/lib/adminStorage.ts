export type LeadStatus = 'New' | 'In Review' | 'Contacted' | 'Proposal Sent' | 'Won' | 'Lost'

export type LeadPriority = 'High' | 'Medium' | 'Low'

export interface Lead {
  id: string
  name: string
  email: string
  company: string
  service: string
  details: string
  status: LeadStatus
  estimatedValue: number
  priority: LeadPriority
  createdAt: string
  notes?: string
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

export interface Invoice {
  id: string
  invoiceNumber: string
  client: string
  company: string
  service: string
  amount: number
  issueDate: string
  dueDate: string
  status: InvoiceStatus
  notes?: string
}

export interface PerformanceMetric {
  name: string
  key: 'lcp' | 'inp' | 'cls' | 'ttfb' | 'uptime' | 'score'
  value: string | number
  unit: string
  rating: 'good' | 'needs-improvement' | 'poor'
  description: string
  benchmark: string
}

const STORAGE_KEYS = {
  LEADS: 'leadloom_admin_leads_v1',
  INVOICES: 'leadloom_admin_invoices_v1',
  PERF_AUDITS: 'leadloom_admin_audits_v1',
}

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-001',
    name: 'Elena Rostova',
    email: 'elena@novaaero.io',
    company: 'Nova Aerospace',
    service: 'Digital Strategy',
    details: 'Need a comprehensive brand positioning & digital market penetration roadmap for our sustainable aviation launch.',
    status: 'Proposal Sent',
    estimatedValue: 24500,
    priority: 'High',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    notes: 'Pitch deck presented to VP of Marketing on Monday. Very receptive to the interactive web experience concept.',
  },
  {
    id: 'lead-002',
    name: 'Marcus Vance',
    email: 'm.vance@vanguardfin.com',
    company: 'Vanguard Capital',
    service: 'Website & Conversion',
    details: 'Looking to overhaul our private wealth client portal and corporate branding ahead of Series B announce.',
    status: 'In Review',
    estimatedValue: 38000,
    priority: 'High',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    notes: 'Requested case studies for enterprise fintech work.',
  },
  {
    id: 'lead-003',
    name: 'Sophie Lin',
    email: 'sophie@lumina-health.co',
    company: 'Lumina Health',
    service: 'Performance Marketing',
    details: 'Scaling our direct-to-consumer longevity supplements. Current CAC is too high on Meta; need omnichannel campaign redesign.',
    status: 'Contacted',
    estimatedValue: 16500,
    priority: 'Medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 78).toISOString(),
    notes: 'Audit of their current ad accounts shows 34% ad spend wasted on misconfigured broad targeting.',
  },
  {
    id: 'lead-004',
    name: 'Liam Gallagher',
    email: 'liam@arcadiancraft.com',
    company: 'Arcadian Spirits',
    service: 'Branding & Creative',
    details: 'Artisan distillery rebranding. Looking for complete bespoke packaging direction, 3D web showcase, and launch event creative.',
    status: 'Won',
    estimatedValue: 42000,
    priority: 'High',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString(),
    notes: 'Contract signed! Discovery workshop scheduled for next Tuesday.',
  },
  {
    id: 'lead-005',
    name: 'Dr. Tariq Al-Mansoor',
    email: 'tariq@synapse-genetics.org',
    company: 'Synapse BioLabs',
    service: 'Search Engine Optimization',
    details: 'We want high organic authority for therapeutic genomics keywords and academic citations.',
    status: 'New',
    estimatedValue: 12000,
    priority: 'Medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    notes: 'Inbound through website contact form.',
  },
  {
    id: 'lead-006',
    name: 'Chloe Dubois',
    email: 'chloe@atelier-parisian.fr',
    company: 'Atelier Minimaliste',
    service: 'Website & Conversion',
    details: 'High-end luxury fashion brand seeking editorial aesthetic with 3D garment exploration and ultra-fast mobile experience.',
    status: 'Proposal Sent',
    estimatedValue: 29000,
    priority: 'High',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 95).toISOString(),
    notes: 'Sent tailored proposal with GSAP interactive concept demo.',
  },
  {
    id: 'lead-007',
    name: 'Julian Hayes',
    email: 'jhayes@strata-proptech.com',
    company: 'Strata Real Estate',
    service: 'Social Media & Content',
    details: 'Need end-to-end video storytelling and LinkedIn leadership presence for commercial real estate developments.',
    status: 'Lost',
    estimatedValue: 9500,
    priority: 'Low',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
    notes: 'Decided to hire in-house content creator instead.',
  },
]

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-042',
    client: 'Arcadian Spirits',
    company: 'Arcadian Spirits Ltd',
    service: 'Branding & Creative (Phase 1)',
    amount: 14000,
    issueDate: '2026-10-18',
    dueDate: '2026-11-01',
    status: 'Paid',
    notes: 'Deposit paid on time via wire transfer.',
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-043',
    client: 'Nova Aerospace',
    company: 'Nova Aerospace',
    service: 'Brand Positioning Discovery',
    amount: 8500,
    issueDate: '2026-10-25',
    dueDate: '2026-11-08',
    status: 'Pending',
    notes: 'Awaiting finance department batch processing.',
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-044',
    client: 'Kinetix Robotics',
    company: 'Kinetix AI Inc.',
    service: 'Performance Marketing Retainer (Oct)',
    amount: 6200,
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    status: 'Paid',
    notes: 'Recurring monthly marketing retainer.',
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-045',
    client: 'Sonder Architecture',
    company: 'Sonder Studio',
    service: 'Interactive Web Experience & 3D',
    amount: 19500,
    issueDate: '2026-09-20',
    dueDate: '2026-10-20',
    status: 'Overdue',
    notes: 'Followed up on Nov 2nd with CFO; payment promised by Friday.',
  },
  {
    id: 'inv-105',
    invoiceNumber: 'INV-2026-046',
    client: 'Kinetix Robotics',
    company: 'Kinetix AI Inc.',
    service: 'Performance Marketing Retainer (Nov)',
    amount: 6200,
    issueDate: '2026-11-01',
    dueDate: '2026-11-15',
    status: 'Pending',
  },
  {
    id: 'inv-106',
    invoiceNumber: 'INV-2026-047',
    client: 'Meridian Carbon',
    company: 'Meridian Climate Group',
    service: 'SEO & Organic Growth Roadmap',
    amount: 9800,
    issueDate: '2026-10-12',
    dueDate: '2026-10-26',
    status: 'Paid',
  },
]

export function getLeads(): Lead[] {
  if (typeof window === 'undefined') return INITIAL_LEADS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS))
      return INITIAL_LEADS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_LEADS
  }
}

export function saveLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads))
  } catch (e) {
    console.error('Failed to save leads to localStorage:', e)
  }
}

export function addLead(lead: Omit<Lead, 'id' | 'createdAt'>): Lead {
  const current = getLeads()
  const newLead: Lead = {
    ...lead,
    id: `lead-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  }
  const updated = [newLead, ...current]
  saveLeads(updated)
  return newLead
}

export function updateLeadStatus(id: string, status: LeadStatus): void {
  const current = getLeads()
  const updated = current.map((lead) => (lead.id === id ? { ...lead, status } : lead))
  saveLeads(updated)
}

export function updateLead(id: string, changes: Partial<Lead>): void {
  const current = getLeads()
  const updated = current.map((lead) => (lead.id === id ? { ...lead, ...changes } : lead))
  saveLeads(updated)
}

export function deleteLead(id: string): void {
  const current = getLeads()
  const updated = current.filter((lead) => lead.id !== id)
  saveLeads(updated)
}

export function getInvoices(): Invoice[] {
  if (typeof window === 'undefined') return INITIAL_INVOICES
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES))
      return INITIAL_INVOICES
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_INVOICES
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices))
  } catch (e) {
    console.error('Failed to save invoices to localStorage:', e)
  }
}

export function addInvoice(invoice: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice {
  const current = getInvoices()
  const nextNum = (current.length + 48).toString().padStart(3, '0')
  const newInvoice: Invoice = {
    ...invoice,
    id: `inv-${Date.now().toString(36)}`,
    invoiceNumber: `INV-2026-${nextNum}`,
  }
  const updated = [newInvoice, ...current]
  saveInvoices(updated)
  return newInvoice
}

export function updateInvoiceStatus(id: string, status: InvoiceStatus): void {
  const current = getInvoices()
  const updated = current.map((inv) => (inv.id === id ? { ...inv, status } : inv))
  saveInvoices(updated)
}

export function deleteInvoice(id: string): void {
  const current = getInvoices()
  const updated = current.filter((inv) => inv.id !== id)
  saveInvoices(updated)
}

export const CORE_WEB_VITALS: PerformanceMetric[] = [
  {
    name: 'Largest Contentful Paint',
    key: 'lcp',
    value: '1.18',
    unit: 's',
    rating: 'good',
    description: 'Time taken to render the primary hero typography and 3D canvas viewport.',
    benchmark: '< 2.5s (Google Good)',
  },
  {
    name: 'Interaction to Next Paint',
    key: 'inp',
    value: '42',
    unit: 'ms',
    rating: 'good',
    description: 'Responsiveness latency across navigation, interactive dials, and modal actions.',
    benchmark: '< 200ms (Excellent)',
  },
  {
    name: 'Cumulative Layout Shift',
    key: 'cls',
    value: '0.008',
    unit: '',
    rating: 'good',
    description: 'Visual stability score. Zero layout jumps during font loading and asset streaming.',
    benchmark: '< 0.1 (Stable)',
  },
  {
    name: 'Time to First Byte',
    key: 'ttfb',
    value: '94',
    unit: 'ms',
    rating: 'good',
    description: 'Edge CDN routing and initial HTML response latency.',
    benchmark: '< 200ms (Edge Fast)',
  },
  {
    name: '30-Day Uptime',
    key: 'uptime',
    value: '99.98',
    unit: '%',
    rating: 'good',
    description: 'Continuous availability across global CDN edges and origin servers.',
    benchmark: '> 99.9% SLA',
  },
  {
    name: 'Overall Health Index',
    key: 'score',
    value: '98',
    unit: '/100',
    rating: 'good',
    description: 'Composite score calculated from Lighthouse, Web Vitals, and security headers.',
    benchmark: 'Tier 1 Benchmark',
  },
]
