import { useState, useEffect } from 'react'
import {
  getLeads,
  addLead,
  updateLeadStatus,
  updateLead,
  deleteLead,
  getInvoices,
  addInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  type Lead,
  type LeadStatus,
  type LeadPriority,
  type Invoice,
  type InvoiceStatus,
} from '../../lib/adminStorage'
import { SERVICES } from '../../data/content'
import { AdminHeader, type AdminTab } from './AdminHeader'
import { OverviewTab } from './OverviewTab'
import { LeadsTab } from './LeadsTab'
import { FinanceTab } from './FinanceTab'
import { PerformanceTab } from './PerformanceTab'

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [leads, setLeads] = useState<Lead[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false)

  // Form states for New Lead Modal
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    company: '',
    service: SERVICES[0]?.shortTitle || 'Digital Strategy',
    estimatedValue: 15000,
    priority: 'Medium' as LeadPriority,
    details: '',
    notes: '',
  })

  // Form states for New Invoice Modal
  const [invoiceForm, setInvoiceForm] = useState({
    client: '',
    company: '',
    service: SERVICES[0]?.shortTitle || 'Digital Strategy',
    amount: 10000,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    status: 'Pending' as InvoiceStatus,
    notes: '',
  })

  // Load initial data
  useEffect(() => {
    setLeads(getLeads())
    setInvoices(getInvoices())
  }, [])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Lead handlers
  const handleUpdateLeadStatus = (id: string, status: LeadStatus) => {
    updateLeadStatus(id, status)
    setLeads(getLeads())
    showToast(`Lead status updated to ${status}`)
  }

  const handleUpdateLead = (id: string, changes: Partial<Lead>) => {
    updateLead(id, changes)
    setLeads(getLeads())
    showToast('Lead details updated')
  }

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id)
      setLeads(getLeads())
      showToast('Lead removed')
    }
  }

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadForm.name || !leadForm.email) return

    addLead({
      name: leadForm.name,
      email: leadForm.email,
      company: leadForm.company || 'Private Client',
      service: leadForm.service,
      details: leadForm.details || 'Manually entered through admin console.',
      status: 'New',
      estimatedValue: Number(leadForm.estimatedValue) || 10000,
      priority: leadForm.priority,
      notes: leadForm.notes,
    })

    setLeads(getLeads())
    setShowNewLeadModal(false)
    setLeadForm({
      name: '',
      email: '',
      company: '',
      service: SERVICES[0]?.shortTitle || 'Digital Strategy',
      estimatedValue: 15000,
      priority: 'Medium',
      details: '',
      notes: '',
    })
    showToast('New lead created successfully')
  }

  // Invoice handlers
  const handleUpdateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    updateInvoiceStatus(id, status)
    setInvoices(getInvoices())
    showToast(`Invoice status marked as ${status}`)
  }

  const handleDeleteInvoice = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id)
      setInvoices(getInvoices())
      showToast('Invoice deleted')
    }
  }

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!invoiceForm.client || !invoiceForm.amount) return

    addInvoice({
      client: invoiceForm.client,
      company: invoiceForm.company || invoiceForm.client,
      service: invoiceForm.service,
      amount: Number(invoiceForm.amount) || 0,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: invoiceForm.dueDate,
      status: invoiceForm.status,
      notes: invoiceForm.notes,
    })

    setInvoices(getInvoices())
    setShowNewInvoiceModal(false)
    setInvoiceForm({
      client: '',
      company: '',
      service: SERVICES[0]?.shortTitle || 'Digital Strategy',
      amount: 10000,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
      status: 'Pending',
      notes: '',
    })
    showToast('Invoice generated successfully')
  }

  const newLeadsCount = leads.filter((l) => l.status === 'New').length

  return (
    <div className="min-h-screen bg-[#080909] text-[#F3F1E9] font-sans selection:bg-[#D6F36A] selection:text-[#080909]">
      {/* Background Subtle Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#D6F36A]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalLeads={leads.length}
          newLeadsCount={newLeadsCount}
        />

        {/* Content Area */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <OverviewTab
              leads={leads}
              invoices={invoices}
              onSelectTab={setActiveTab}
              onOpenNewLead={() => setShowNewLeadModal(true)}
              onOpenNewInvoice={() => setShowNewInvoiceModal(true)}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsTab
              leads={leads}
              onUpdateStatus={handleUpdateLeadStatus}
              onUpdateLead={handleUpdateLead}
              onDeleteLead={handleDeleteLead}
              onOpenNewLead={() => setShowNewLeadModal(true)}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceTab
              invoices={invoices}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
              onDeleteInvoice={handleDeleteInvoice}
              onOpenNewInvoice={() => setShowNewInvoiceModal(true)}
            />
          )}

          {activeTab === 'performance' && <PerformanceTab />}
        </main>

        {/* Admin Footer */}
        <footer className="border-t border-white/[0.06] py-5 text-center text-xs text-[#6E716B]">
          <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span>LeadLoom Administrative Operations Suite</span>
              <span className="mx-2">•</span>
              <span className="text-[#A6A79F]">Restricted Access Route (/adminpanel)</span>
            </div>
            <div className="font-mono text-[11px] text-[#A6A79F]">
              LeadLoom Digital Agency © {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181A18] text-[#F3F1E9] border border-[#D6F36A]/40 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#D6F36A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal: Create New Lead */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111311] border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewLeadModal(false)}
              className="absolute top-5 right-5 text-[#A6A79F] hover:text-[#F3F1E9] p-1 rounded-lg"
            >
              ✕
            </button>

            <div>
              <h2 className="text-xl font-serif text-[#F3F1E9]">Record New Client Opportunity</h2>
              <p className="text-xs text-[#A6A79F] mt-0.5">
                Add an inbound enquiry or phone referral to the active pipeline.
              </p>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g. Rachel Adams"
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="e.g. rachel@domain.com"
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Company Name</label>
                  <input
                    type="text"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    placeholder="e.g. Apex BioTech"
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Service Area</label>
                  <select
                    value={leadForm.service}
                    onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.index} value={s.shortTitle}>
                        {s.shortTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={leadForm.estimatedValue}
                    onChange={(e) => setLeadForm({ ...leadForm, estimatedValue: Number(e.target.value) })}
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] font-mono focus:outline-none focus:border-[#D6F36A]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Priority</label>
                  <select
                    value={leadForm.priority}
                    onChange={(e) => setLeadForm({ ...leadForm, priority: e.target.value as LeadPriority })}
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Project Scope & Details</label>
                <textarea
                  rows={2}
                  value={leadForm.details}
                  onChange={(e) => setLeadForm({ ...leadForm, details: e.target.value })}
                  placeholder="Summary of goals, requirements, or scope..."
                  className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#A6A79F] hover:text-[#F3F1E9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D6F36A] text-[#080909] hover:bg-[#c4d957] transition-all"
                >
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Invoice */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111311] border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewInvoiceModal(false)}
              className="absolute top-5 right-5 text-[#A6A79F] hover:text-[#F3F1E9] p-1 rounded-lg"
            >
              ✕
            </button>

            <div>
              <h2 className="text-xl font-serif text-[#F3F1E9]">Issue New Invoice</h2>
              <p className="text-xs text-[#A6A79F] mt-0.5">
                Generate an invoice for client retainers, project milestones, or audits.
              </p>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Client / Contact *</label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.client}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, client: e.target.value })}
                    placeholder="e.g. Liam Gallagher"
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Company / Entity</label>
                  <input
                    type="text"
                    value={invoiceForm.company}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, company: e.target.value })}
                    placeholder="e.g. Arcadian Spirits"
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Deliverable Description</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.service}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, service: e.target.value })}
                  placeholder="e.g. Website & Conversion Sprint Phase 1"
                  className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Amount ($) *</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] font-mono focus:outline-none focus:border-[#D6F36A]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Due Date</label>
                  <input
                    type="date"
                    required
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] font-mono focus:outline-none focus:border-[#D6F36A]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#A6A79F] mb-1 font-mono uppercase text-[10px]">Status</label>
                  <select
                    value={invoiceForm.status}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value as InvoiceStatus })}
                    className="w-full bg-[#181A18] border border-white/10 rounded-lg p-2.5 text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#A6A79F] hover:text-[#F3F1E9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D6F36A] text-[#080909] hover:bg-[#c4d957] transition-all"
                >
                  Save & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
