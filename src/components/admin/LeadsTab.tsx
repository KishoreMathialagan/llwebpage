import { useState, useMemo } from 'react'
import type { Lead, LeadStatus, LeadPriority } from '../../lib/adminStorage'
import { SERVICES } from '../../data/content'

interface Props {
  leads: Lead[]
  onUpdateStatus: (id: string, status: LeadStatus) => void
  onUpdateLead: (id: string, changes: Partial<Lead>) => void
  onDeleteLead: (id: string) => void
  onOpenNewLead: () => void
}

const STAGES: LeadStatus[] = ['New', 'In Review', 'Contacted', 'Proposal Sent', 'Won', 'Lost']

const STAGE_COLORS: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  New: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'In Review': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20' },
  Contacted: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20' },
  'Proposal Sent': { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/20' },
  Won: { bg: 'bg-[#D6F36A]/15', text: 'text-[#D6F36A]', border: 'border-[#D6F36A]/30' },
  Lost: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
}

const PRIORITY_BADGES: Record<LeadPriority, string> = {
  High: 'text-red-400 border-red-500/30 bg-red-950/20',
  Medium: 'text-amber-300 border-amber-500/30 bg-amber-950/20',
  Low: 'text-zinc-400 border-zinc-700 bg-zinc-900',
}

