import type { Lead, Invoice } from '../../lib/adminStorage'
import type { AdminTab } from './AdminHeader'

interface Props {
  leads: Lead[]
  invoices: Invoice[]
  onSelectTab: (tab: AdminTab) => void
  onOpenNewLead: () => void
  onOpenNewInvoice: () => void
}

export function OverviewTab({ leads, invoices, onSelectTab, onOpenNewLead, onOpenNewInvoice }: Props) {
  // Compute calculations
  const totalPipelineValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0)

  const wonValue = leads
    .filter((l) => l.status === 'Won')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0)

  const activeLeadsCount = leads.filter((l) => l.status !== 'Won' && l.status !== 'Lost').length
  const newLeads = leads.filter((l) => l.status === 'New')

  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.amount, 0)
  const paidInvoices = invoices.filter((i) => i.status === 'Paid')
  const totalPaid = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0)
  const pendingInvoices = invoices.filter((i) => i.status === 'Pending')
  const totalPending = pendingInvoices.reduce((acc, curr) => acc + curr.amount, 0)
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue')
  const totalOverdue = overdueInvoices.reduce((acc, curr) => acc + curr.amount, 0)

  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#F3F1E9] tracking-tight">
            Agency Operations Dashboard
          </h1>
          <p className="text-sm text-[#A6A79F] mt-1">
            Real-time telemetry across client pipeline, cash flow, and web infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewLead}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#D6F36A] text-[#080909] hover:bg-[#c4d957] transition-all shadow-sm shadow-[#D6F36A]/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Lead</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewInvoice}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#181A18] text-[#F3F1E9] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
          >
            <svg className="w-4 h-4 text-[#D6F36A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pipeline Value */}
        <div
          onClick={() => onSelectTab('leads')}
          className="group cursor-pointer bg-[#111311] border border-white/[0.08] hover:border-[#D6F36A]/40 rounded-xl p-5 transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#A6A79F] mb-3">
            <span className="uppercase tracking-wider font-mono text-[11px]">Active Pipeline</span>
            <span className="text-[#D6F36A] font-mono text-xs flex items-center gap-1">
              +18.4%
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#F3F1E9] font-mono tracking-tight">
            ${totalPipelineValue.toLocaleString()}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#6E716B]">
            <span>{activeLeadsCount} active opportunities</span>
            <span className="text-[#A6A79F] group-hover:text-[#D6F36A] transition-colors">Manage →</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6F36A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* KPI 2: Won & Realized Revenue */}
        <div
          onClick={() => onSelectTab('finance')}
          className="group cursor-pointer bg-[#111311] border border-white/[0.08] hover:border-[#D6F36A]/40 rounded-xl p-5 transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#A6A79F] mb-3">
            <span className="uppercase tracking-wider font-mono text-[11px]">Collected Revenue</span>
            <span className="text-[#D6F36A] font-mono text-xs">YTD</span>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#F3F1E9] font-mono tracking-tight">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#6E716B]">
            <span>${totalPaid.toLocaleString()} of ${totalInvoiced.toLocaleString()} billed</span>
            <span className="text-[#A6A79F] group-hover:text-[#D6F36A] transition-colors">Invoices →</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6F36A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* KPI 3: Monthly Recurring Revenue (MRR) */}
        <div
          onClick={() => onSelectTab('finance')}
          className="group cursor-pointer bg-[#111311] border border-white/[0.08] hover:border-[#D6F36A]/40 rounded-xl p-5 transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#A6A79F] mb-3">
            <span className="uppercase tracking-wider font-mono text-[11px]">Contract Retainers (MRR)</span>
            <span className="text-[#D6F36A] font-mono text-xs">94% Retention</span>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#D6F36A] font-mono tracking-tight">
            $28,400<span className="text-xs text-[#A6A79F] font-normal">/mo</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#6E716B]">
            <span>Performance & Strategy retainers</span>
            <span className="text-[#A6A79F] group-hover:text-[#D6F36A] transition-colors">Breakdown →</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6F36A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* KPI 4: Site Performance & Web Vitals */}
        <div
          onClick={() => onSelectTab('performance')}
          className="group cursor-pointer bg-[#111311] border border-white/[0.08] hover:border-[#D6F36A]/40 rounded-xl p-5 transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#A6A79F] mb-3">
            <span className="uppercase tracking-wider font-mono text-[11px]">Site Experience Score</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#D6F36A]/10 text-[#D6F36A]">
              OPTIMAL
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#F3F1E9] font-mono tracking-tight flex items-baseline gap-1.5">
            <span>98</span>
            <span className="text-xs text-[#6E716B]">/100</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#6E716B]">
            <span>LCP 1.18s • INP 42ms</span>
            <span className="text-[#A6A79F] group-hover:text-[#D6F36A] transition-colors">Telemetry →</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6F36A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Two Column Grid: Leads CRM Quickview & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Leads (2 cols) */}
        <div className="lg:col-span-2 bg-[#111311] border border-white/[0.08] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-semibold text-[#F3F1E9]">Recent Client Inquiries</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#181a18] border border-white/10 text-[#A6A79F]">
                  {leads.length} Total
                </span>
                {newLeads.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#D6F36A]/20 text-[#D6F36A] font-medium">
                    {newLeads.length} Unreviewed
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('leads')}
                className="text-xs text-[#D6F36A] hover:underline flex items-center gap-1 font-medium"
              >
                <span>View All In Pipeline</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* List */}
            <div className="divide-y divide-white/[0.05]">
              {recentLeads.map((lead) => {
                const statusStyles: Record<string, string> = {
                  New: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  'In Review': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                  Contacted: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
                  'Proposal Sent': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
                  Won: 'bg-[#D6F36A]/15 text-[#D6F36A] border-[#D6F36A]/30 font-semibold',
                  Lost: 'bg-red-500/10 text-red-400 border-red-500/20',
                }

                return (
                  <div key={lead.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#F3F1E9] truncate">{lead.name}</span>
                        <span className="text-xs text-[#6E716B]">from</span>
                        <span className="text-xs text-[#A6A79F] font-medium truncate">{lead.company}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#6E716B]">
                        <span className="text-[#D6F36A]/90">{lead.service}</span>
                        <span>•</span>
                        <span className="truncate max-w-[280px] text-[#A6A79F]">{lead.details}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                      <span className="text-xs font-mono text-[#F3F1E9]">
                        ${lead.estimatedValue.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${statusStyles[lead.status] || 'bg-white/5 text-white/70'}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#6E716B]">
            <span>Closed-Won Deals: <strong className="text-[#F3F1E9]">${wonValue.toLocaleString()}</strong></span>
            <button
              onClick={() => onSelectTab('leads')}
              className="text-[#D6F36A] hover:underline"
            >
              Open Full Lead CRM →
            </button>
          </div>
        </div>

        {/* Right Column: Site & Financial Snapshot (1 col) */}
        <div className="space-y-6">
          {/* Site Health & Infrastructure */}
          <div className="bg-[#111311] border border-white/[0.08] rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <h2 className="text-sm font-semibold text-[#F3F1E9] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D6F36A]" />
                Site Health & Latency
              </h2>
              <button
                type="button"
                onClick={() => onSelectTab('performance')}
                className="text-xs text-[#D6F36A] hover:underline"
              >
                Details →
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A6A79F]">LCP (Largest Contentful Paint)</span>
                <span className="font-mono text-[#D6F36A] font-semibold">1.18s</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#D6F36A] h-full rounded-full" style={{ width: '92%' }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#A6A79F]">INP (Interaction to Next Paint)</span>
                <span className="font-mono text-[#D6F36A] font-semibold">42ms</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#D6F36A] h-full rounded-full" style={{ width: '96%' }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#A6A79F]">Global Edge Uptime (30d)</span>
                <span className="font-mono text-[#F3F1E9]">99.98%</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#D6F36A] h-full rounded-full" style={{ width: '99.98%' }} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#6E716B]">
              <span>Edge Cache Hit: <strong className="text-[#F3F1E9]">94.2%</strong></span>
              <span className="text-[#D6F36A]">All probes normal</span>
            </div>
          </div>

          {/* Outstanding Invoice Alert */}
          <div className="bg-[#111311] border border-white/[0.08] rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <h2 className="text-sm font-semibold text-[#F3F1E9]">Invoices Status</h2>
              <button
                type="button"
                onClick={() => onSelectTab('finance')}
                className="text-xs text-[#D6F36A] hover:underline"
              >
                Manage →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center mb-3">
              <div className="bg-[#181A18] rounded-lg p-2.5 border border-white/[0.05]">
                <div className="text-[10px] uppercase font-mono text-[#A6A79F]">Paid</div>
                <div className="text-base font-semibold font-mono text-[#D6F36A] mt-0.5">
                  ${totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#181A18] rounded-lg p-2.5 border border-white/[0.05]">
                <div className="text-[10px] uppercase font-mono text-[#A6A79F]">Pending</div>
                <div className="text-base font-semibold font-mono text-amber-300 mt-0.5">
                  ${totalPending.toLocaleString()}
                </div>
              </div>
            </div>

            {totalOverdue > 0 && (
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{overdueInvoices.length} Overdue (${totalOverdue.toLocaleString()})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('finance')}
                  className="text-[11px] underline font-medium text-red-300"
                >
                  Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
