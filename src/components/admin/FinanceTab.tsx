import { useState, useMemo } from 'react'
import type { Invoice, InvoiceStatus } from '../../lib/adminStorage'
import { INVOICE_STATUS_BADGES } from './adminTheme'
import { AdminCustomSelect } from './AdminCustomSelect'

interface Props {
  invoices: Invoice[]
  onUpdateInvoiceStatus: (id: string, status: InvoiceStatus) => void
  onDeleteInvoice: (id: string) => void
  onOpenNewInvoice: () => void
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#292B26]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#EAEAE3] tracking-tight">
            Financial Management & Billing
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A49A] mt-0.5">
            Track agency invoicing, retainer billing streams, and expenditure analytics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewInvoice}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial Health KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#777970]">Total Invoiced</div>
          <div className="text-xl sm:text-2xl font-mono font-medium text-[#EAEAE3] mt-1 tabular-nums">
            ${totalBilled.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#777970] mt-1">{invoices.length} issued invoices</div>
        </div>

        <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#777970]">Collected / Settled</div>
          <div className="text-xl sm:text-2xl font-mono font-medium text-[#D7F56B] mt-1 tabular-nums">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#777970] mt-1">
            {paidInvoices.length} paid invoices
          </div>
        </div>

        <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#777970]">Pending Payment</div>
          <div className="text-xl sm:text-2xl font-mono font-medium text-[#EAEAE3] mt-1 tabular-nums">
            ${totalPending.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#777970] mt-1">{pendingInvoices.length} awaiting settlement</div>
        </div>

        <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg">
          <div className="text-[10px] font-mono uppercase text-[#777970]">Overdue Amount</div>
          <div className="text-xl sm:text-2xl font-mono font-medium text-[#EAEAE3] mt-1 tabular-nums">
            ${totalOverdue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#777970] mt-1">{overdueInvoices.length} overdue notices</div>
        </div>
      </div>

      {/* Middle Row: Cash Flow Chart & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cash Flow Timeline Chart (2 cols) */}
        <div className="lg:col-span-2 bg-[#10120F] border border-[#292B26] rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#292B26] mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#EAEAE3]">6-Month Financial Trajectory</h2>
              <p className="text-xs text-[#777970] mt-0.5">Gross Revenue vs Operational Expenditure</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#D7F56B]" />
                <span className="text-[#EAEAE3]">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#292B26]" />
                <span className="text-[#A3A49A]">Expenses</span>
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
                      className="w-full max-w-[28px] bg-[#D7F56B] rounded-t-xs transition-all group-hover:brightness-110 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#151713] border border-[#292B26] rounded text-[10px] font-mono text-[#D7F56B] whitespace-nowrap z-10 pointer-events-none">
                        ${(item.revenue / 1000).toFixed(1)}k
                      </div>
                    </div>
                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expHeight}%` }}
                      className="w-full max-w-[28px] bg-[#292B26] rounded-t-xs transition-all group-hover:bg-[#343731] relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#151713] border border-[#292B26] rounded text-[10px] font-mono text-[#A3A49A] whitespace-nowrap z-10 pointer-events-none">
                        ${(item.expense / 1000).toFixed(1)}k
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#777970]">{item.month}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#292B26] flex items-center justify-between text-xs text-[#777970]">
            <span>Net Operating Margin: <strong className="text-[#D7F56B] font-mono">47.0%</strong></span>
            <span>Monthly Growth Rate: <strong className="text-[#EAEAE3] font-mono">+8.9% MoM</strong></span>
          </div>
        </div>

        {/* Expense Categories (1 col) */}
        <div className="bg-[#10120F] border border-[#292B26] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#292B26] mb-4">
              <h2 className="text-sm font-semibold text-[#EAEAE3]">Expense Allocation</h2>
              <span className="text-xs font-mono text-[#A3A49A]">$34,000/mo</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#EAEAE3]">Creative & Engineering Talent</span>
                  <span className="font-mono text-[#D7F56B]">42% ($14.2k)</span>
                </div>
                <div className="h-1 bg-[#151713] rounded-full overflow-hidden border border-[#292B26]">
                  <div className="bg-[#D7F56B] h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#EAEAE3]">Media Spend & Ad Operations</span>
                  <span className="font-mono text-[#A3A49A]">28% ($9.5k)</span>
                </div>
                <div className="h-1 bg-[#151713] rounded-full overflow-hidden border border-[#292B26]">
                  <div className="bg-[#A3A49A] h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#EAEAE3]">Cloud Infrastructure & GPU</span>
                  <span className="font-mono text-[#777970]">16% ($5.4k)</span>
                </div>
                <div className="h-1 bg-[#151713] rounded-full overflow-hidden border border-[#292B26]">
                  <div className="bg-[#777970] h-full rounded-full" style={{ width: '16%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#EAEAE3]">Operations, Legal & SaaS</span>
                  <span className="font-mono text-[#777970]">14% ($4.8k)</span>
                </div>
                <div className="h-1 bg-[#151713] rounded-full overflow-hidden border border-[#292B26]">
                  <div className="bg-[#3A3D36] h-full rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#292B26] text-[11px] text-[#777970]">
            All billing and payroll cycles aligned to 1st & 15th monthly.
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#10120F] border border-[#292B26] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#292B26] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#10120F]">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#EAEAE3]">Invoices & Billings</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#151713] border border-[#292B26] text-[#A3A49A]">
              {filteredInvoices.length} Invoices
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center p-0.5 bg-[#151713] rounded-md border border-[#292B26] text-xs">
              {(['all', 'Paid', 'Pending', 'Overdue'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded-sm transition-colors uppercase font-mono text-[10px] ${
                    statusFilter === filter
                      ? 'bg-[#D7F56B] text-[#090A09] font-semibold'
                      : 'text-[#A3A49A] hover:text-[#EAEAE3]'
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
              className="bg-[#151713] border border-[#292B26] rounded-md px-3 py-1.5 text-xs text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 placeholder-[#777970]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151713] text-[#777970] font-mono text-[10px] uppercase tracking-wider border-b border-[#292B26]">
              <tr>
                <th className="py-2.5 px-4 font-normal">Invoice #</th>
                <th className="py-2.5 px-4 font-normal">Client / Company</th>
                <th className="py-2.5 px-4 font-normal">Service</th>
                <th className="py-2.5 px-4 font-normal">Due Date</th>
                <th className="py-2.5 px-4 font-normal">Amount</th>
                <th className="py-2.5 px-4 font-normal">Status</th>
                <th className="py-2.5 px-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292B26] text-[#EAEAE3]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#777970]">
                    No invoices match your search.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#D7F56B]/[0.03] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-[#D7F56B]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#EAEAE3]">{inv.client}</div>
                        <div className="text-[11px] text-[#777970]">{inv.company}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#A3A49A]">{inv.service}</td>
                      <td className="py-3 px-4 font-mono text-xs text-[#777970]">{inv.dueDate}</td>
                      <td className="py-3 px-4 font-mono font-medium text-[#EAEAE3] tabular-nums">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <AdminCustomSelect
                          value={inv.status}
                          onChange={(val) => onUpdateInvoiceStatus(inv.id, val as InvoiceStatus)}
                          variant="badge"
                          options={[
                            { label: 'Paid', value: 'Paid', badgeClass: INVOICE_STATUS_BADGES.Paid },
                            { label: 'Pending', value: 'Pending', badgeClass: INVOICE_STATUS_BADGES.Pending },
                            { label: 'Overdue', value: 'Overdue', badgeClass: INVOICE_STATUS_BADGES.Overdue },
                          ]}
                          ariaLabel={`Update status for invoice ${inv.invoiceNumber}`}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1 text-xs text-[#777970] hover:text-[#EAEAE3] hover:bg-[#151713] rounded transition-colors"
                          title="Delete invoice"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
