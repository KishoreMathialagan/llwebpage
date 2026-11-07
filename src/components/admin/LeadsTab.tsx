import { useState, useMemo } from 'react'
import type { Lead, LeadStatus } from '../../lib/adminStorage'
import { SERVICES } from '../../data/content'
import { LEAD_STATUS_BADGES, LEAD_PRIORITY_BADGES } from './adminTheme'
import { LeadDetailsDrawer } from './LeadDetailsDrawer'
import { AdminCustomSelect } from './AdminCustomSelect'

interface Props {
  leads: Lead[]
  onUpdateStatus: (id: string, status: LeadStatus) => void
  onUpdateLead: (id: string, changes: Partial<Lead>) => void
  onDeleteLead: (id: string) => void
  onOpenNewLead: () => void
}

const STAGES: LeadStatus[] = ['New', 'In Review', 'Contacted', 'Proposal Sent', 'Won', 'Lost']

export function LeadsTab({ leads, onUpdateStatus, onUpdateLead, onDeleteLead, onOpenNewLead }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedService, setSelectedService] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table')
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null)
  const activeLead = useMemo(() => leads.find((l) => l.id === activeLeadId) || null, [leads, activeLeadId])

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.details.toLowerCase().includes(searchTerm.toLowerCase())

      const matchStatus = selectedStatus === 'all' || lead.status === selectedStatus
      const matchService = selectedService === 'all' || lead.service === selectedService

      return matchSearch && matchStatus && matchService
    })
  }, [leads, searchTerm, selectedStatus, selectedService])

  // Aggregate metrics
  const totalLeads = leads.length
  const wonLeads = leads.filter((l) => l.status === 'Won')
  const activePipelineValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((sum, l) => sum + (l.estimatedValue || 0), 0)
  const winRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0
  const avgDealSize =
    totalLeads > 0
      ? Math.round(
          leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0) / totalLeads
        )
      : 0

  const handleOpenLeadDetails = (lead: Lead) => {
    setActiveLeadId(lead.id)
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Company', 'Service', 'Status', 'Estimated Value', 'Priority', 'Created At', 'Notes']
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      `"${l.service.replace(/"/g, '""')}"`,
      l.status,
      l.estimatedValue,
      l.priority,
      l.createdAt,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `antara-leads-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#292B26]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#EAEAE3] tracking-tight">
            Lead Management CRM
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A49A] mt-0.5">
            Capture, qualify, and convert incoming client inquiries from the website into signed contracts.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#151713] text-[#A3A49A] hover:text-[#EAEAE3] border border-[#292B26] hover:border-[#D7F56B]/30 transition-all"
            title="Export filtered leads as CSV"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewLead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#777970]">Active Pipeline Value</div>
          <div className="text-xl sm:text-2xl font-mono font-medium text-[#EAEAE3] mt-1 tabular-nums">
            ${activePipelineValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#777970] mt-1">Unweighted pipeline</div>
        </div>

        <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#777970]">Total Leads</div>
          <div className="text-xl sm:text-2xl font-mono font-medium text-[#EAEAE3] mt-1 tabular-nums">
            {totalLeads}
          </div>
          <div className="text-[11px] text-[#777970] mt-1">
            {leads.filter((l) => l.status === 'New').length} awaiting first touch
          </div>
        </div>

        <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#777970]">Win Rate</div>
          <div className="text-xl sm:text-2xl font-mono font-medium text-[#D7F56B] mt-1 tabular-nums">
            {winRate}%
          </div>
          <div className="text-[11px] text-[#777970] mt-1">{wonLeads.length} won contracts</div>
        </div>

        <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#777970]">Avg Deal Value</div>
          <div className="text-xl sm:text-2xl font-mono font-medium text-[#EAEAE3] mt-1 tabular-nums">
            ${avgDealSize.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#777970] mt-1">Across all services</div>
        </div>
      </div>

      {/* Search, Status & Service Filters */}
      <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-[#777970] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads by name, email, company, or message..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#151713] border border-[#292B26] rounded-md text-xs text-[#EAEAE3] placeholder-[#777970] focus:outline-none focus:border-[#D7F56B]/60 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#777970] hover:text-[#EAEAE3]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Service Dropdown & View Mode Switcher */}
          <div className="flex items-center gap-2">
            <AdminCustomSelect
              value={selectedService}
              onChange={setSelectedService}
              variant="compact"
              options={[
                { label: 'All Services', value: 'all' },
                ...SERVICES.map((s) => ({ label: s.shortTitle, value: s.shortTitle })),
              ]}
              ariaLabel="Filter leads by service"
            />

            <div className="flex items-center p-0.5 bg-[#151713] rounded-md border border-[#292B26]">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-sm text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-[#D7F56B] text-[#090A09]' : 'text-[#A3A49A] hover:text-[#EAEAE3]'
                }`}
                title="Table View"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pipeline')}
                className={`p-1.5 rounded-sm text-xs transition-colors ${
                  viewMode === 'pipeline' ? 'bg-[#D7F56B] text-[#090A09]' : 'text-[#A3A49A] hover:text-[#EAEAE3]'
                }`}
                title="Pipeline / Kanban View"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedStatus('all')}
            className={`px-2.5 py-1 rounded-sm text-xs font-mono transition-colors whitespace-nowrap ${
              selectedStatus === 'all'
                ? 'bg-[#D7F56B] text-[#090A09] font-medium'
                : 'bg-[#151713] text-[#A3A49A] hover:text-[#EAEAE3] border border-[#292B26]'
            }`}
          >
            All Stages ({leads.length})
          </button>
          {STAGES.map((stage) => {
            const count = leads.filter((l) => l.status === stage).length
            const isSelected = selectedStatus === stage
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedStatus(stage)}
                className={`px-2.5 py-1 rounded-sm text-xs font-mono transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#D7F56B] text-[#090A09] font-semibold'
                    : 'bg-[#151713] text-[#A3A49A] hover:text-[#EAEAE3] border border-[#292B26]'
                }`}
              >
                {stage} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content: Table or Pipeline */}
      {viewMode === 'table' ? (
        <div className="bg-[#10120F] border border-[#292B26] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151713] text-[#777970] font-mono text-[10px] uppercase tracking-wider border-b border-[#292B26]">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Contact & Company</th>
                  <th className="py-2.5 px-4 font-normal">Service</th>
                  <th className="py-2.5 px-4 font-normal">Est. Deal Value</th>
                  <th className="py-2.5 px-4 font-normal">Priority</th>
                  <th className="py-2.5 px-4 font-normal">Pipeline Stage</th>
                  <th className="py-2.5 px-4 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292B26] text-[#EAEAE3]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#777970]">
                      No leads match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    return (
                      <tr key={lead.id} className="hover:bg-[#D7F56B]/[0.03] transition-colors group">
                        {/* Contact */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleOpenLeadDetails(lead)}
                            className="text-left group-hover:text-[#D7F56B] transition-colors focus:outline-none"
                          >
                            <div className="font-medium text-[#EAEAE3]">{lead.name}</div>
                            <div className="text-[11px] text-[#777970] mt-0.5 flex items-center gap-1.5">
                              <span>{lead.company}</span>
                              <span className="text-[#292B26]">•</span>
                              <span className="text-[#777970] font-mono">{lead.email}</span>
                            </div>
                          </button>
                        </td>

                        {/* Service */}
                        <td className="py-3 px-4 text-xs">
                          <span className="inline-flex items-center text-[#A3A49A]">
                            {lead.service}
                          </span>
                        </td>

                        {/* Est Value */}
                        <td className="py-3 px-4 font-mono font-medium text-[#EAEAE3] tabular-nums">
                          ${lead.estimatedValue.toLocaleString()}
                        </td>

                        {/* Priority */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase ${
                              LEAD_PRIORITY_BADGES[lead.priority] || 'bg-[#151713] text-[#A3A49A] border border-[#292B26]'
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </td>

                        {/* Stage Selector Dropdown */}
                        <td className="py-3 px-4">
                          <AdminCustomSelect
                            value={lead.status}
                            onChange={(val) => onUpdateStatus(lead.id, val as LeadStatus)}
                            variant="badge"
                            options={STAGES.map((s) => ({
                              label: s,
                              value: s,
                              badgeClass: LEAD_STATUS_BADGES[s],
                            }))}
                            ariaLabel={`Update status for ${lead.name}`}
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenLeadDetails(lead)}
                              className="px-2 py-1 text-xs text-[#A3A49A] hover:text-[#EAEAE3] hover:bg-[#151713] rounded transition-colors"
                              title="View Details"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1 text-xs text-[#777970] hover:text-[#EAEAE3] hover:bg-[#151713] rounded transition-colors"
                              title="Delete Lead"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage)
            const stageValue = stageLeads.reduce((s, l) => s + (l.estimatedValue || 0), 0)

            return (
              <div key={stage} className="bg-[#10120F] border border-[#292B26] rounded-lg p-3 flex flex-col min-h-[420px]">
                {/* Column header */}
                <div className="pb-2.5 mb-2.5 border-b border-[#292B26] flex items-center justify-between">
                  <div>
                    <span
                      className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded ${
                        LEAD_STATUS_BADGES[stage] || 'bg-[#151713] text-[#D7F56B] border border-[#292B26]'
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#777970]">{stageLeads.length}</span>
                </div>

                <div className="text-[10px] font-mono text-[#777970] mb-2 tabular-nums">
                  ${stageValue.toLocaleString()}
                </div>

                {/* Cards */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[550px] pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="p-3 text-center text-[11px] text-[#777970] border border-dashed border-[#292B26] rounded-md">
                      Empty
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => handleOpenLeadDetails(lead)}
                        className="bg-[#151713] hover:bg-[#1a1c17] border border-[#292B26] hover:border-[#D7F56B]/30 rounded-md p-3 cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-medium text-[#EAEAE3] group-hover:text-[#D7F56B] transition-colors leading-tight">
                            {lead.name}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${
                              LEAD_PRIORITY_BADGES[lead.priority] || 'bg-[#151713] text-[#A3A49A] border border-[#292B26]'
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#A3A49A] truncate">{lead.company}</div>
                        <div className="text-[10px] text-[#777970] truncate">{lead.service}</div>
                        <div className="pt-2 border-t border-[#292B26] flex items-center justify-between text-[11px] font-mono">
                          <span className="text-[#D7F56B] font-medium tabular-nums">${lead.estimatedValue.toLocaleString()}</span>
                          <span className="text-[9px] text-[#777970]">
                            {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Right-Side Sidebar Drawer */}
      <LeadDetailsDrawer
        lead={activeLead}
        onClose={() => setActiveLeadId(null)}
        onUpdateStatus={onUpdateStatus}
        onUpdateLead={onUpdateLead}
        onDeleteLead={onDeleteLead}
      />
    </div>
  )
}