export function LeadsTab({ leads, onUpdateStatus, onUpdateLead, onDeleteLead, onOpenNewLead }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedService, setSelectedService] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table')
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [editingNotes, setEditingNotes] = useState('')

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
    setActiveLead(lead)
    setEditingNotes(lead.notes || '')
  }

  const handleSaveNotes = () => {
    if (!activeLead) return
    onUpdateLead(activeLead.id, { notes: editingNotes })
    setActiveLead({ ...activeLead, notes: editingNotes })
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
    link.setAttribute('download', `leadloom-leads-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#F3F1E9] tracking-tight">
            Lead Management CRM
          </h1>
          <p className="text-sm text-[#A6A79F] mt-1">
            Capture, qualify, and convert incoming client inquiries from the website into signed contracts.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#181A18] text-[#A6A79F] hover:text-[#F3F1E9] border border-white/10 hover:border-white/20 transition-all"
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
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#D6F36A] text-[#080909] hover:bg-[#c4d957] transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase text-[#A6A79F]">Active Pipeline Value</div>
          <div className="text-xl sm:text-2xl font-mono font-semibold text-[#F3F1E9] mt-1">
            ${activePipelineValue.toLocaleString()}
          </div>
          <div className="text-xs text-[#6E716B] mt-1">Unweighted pipeline</div>
        </div>

        <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase text-[#A6A79F]">Total Leads</div>
          <div className="text-xl sm:text-2xl font-mono font-semibold text-[#F3F1E9] mt-1">
            {totalLeads}
          </div>
          <div className="text-xs text-[#6E716B] mt-1">
            {leads.filter((l) => l.status === 'New').length} awaiting first touch
          </div>
        </div>

        <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase text-[#A6A79F]">Win Rate</div>
          <div className="text-xl sm:text-2xl font-mono font-semibold text-[#D6F36A] mt-1">
            {winRate}%
          </div>
          <div className="text-xs text-[#6E716B] mt-1">{wonLeads.length} won contracts</div>
        </div>

        <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase text-[#A6A79F]">Avg Deal Value</div>
          <div className="text-xl sm:text-2xl font-mono font-semibold text-[#F3F1E9] mt-1">
            ${avgDealSize.toLocaleString()}
          </div>
          <div className="text-xs text-[#6E716B] mt-1">Across all services</div>
        </div>
      </div>

      {/* Search, Status & Service Filters */}
      <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-[#A6A79F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
              className="w-full pl-9 pr-4 py-2 bg-[#181A18] border border-white/10 rounded-lg text-xs sm:text-sm text-[#F3F1E9] placeholder-[#6E716B] focus:outline-none focus:border-[#D6F36A]/50 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6E716B] hover:text-[#F3F1E9]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Service Dropdown & View Mode Switcher */}
          <div className="flex items-center gap-2">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-[#181A18] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
            >
              <option value="all">All Services</option>
              {SERVICES.map((s) => (
                <option key={s.index} value={s.shortTitle}>
                  {s.shortTitle}
                </option>
              ))}
            </select>

            <div className="flex items-center p-0.5 bg-[#181A18] rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-[#D6F36A] text-[#080909]' : 'text-[#A6A79F] hover:text-white'
                }`}
                title="Table View"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pipeline')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'pipeline' ? 'bg-[#D6F36A] text-[#080909]' : 'text-[#A6A79F] hover:text-white'
                }`}
                title="Pipeline / Kanban View"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors whitespace-nowrap ${
              selectedStatus === 'all'
                ? 'bg-[#D6F36A] text-[#080909] font-medium'
                : 'bg-white/[0.04] text-[#A6A79F] hover:text-white'
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
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#D6F36A] text-[#080909] font-semibold'
                    : 'bg-white/[0.04] text-[#A6A79F] hover:text-white'
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
        <div className="bg-[#111311] border border-white/[0.08] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#181A18] text-[#A6A79F] font-mono text-[11px] uppercase tracking-wider border-b border-white/[0.08]">
                <tr>
                  <th className="py-3 px-4">Contact & Company</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Est. Deal Value</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#F3F1E9]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6E716B]">
                      No leads match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const stageColor = STAGE_COLORS[lead.status]
                    return (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleOpenLeadDetails(lead)}
                            className="text-left group-hover:text-[#D6F36A] transition-colors focus:outline-none"
                          >
                            <div className="font-medium text-[#F3F1E9]">{lead.name}</div>
                            <div className="text-xs text-[#A6A79F] mt-0.5 flex items-center gap-1.5">
                              <span>{lead.company}</span>
                              <span className="text-[#6E716B]">•</span>
                              <span className="text-[#6E716B] font-mono">{lead.email}</span>
                            </div>
                          </button>
                        </td>

                        {/* Service */}
                        <td className="py-3.5 px-4 text-xs">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[#D6F36A]">
                            {lead.service}
                          </span>
                        </td>

                        {/* Est Value */}
                        <td className="py-3.5 px-4 font-mono font-medium">
                          ${lead.estimatedValue.toLocaleString()}
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border uppercase ${
                              PRIORITY_BADGES[lead.priority]
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </td>

                        {/* Stage Selector Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                            className={`text-[11px] font-mono px-2 py-1 rounded border uppercase cursor-pointer focus:outline-none ${stageColor.bg} ${stageColor.text} ${stageColor.border}`}
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s} className="bg-[#181A18] text-[#F3F1E9]">
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenLeadDetails(lead)}
                              className="px-2 py-1 text-xs text-[#A6A79F] hover:text-[#F3F1E9] hover:bg-white/[0.06] rounded transition-colors"
                              title="View Details"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
                              title="Delete Lead"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            const stageStyle = STAGE_COLORS[stage]

            return (
              <div key={stage} className="bg-[#111311] border border-white/[0.08] rounded-xl p-3 flex flex-col min-h-[420px]">
                {/* Column header */}
                <div className="pb-2.5 mb-2.5 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                      {stage}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#A6A79F]">{stageLeads.length}</span>
                </div>

                <div className="text-[10px] font-mono text-[#6E716B] mb-2">
                  ${stageValue.toLocaleString()}
                </div>

                {/* Cards */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[550px] pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="p-3 text-center text-[11px] text-[#6E716B] border border-dashed border-white/[0.05] rounded-lg">
                      Empty
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => handleOpenLeadDetails(lead)}
                        className="bg-[#181A18] hover:bg-[#1f221f] border border-white/[0.06] hover:border-[#D6F36A]/40 rounded-lg p-3 cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-semibold text-[#F3F1E9] group-hover:text-[#D6F36A] transition-colors leading-tight">
                            {lead.name}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${PRIORITY_BADGES[lead.priority]}`}>
                            {lead.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#A6A79F] truncate">{lead.company}</div>
                        <div className="text-[10px] text-[#6E716B] truncate">{lead.service}</div>
                        <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono">
                          <span className="text-[#D6F36A] font-semibold">${lead.estimatedValue.toLocaleString()}</span>
                          <span className="text-[9px] text-[#6E716B]">
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

      {/* Lead Details Drawer / Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111311] border border-white/15 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveLead(null)}
              className="absolute top-5 right-5 text-[#A6A79F] hover:text-[#F3F1E9] p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              ✕
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${STAGE_COLORS[activeLead.status].bg} ${STAGE_COLORS[activeLead.status].text} ${STAGE_COLORS[activeLead.status].border}`}>
                  {activeLead.status}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${PRIORITY_BADGES[activeLead.priority]}`}>
                  {activeLead.priority} Priority
                </span>
              </div>
              <h2 className="text-xl font-serif text-[#F3F1E9]">{activeLead.name}</h2>
              <div className="text-xs text-[#A6A79F] mt-0.5">
                {activeLead.company} • <a href={`mailto:${activeLead.email}`} className="text-[#D6F36A] underline">{activeLead.email}</a>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#181A18] rounded-xl border border-white/[0.06]">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#6E716B]">Estimated Value</span>
                <div className="text-base font-mono font-semibold text-[#D6F36A] mt-0.5">
                  ${activeLead.estimatedValue.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#6E716B]">Interested Service</span>
                <div className="text-xs font-medium text-[#F3F1E9] mt-0.5">{activeLead.service}</div>
              </div>
            </div>

            {/* Enquiry Details */}
            <div>
              <label className="text-xs font-mono uppercase text-[#A6A79F] block mb-1">Client Inbound Brief</label>
              <div className="p-3 bg-[#181A18] rounded-lg border border-white/[0.06] text-xs text-[#F3F1E9] leading-relaxed whitespace-pre-wrap">
                {activeLead.details}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-[#A6A79F]">Internal Strategy Notes</label>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="text-xs text-[#D6F36A] hover:underline font-mono"
                >
                  Save Notes
                </button>
              </div>
              <textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Add private team notes, next meeting takeaways, objections, or deal status..."
                rows={4}
                className="w-full bg-[#181A18] border border-white/10 rounded-lg p-3 text-xs text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50 placeholder-[#6E716B]"
              />
            </div>

            {/* Stage Transition Control */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A6A79F]">Update Stage:</span>
                <select
                  value={activeLead.status}
                  onChange={(e) => {
                    const next = e.target.value as LeadStatus
                    onUpdateStatus(activeLead.id, next)
                    setActiveLead({ ...activeLead, status: next })
                  }}
                  className="bg-[#181A18] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F1E9]"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  onDeleteLead(activeLead.id)
                  setActiveLead(null)
                }}
                className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
