/**
 * ANTARA Admin Console – Strict Monochrome & Lime Design Tokens
 * 
 * Main background: #090A09
 * Card and panel background: #10120F
 * Elevated background: #151713
 * Primary text: #EAEAE3
 * Secondary text: #A3A49A
 * Muted text: #777970
 * Borders and dividers: #292B26
 * Primary accent: #D7F56B
 * Subtle accent background: rgba(215,245,107,0.10)
 */

export const ADMIN_THEME = {
  bg: '#090A09',
  card: '#10120F',
  elevated: '#151713',
  textPrimary: '#EAEAE3',
  textSecondary: '#A3A49A',
  textMuted: '#777970',
  border: '#292B26',
  accent: '#D7F56B',
  accentBg: 'rgba(215,245,107,0.10)',
} as const

/**
 * Unified Monochrome & Lime Status Badges
 * All badges share:
 * - Identical height (h-5 / text-[10px] leading-none)
 * - Consistent padding (px-2 py-0.5)
 * - Consistent typography (font-mono uppercase tracking-wider)
 * - Consistent border radius (rounded)
 */
export const LEAD_STATUS_BADGES: Record<string, string> = {
  New: 'bg-[#151713] text-[#D7F56B] border border-[#292B26]',
  'In Review': 'bg-[#151713] text-[#D7F56B] border border-[#292B26]',
  Contacted: 'bg-[#151713] text-[#D7F56B] border border-[#292B26]',
  'Proposal Sent': 'bg-[#151713] text-[#D7F56B] border border-[#292B26]',
  Won: 'bg-[#D7F56B]/10 text-[#D7F56B] border border-[#D7F56B]/25 font-medium',
  Lost: 'bg-[#151713] text-[#A3A49A] border border-[#292B26]',
}

export const LEAD_PRIORITY_BADGES: Record<string, string> = {
  High: 'bg-[#151713] text-[#EAEAE3] border border-[#292B26] font-medium',
  Medium: 'bg-[#151713] text-[#A3A49A] border border-[#292B26]',
  Low: 'bg-[#151713] text-[#777970] border border-[#292B26]',
}

export const INVOICE_STATUS_BADGES: Record<string, string> = {
  Paid: 'bg-[#D7F56B]/10 text-[#D7F56B] border border-[#D7F56B]/25 font-medium',
  Pending: 'bg-[#151713] text-[#EAEAE3] border border-[#292B26]',
  Overdue: 'bg-[#151713] text-[#EAEAE3] border border-[#292B26]',
}

