import { Wordmark } from '../Icons'
import { navigateTo } from '../../lib/router'

export type AdminTab = 'overview' | 'leads' | 'finance' | 'performance'

interface Props {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  totalLeads: number
  newLeadsCount: number
}

export function AdminHeader({ activeTab, setActiveTab, newLeadsCount }: Props) {
  const tabs: { id: AdminTab; label: string; badge?: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    {
      id: 'leads',
      label: 'Lead Management',
      badge: newLeadsCount > 0 ? `${newLeadsCount} New` : undefined,
      icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    },
    {
      id: 'finance',
      label: 'Finance Management',
      icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
    },
    {
      id: 'performance',
      label: 'Site Performance',
      badge: '98/100',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z',
    },
  ]

  return (
    <header className="border-b border-white/[0.08] bg-[#0c0d0c]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Left Brand & Badge */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <Wordmark className="text-xl sm:text-2xl text-[#F3F1E9] font-medium" />
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-widest font-mono uppercase bg-[#181a18] border border-[#D6F36A]/30 text-[#D6F36A]">
                Admin Console
              </span>
            </button>

            {/* Health pill */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10 text-[11px] text-[#A6A79F]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6F36A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D6F36A]"></span>
              </span>
              <span>All Systems Operational</span>
              <span className="text-[#6E716B]">•</span>
              <span className="font-mono text-[10px] text-[#6E716B]">v1.4.2</span>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none" aria-label="Admin tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#181A18] text-[#F3F1E9] shadow-sm border border-white/15'
                      : 'text-[#A6A79F] hover:text-[#F3F1E9] hover:bg-white/[0.03]'
                  }`}
                >
                  <svg className={`w-3.5 h-3.5 ${isActive ? 'text-[#D6F36A]' : 'opacity-60'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono uppercase ${
                        isActive
                          ? 'bg-[#D6F36A] text-[#080909] font-semibold'
                          : 'bg-white/10 text-[#D6F36A]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-[#D6F36A] rounded-full" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action: Return to Website */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                navigateTo('/')
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.09] text-[#F3F1E9] border border-white/10 transition-colors"
              title="Return to public website"
            >
              <span>View Site</span>
              <svg className="w-3.5 h-3.5 text-[#D6F36A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
