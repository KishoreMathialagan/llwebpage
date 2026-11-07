import { useState } from 'react'
import { Logo } from '../Logo'
import { navigateTo } from '../../lib/router'

export type AdminTab = 'overview' | 'leads' | 'finance' | 'performance' | 'cms'

interface Props {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  totalLeads: number
  newLeadsCount: number
}

export function AdminHeader({ activeTab, setActiveTab, newLeadsCount }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs: { id: AdminTab; label: string; badge?: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    {
      id: 'leads',
      label: 'Pipeline CRM',
      badge: newLeadsCount > 0 ? `${newLeadsCount} New` : undefined,
      icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    },
    {
      id: 'finance',
      label: 'Financials',
      icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
    },
    {
      id: 'performance',
      label: 'Observability',
      badge: '98/100',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z',
    },
    {
      id: 'cms',
      label: 'Content CMS',
      badge: 'Services & Works',
      icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
    },
  ]

  const currentTab = tabs.find((t) => t.id === activeTab)

  return (
    <header className="border-b border-[#292B26] bg-[#090A09]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Left Brand & Status */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <Logo variant="symbol" className="h-6 w-auto" />
              <span className="font-semibold text-sm tracking-tight text-[#EAEAE3]">ANTARA</span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-[#151713] border border-[#292B26] text-[#A3A49A]">
                Operations
              </span>
            </button>

            {/* Live system status */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#292B26] text-[11px] text-[#777970]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D7F56B] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D7F56B]"></span>
              </span>
              <span className="font-medium text-[#A3A49A]">Operational</span>
              <span className="text-[#292B26]">•</span>
              <span className="font-mono text-[10px] text-[#777970]">99.98%</span>
              <span className="text-[#292B26]">•</span>
              <span className="font-mono text-[10px] text-[#777970]">v1.4.2</span>
            </div>
          </div>

          {/* Center Tabs Navigation - Desktop */}
          <nav className="hidden md:flex items-center p-0.5 rounded-lg bg-[#10120F] border border-[#292B26] gap-1 overflow-x-auto scrollbar-none" aria-label="Admin tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`relative flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#151713] text-[#EAEAE3] border border-[#292B26] shadow-sm'
                      : 'text-[#A3A49A] hover:text-[#EAEAE3] hover:bg-[#151713]'
                  }`}
                >
                  <svg className={`w-3.5 h-3.5 ${isActive ? 'text-[#D7F56B]' : 'text-[#777970]'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 font-mono uppercase rounded ${
                        isActive
                          ? 'bg-[#D7F56B]/10 text-[#D7F56B] border border-[#D7F56B]/25'
                          : 'bg-[#151713] text-[#A3A49A] border border-[#292B26]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action: View Site & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View Site */}
            <button
              type="button"
              onClick={() => {
                navigateTo('/')
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#10120F] hover:bg-[#151713] text-[#A3A49A] hover:text-[#EAEAE3] border border-[#292B26] transition-colors"
              title="Return to public website"
            >
              <span>View Site</span>
              <svg className="w-3.5 h-3.5 text-[#777970]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>

            {/* Mobile Tab Dropdown Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#151713] border border-[#292B26] text-[#EAEAE3]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="truncate max-w-[90px]">{currentTab?.label}</span>
              <svg className="w-3 h-3 text-[#777970]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Tray */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#292B26] bg-[#10120F] p-2 space-y-1 animate-fadeIn">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#151713] text-[#D7F56B] border border-[#292B26]'
                    : 'text-[#A3A49A] hover:text-[#EAEAE3] hover:bg-[#151713]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className={`w-3.5 h-3.5 ${isActive ? 'text-[#D7F56B]' : 'text-[#777970]'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#151713] border border-[#292B26] text-[#A3A49A]">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}
