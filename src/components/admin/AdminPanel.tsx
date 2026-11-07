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
import { CMSTab } from './cms/CMSTab'
import { AdminCustomSelect } from './AdminCustomSelect'

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
      estimatedValue: Number(leadForm.estimatedValue) || 10000,
      status: 'New',
      priority: leadForm.priority,
      details: leadForm.details || 'Direct inbound inquiry.',
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
    showToast('Client inquiry recorded in pipeline')
  }

  // Invoice handlers
  const handleUpdateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    updateInvoiceStatus(id, status)
    setInvoices(getInvoices())
    showToast(`Invoice status updated to ${status}`)
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
      company: invoiceForm.company || 'Private Client',
      service: invoiceForm.service,
      amount: Number(invoiceForm.amount) || 5000,
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
    <div className="min-h-screen bg-[#090A09] text-[#EAEAE3] font-sans selection:bg-[#D7F56B] selection:text-[#090A09]">
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalLeads={leads.length}
          newLeadsCount={newLeadsCount}
        />

        {/* Content Area */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

          {activeTab === 'cms' && <CMSTab onShowToast={showToast} />}
        </main>

        {/* Admin Footer */}
        <footer className="border-t border-[#292B26] py-4 text-xs text-[#777970] bg-[#090A09]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#A3A49A] font-medium">ANTARA Operations Suite</span>
              <span className="text-[#292B26]">•</span>
              <span className="text-[#777970]">Internal Route (/adminpanel)</span>
            </div>
            <div className="font-mono text-[11px] text-[#777970]">
              ANTARA Digital Agency © {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151713] text-[#EAEAE3] border border-[#292B26] px-3.5 py-2.5 rounded-md shadow-xl flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7F56B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal: Create New Lead */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#10120F] border border-[#292B26] rounded-lg w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewLeadModal(false)}
              className="absolute top-4 right-4 text-[#777970] hover:text-[#EAEAE3] p-1 rounded transition-colors text-sm"
              title="Close"
            >
              ✕
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#EAEAE3] tracking-tight">Record New Client Opportunity</h2>
              <p className="text-xs text-[#A3A49A] mt-0.5">
                Add an inbound inquiry or referral to the active pipeline.
              </p>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g. Rachel Adams"
                    className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="e.g. rachel@domain.com"
                    className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Company Name</label>
                  <input
                    type="text"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    placeholder="e.g. Apex BioTech"
                    className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Service Area</label>
                  <AdminCustomSelect
                    value={leadForm.service}
                    onChange={(val) => setLeadForm({ ...leadForm, service: val })}
                    variant="full"
                    options={SERVICES.map((s) => ({ label: s.shortTitle, value: s.shortTitle }))}
                    ariaLabel="Select Service Area"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={leadForm.estimatedValue}
                    onChange={(e) => setLeadForm({ ...leadForm, estimatedValue: Number(e.target.value) })}
                    className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] font-mono focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Priority</label>
                  <AdminCustomSelect
                    value={leadForm.priority}
                    onChange={(val) => setLeadForm({ ...leadForm, priority: val as LeadPriority })}
                    variant="full"
                    options={[
                      { label: 'High Priority', value: 'High' },
                      { label: 'Medium Priority', value: 'Medium' },
                      { label: 'Low Priority', value: 'Low' },
                    ]}
                    ariaLabel="Select Priority"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Project Scope & Details</label>
                <textarea
                  rows={2}
                  value={leadForm.details}
                  onChange={(e) => setLeadForm({ ...leadForm, details: e.target.value })}
                  placeholder="Summary of goals, requirements, or scope..."
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#292B26]">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-3.5 py-2 rounded-md text-xs text-[#A3A49A] hover:text-[#EAEAE3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#10120F] border border-[#292B26] rounded-lg w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewInvoiceModal(false)}
              className="absolute top-4 right-4 text-[#777970] hover:text-[#EAEAE3] p-1 rounded transition-colors text-sm"
              title="Close"
            >
              ✕
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#EAEAE3] tracking-tight">Issue New Invoice</h2>
              <p className="text-xs text-[#A3A49A] mt-0.5">
                Generate an invoice for client retainers, project milestones, or audits.
              </p>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Client / Contact *</label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.client}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, client: e.target.value })}
                    placeholder="e.g. Liam Gallagher"
                    className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Company / Entity</label>
                  <input
                    type="text"
                    value={invoiceForm.company}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, company: e.target.value })}
                    placeholder="e.g. Arcadian Spirits"
                    className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Deliverable Description</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.service}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, service: e.target.value })}
                  placeholder="e.g. Website & Conversion Sprint Phase 1"
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Amount ($) *</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] font-mono focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Due Date</label>
                  <input
                    type="date"
                    required
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] font-mono focus:outline-none focus:border-[#D7F56B]/60 focus:ring-1 focus:ring-[#D7F56B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Status</label>
                  <AdminCustomSelect
                    value={invoiceForm.status}
                    onChange={(val) => setInvoiceForm({ ...invoiceForm, status: val as InvoiceStatus })}
                    variant="full"
                    options={[
                      { label: 'Pending', value: 'Pending' },
                      { label: 'Paid', value: 'Paid' },
                      { label: 'Overdue', value: 'Overdue' },
                    ]}
                    ariaLabel="Select Invoice Status"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#292B26]">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-3.5 py-2 rounded-md text-xs text-[#A3A49A] hover:text-[#EAEAE3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors shadow-sm"
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
