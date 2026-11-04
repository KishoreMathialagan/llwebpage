import { useState, useMemo } from 'react'
import type { Invoice, InvoiceStatus } from '../../lib/adminStorage'

interface Props {
  invoices: Invoice[]
  onUpdateInvoiceStatus: (id: string, status: InvoiceStatus) => void
  onDeleteInvoice: (id: string) => void
  onOpenNewInvoice: () => void
}

const STATUS_CONFIG: Record<InvoiceStatus, { bg: string; text: string; border: string }> = {
  Paid: { bg: 'bg-[#D6F36A]/15', text: 'text-[#D6F36A]', border: 'border-[#D6F36A]/30' },
  Pending: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20' },
  Overdue: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
}

// Sample monthly cashflow trend data
const MONTHLY_TREND = [
  { month: 'Jun', revenue: 38400, expense: 22100 },
  { month: 'Jul', revenue: 42600, expense: 24800 },
  { month: 'Aug', revenue: 46200, expense: 25400 },
  { month: 'Sep', revenue: 51800, expense: 28200 },
  { month: 'Oct', revenue: 58900, expense: 31400 },
  { month: 'Nov', revenue: 64200, expense: 34000 },
]

export function FinanceTab({
  invoices,
  onUpdateInvoiceStatus,
  onDeleteInvoice,
  onOpenNewInvoice,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Aggregates
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.amount, 0)
  const paidInvoices = invoices.filter((i) => i.status === 'Paid')
  const totalPaid = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0)
  const pendingInvoices = invoices.filter((i) => i.status === 'Pending')
  const totalPending = pendingInvoices.reduce((acc, curr) => acc + curr.amount, 0)
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue')
  const totalOverdue = overdueInvoices.reduce((acc, curr) => acc + curr.amount, 0)

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.service.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = statusFilter === 'all' || inv.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [invoices, searchTerm, statusFilter])

  // Max value for chart scaling
  const maxBarValue = Math.max(...MONTHLY_TREND.map((d) => d.revenue))

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#F3F1E9] tracking-tight">
            Financial Management & Billing
          </h1>
          <p className="text-sm text-[#A6A79F] mt-1">
            Track agency invoicing, retainer billing streams, and expenditure analytics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewInvoice}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#D6F36A] text-[#080909] hover:bg-[#c4d957] transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial Health KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase text-[#A6A79F]">Total Invoiced</div>
          <div className="text-xl sm:text-2xl font-mono font-semibold text-[#F3F1E9] mt-1">
            ${totalBilled.toLocaleString()}
          </div>
          <div className="text-xs text-[#6E716B] mt-1">{invoices.length} issued invoices</div>
        </div>

        <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase text-[#A6A79F]">Collected / Settled</div>
          <div className="text-xl sm:text-2xl font-mono font-semibold text-[#D6F36A] mt-1">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="text-xs text-[#6E716B] mt-1">
            {paidInvoices.length} paid invoices
          </div>
        </div>

        <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase text-[#A6A79F]">Pending Payment</div>
          <div className="text-xl sm:text-2xl font-mono font-semibold text-amber-300 mt-1">
            ${totalPending.toLocaleString()}
          </div>
          <div className="text-xs text-[#6E716B] mt-1">{pendingInvoices.length} awaiting settlement</div>
        </div>

        <div className="bg-[#111311] border border-white/[0.08] p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase text-[#A6A79F]">Overdue Amount</div>
          <div className="text-xl sm:text-2xl font-mono font-semibold text-red-400 mt-1">
            ${totalOverdue.toLocaleString()}
          </div>
          <div className="text-xs text-[#6E716B] mt-1">{overdueInvoices.length} overdue notices</div>
        </div>
      </div>

      {/* Middle Row: Cash Flow Chart & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Timeline Chart (2 cols) */}
        <div className="lg:col-span-2 bg-[#111311] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F3F1E9]">6-Month Financial Trajectory</h2>
              <p className="text-xs text-[#6E716B] mt-0.5">Gross Revenue vs Operational Expenditure</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#D6F36A]" />
                <span className="text-[#F3F1E9]">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-white/20" />
                <span className="text-[#A6A79F]">Expenses</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
            {MONTHLY_TREND.map((item) => {
              const revHeight = (item.revenue / maxBarValue) * 100
              const expHeight = (item.expense / maxBarValue) * 100

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-full max-w-[28px] bg-[#D6F36A] rounded-t-sm transition-all group-hover:brightness-110 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#181A18] border border-white/20 rounded text-[10px] font-mono text-[#D6F36A] whitespace-nowrap z-10 pointer-events-none">
                        ${(item.revenue / 1000).toFixed(1)}k
                      </div>
                    </div>
                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expHeight}%` }}
                      className="w-full max-w-[28px] bg-white/20 rounded-t-sm transition-all group-hover:bg-white/30 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#181A18] border border-white/20 rounded text-[10px] font-mono text-[#A6A79F] whitespace-nowrap z-10 pointer-events-none">
                        ${(item.expense / 1000).toFixed(1)}k
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#A6A79F]">{item.month}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#6E716B]">
            <span>Net Operating Margin: <strong className="text-[#D6F36A]">47.0%</strong></span>
            <span>Monthly Growth Rate: <strong className="text-[#F3F1E9]">+8.9% MoM</strong></span>
          </div>
        </div>

        {/* Expense Categories (1 col) */}
        <div className="bg-[#111311] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <h2 className="text-sm font-semibold text-[#F3F1E9]">Expense Allocation</h2>
              <span className="text-xs font-mono text-[#A6A79F]">$34,000/mo</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#F3F1E9]">Creative & Engineering Talent</span>
                  <span className="font-mono text-[#D6F36A]">42% ($14.2k)</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="bg-[#D6F36A] h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#F3F1E9]">Media Spend & Ad Operations</span>
                  <span className="font-mono text-cyan-300">28% ($9.5k)</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#F3F1E9]">Cloud Infrastructure & GPU</span>
                  <span className="font-mono text-amber-300">16% ($5.4k)</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '16%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#F3F1E9]">Operations, Legal & SaaS</span>
                  <span className="font-mono text-purple-300">14% ($4.8k)</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-[#6E716B]">
            All billing and payroll cycles aligned to 1st & 15th monthly.
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#111311] border border-white/[0.08] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#F3F1E9]">Invoices & Billings</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#181a18] border border-white/10 text-[#A6A79F]">
              {filteredInvoices.length} Invoices
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center p-0.5 bg-[#181A18] rounded-lg border border-white/10 text-xs">
              {(['all', 'Paid', 'Pending', 'Overdue'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded transition-colors uppercase font-mono text-[10px] ${
                    statusFilter === filter
                      ? 'bg-[#D6F36A] text-[#080909] font-semibold'
                      : 'text-[#A6A79F] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter invoices..."
              className="bg-[#181A18] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#F3F1E9] focus:outline-none focus:border-[#D6F36A]/50 placeholder-[#6E716B]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#181A18] text-[#A6A79F] font-mono text-[11px] uppercase tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client / Company</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#F3F1E9]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#6E716B]">
                    No invoices match your search.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const statusStyle = STATUS_CONFIG[inv.status]
                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-[#D6F36A]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#F3F1E9]">{inv.client}</div>
                        <div className="text-xs text-[#6E716B]">{inv.company}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#A6A79F]">{inv.service}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#6E716B]">{inv.dueDate}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={inv.status}
                          onChange={(e) => onUpdateInvoiceStatus(inv.id, e.target.value as InvoiceStatus)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase cursor-pointer focus:outline-none ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <option value="Paid" className="bg-[#181A18] text-[#F3F1E9]">Paid</option>
                          <option value="Pending" className="bg-[#181A18] text-[#F3F1E9]">Pending</option>
                          <option value="Overdue" className="bg-[#181A18] text-[#F3F1E9]">Overdue</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
                          title="Delete invoice"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
