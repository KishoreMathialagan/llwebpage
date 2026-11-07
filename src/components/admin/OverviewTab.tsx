import type { Lead, Invoice } from '../../lib/adminStorage'
import type { AdminTab } from './AdminHeader'
import { LEAD_STATUS_BADGES } from './adminTheme'

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

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#292B26]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] bg-[#151713] border border-[#292B26] px-1.5 py-0.5 rounded">
              ANTARA Internal Operations
            </span>
            <span className="text-xs text-[#777970]">Live telemetry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#EAEAE3] tracking-tight">
            Agency Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A49A] mt-0.5">
            Real-time pipeline monitoring, revenue tracking, and global web infrastructure health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewLead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Lead</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewInvoice}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#151713] text-[#EAEAE3] border border-[#292B26] hover:border-[#D7F56B]/30 hover:bg-[#10120F] transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#A3A49A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Pipeline Value */}
        <div
          onClick={() => onSelectTab('leads')}
          className="group cursor-pointer bg-[#10120F] border border-[#292B26] hover:border-[#D7F56B]/30 rounded-lg p-4 transition-all duration-150"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#777970]">Active Pipeline</span>
            <span className="text-[#D7F56B] bg-[#D7F56B]/10 border border-[#D7F56B]/20 text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1">
              +18.4%
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </span>
          </div>
          <div className="text-2xl sm:text-[26px] font-medium text-[#EAEAE3] font-mono tracking-tight tabular-nums">
            ${totalPipelineValue.toLocaleString()}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#292B26] flex items-center justify-between text-[11px] text-[#777970]">
            <span>{activeLeadsCount} active opportunities</span>
            <span className="text-[#A3A49A] group-hover:text-[#D7F56B] transition-colors font-medium">Manage →</span>
          </div>
        </div>

        {/* KPI 2: Won & Realized Revenue */}
        <div
          onClick={() => onSelectTab('finance')}
          className="group cursor-pointer bg-[#10120F] border border-[#292B26] hover:border-[#D7F56B]/30 rounded-lg p-4 transition-all duration-150"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#777970]">Collected Revenue</span>
            <span className="text-[#A3A49A] bg-[#151713] border border-[#292B26] text-[10px] font-mono px-1.5 py-0.5 rounded">
              YTD Realized
            </span>
          </div>
          <div className="text-2xl sm:text-[26px] font-medium text-[#EAEAE3] font-mono tracking-tight tabular-nums">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#292B26] flex items-center justify-between text-[11px] text-[#777970]">
            <span>${totalPaid.toLocaleString()} of ${totalInvoiced.toLocaleString()} billed</span>
            <span className="text-[#A3A49A] group-hover:text-[#D7F56B] transition-colors font-medium">Invoices →</span>
          </div>
        </div>

        {/* KPI 3: Monthly Recurring Revenue (MRR) */}
        <div
          onClick={() => onSelectTab('finance')}
          className="group cursor-pointer bg-[#10120F] border border-[#292B26] hover:border-[#D7F56B]/30 rounded-lg p-4 transition-all duration-150"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#777970]">Contract Retainers (MRR)</span>
            <span className="text-[#D7F56B] bg-[#D7F56B]/10 border border-[#D7F56B]/20 text-[10px] font-mono px-1.5 py-0.5 rounded">
              94% Retention
            </span>
          </div>
          <div className="text-2xl sm:text-[26px] font-medium text-[#D7F56B] font-mono tracking-tight tabular-nums">
            $28,400<span className="text-xs text-[#A3A49A] font-normal ml-1 font-sans">/mo</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#292B26] flex items-center justify-between text-[11px] text-[#777970]">
            <span>Performance & Strategy retainers</span>
            <span className="text-[#A3A49A] group-hover:text-[#D7F56B] transition-colors font-medium">Breakdown →</span>
          </div>
        </div>

        {/* KPI 4: Site Experience Score */}
        <div
          onClick={() => onSelectTab('performance')}
          className="group cursor-pointer bg-[#10120F] border border-[#292B26] hover:border-[#D7F56B]/30 rounded-lg p-4 transition-all duration-150"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#777970]">Site Experience Score</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#D7F56B]/10 border border-[#D7F56B]/20 text-[#D7F56B]">
              OPTIMAL
            </span>
          </div>
          <div className="text-2xl sm:text-[26px] font-medium text-[#EAEAE3] font-mono tracking-tight flex items-baseline gap-1.5 tabular-nums">
            <span>98</span>
            <span className="text-xs text-[#777970]">/100</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#292B26] flex items-center justify-between text-[11px] text-[#777970]">
            <span>LCP 1.18s • INP 42ms</span>
            <span className="text-[#A3A49A] group-hover:text-[#D7F56B] transition-colors font-medium">Telemetry →</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Leads CRM Quickview & Secondary Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Recent Client Inquiries CRM (2 cols) */}
        <div className="lg:col-span-2 bg-[#10120F] border border-[#292B26] rounded-lg overflow-hidden flex flex-col justify-between">
          <div>
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#292B26] bg-[#10120F]">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs sm:text-sm font-semibold text-[#EAEAE3]">Recent Client Inquiries</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#151713] border border-[#292B26] text-[#A3A49A]">
                  {leads.length} Total
                </span>
                {newLeads.length > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D7F56B]/10 border border-[#D7F56B]/25 text-[#D7F56B] font-medium">
                    {newLeads.length} Unreviewed
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('leads')}
                className="text-xs text-[#A3A49A] hover:text-[#D7F56B] flex items-center gap-1 font-medium transition-colors"
              >
                <span>Pipeline CRM</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Structured Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#292B26] text-[10px] font-mono uppercase tracking-wider text-[#777970] bg-[#151713]">
                    <th className="py-2.5 px-4 font-normal">Contact & Organization</th>
                    <th className="py-2.5 px-3 font-normal">Service Discipline</th>
                    <th className="py-2.5 px-3 font-normal">Scope Summary</th>
                    <th className="py-2.5 px-3 font-normal text-right">Est. Value</th>
                    <th className="py-2.5 px-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292B26]">
                  {recentLeads.map((lead) => {
                    const initials = lead.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => onSelectTab('leads')}
                        className="hover:bg-[#D7F56B]/[0.03] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded bg-[#151713] border border-[#292B26] text-[#D7F56B] font-mono text-[10px] font-medium flex items-center justify-center flex-shrink-0 group-hover:border-[#D7F56B]/40 transition-colors">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-[#EAEAE3] truncate group-hover:text-[#D7F56B] transition-colors">
                                {lead.name}
                              </div>
                              <div className="text-[11px] text-[#777970] truncate">
                                {lead.company || 'Private Client'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#A3A49A] whitespace-nowrap">
                          {lead.service}
                        </td>
                        <td className="py-3 px-3 text-[#777970] max-w-[220px] xl:max-w-[320px] truncate">
                          {lead.details}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-medium text-[#EAEAE3] tabular-nums whitespace-nowrap">
                          ${lead.estimatedValue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span
                            className={`inline-block text-[10px] font-mono tracking-wider px-2 py-0.5 rounded uppercase ${
                              LEAD_STATUS_BADGES[lead.status] || 'bg-[#151713] text-[#D7F56B] border border-[#292B26]'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked List View */}
            <div className="md:hidden divide-y divide-[#292B26]">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelectTab('leads')}
                  className="p-3.5 hover:bg-[#D7F56B]/[0.03] transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-xs text-[#EAEAE3]">{lead.name}</div>
                      <div className="text-[11px] text-[#777970]">{lead.company}</div>
                    </div>
                    <span
                      className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded uppercase ${
                        LEAD_STATUS_BADGES[lead.status] || 'bg-[#151713] text-[#D7F56B] border border-[#292B26]'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#777970] line-clamp-1">{lead.details}</div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#292B26]">
                    <span className="text-[#A3A49A] text-[11px]">{lead.service}</span>
                    <span className="font-mono text-[#EAEAE3] font-medium">${lead.estimatedValue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel Footer */}
          <div className="px-4 sm:px-5 py-3 border-t border-[#292B26] bg-[#10120F] flex items-center justify-between text-xs text-[#777970]">
            <span>
              Closed-Won Deals:{' '}
              <strong className="text-[#EAEAE3] font-mono font-medium">${wonValue.toLocaleString()}</strong>
            </span>
            <button
              onClick={() => onSelectTab('leads')}
              className="text-[#A3A49A] hover:text-[#D7F56B] transition-colors font-medium flex items-center gap-1"
            >
              <span>Open Pipeline CRM →</span>
            </button>
          </div>
        </div>

        {/* Right Column: Observability & Financial Snapshot */}
        <div className="space-y-5">
          {/* Site Health & Infrastructure */}
          <div className="bg-[#10120F] border border-[#292B26] rounded-lg p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#292B26] mb-3">
              <h2 className="text-xs font-semibold text-[#EAEAE3] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7F56B]" />
                Site Health & Telemetry
              </h2>
              <button
                type="button"
                onClick={() => onSelectTab('performance')}
                className="text-[11px] text-[#A3A49A] hover:text-[#D7F56B] transition-colors font-medium"
              >
                Details →
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#777970] text-[11px]">LCP (Largest Contentful Paint)</span>
                  <span className="font-mono text-[#EAEAE3] font-medium text-xs">1.18s</span>
                </div>
                <div className="w-full bg-[#151713] h-1 rounded-full overflow-hidden mt-1.5 border border-[#292B26]">
                  <div className="bg-[#D7F56B] h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#777970] text-[11px]">INP (Interaction to Next Paint)</span>
                  <span className="font-mono text-[#EAEAE3] font-medium text-xs">42ms</span>
                </div>
                <div className="w-full bg-[#151713] h-1 rounded-full overflow-hidden mt-1.5 border border-[#292B26]">
                  <div className="bg-[#D7F56B] h-full rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#777970] text-[11px]">Global Edge Availability (30d)</span>
                  <span className="font-mono text-[#EAEAE3] font-medium text-xs">99.98%</span>
                </div>
                <div className="w-full bg-[#151713] h-1 rounded-full overflow-hidden mt-1.5 border border-[#292B26]">
                  <div className="bg-[#D7F56B] h-full rounded-full" style={{ width: '99.98%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#292B26] flex items-center justify-between text-[11px] text-[#777970]">
              <span>Edge Cache Hit: <strong className="text-[#EAEAE3] font-mono">94.2%</strong></span>
              <span className="text-[#D7F56B] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7F56B]" />
                All probes healthy
              </span>
            </div>
          </div>

          {/* Invoices Status Panel */}
          <div className="bg-[#10120F] border border-[#292B26] rounded-lg p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#292B26] mb-3">
              <h2 className="text-xs font-semibold text-[#EAEAE3]">Invoice Ledger</h2>
              <button
                type="button"
                onClick={() => onSelectTab('finance')}
                className="text-[11px] text-[#A3A49A] hover:text-[#D7F56B] transition-colors font-medium"
              >
                Manage →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-[#151713] rounded-md p-2 border border-[#292B26]">
                <div className="text-[9px] uppercase font-mono text-[#777970]">Paid</div>
                <div className="text-sm font-medium font-mono text-[#D7F56B] mt-0.5 tabular-nums">
                  ${totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#151713] rounded-md p-2 border border-[#292B26]">
                <div className="text-[9px] uppercase font-mono text-[#777970]">Pending</div>
                <div className="text-sm font-medium font-mono text-[#EAEAE3] mt-0.5 tabular-nums">
                  ${totalPending.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#151713] rounded-md p-2 border border-[#292B26]">
                <div className="text-[9px] uppercase font-mono text-[#777970]">Overdue</div>
                <div className="text-sm font-medium font-mono text-[#EAEAE3] mt-0.5 tabular-nums">
                  ${totalOverdue.toLocaleString()}
                </div>
              </div>
            </div>

            {totalOverdue > 0 ? (
              <div className="p-2.5 rounded-md bg-[#151713] border border-[#292B26] text-xs text-[#EAEAE3] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#D7F56B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{overdueInvoices.length} Overdue Notice ({totalOverdue > 0 ? `$${totalOverdue.toLocaleString()}` : ''})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('finance')}
                  className="text-[11px] underline font-medium text-[#A3A49A] hover:text-[#D7F56B] transition-colors"
                >
                  Review
                </button>
              </div>
            ) : (
              <div className="p-2 rounded-md bg-[#151713] border border-[#292B26] text-[11px] text-[#777970] flex items-center justify-between">
                <span>All invoices current</span>
                <span className="text-[#D7F56B]">0 overdue</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
