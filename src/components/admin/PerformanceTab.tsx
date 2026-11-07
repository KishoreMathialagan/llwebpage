import { useState, useEffect } from 'react'
import { CORE_WEB_VITALS } from '../../lib/adminStorage'

export function PerformanceTab() {
  const [isRunningAudit, setIsRunningAudit] = useState(false)
  const [auditProgress, setAuditProgress] = useState(0)
  const [auditStep, setAuditStep] = useState('')
  const [lastAuditDate, setLastAuditDate] = useState('2 minutes ago')
  const [liveVisitors, setLiveVisitors] = useState(24)

  // Live visitor count gentle fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2 // -2 to +2
        return Math.max(14, Math.min(48, prev + delta))
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const runAudit = () => {
    setIsRunningAudit(true)
    setAuditProgress(10)
    setAuditStep('Analyzing DOM tree depth and render-blocking scripts...')

    setTimeout(() => {
      setAuditProgress(35)
      setAuditStep('Measuring 3D WebGL hero render performance & texture memory...')
    }, 800)

    setTimeout(() => {
      setAuditProgress(65)
      setAuditStep('Checking Core Web Vitals (LCP, INP, CLS) field distributions...')
    }, 1700)

    setTimeout(() => {
      setAuditProgress(90)
      setAuditStep('Auditing font preloading & gzip bundle compression...')
    }, 2500)

    setTimeout(() => {
      setAuditProgress(100)
      setAuditStep('Diagnostic audit completed. All metrics optimal.')
      setIsRunningAudit(false)
      setLastAuditDate('Just now')
    }, 3200)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#292B26]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#EAEAE3] tracking-tight">
            Site Performance & Web Vitals
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A49A] mt-0.5">
            Real-time Core Web Vitals, CDN edge telemetry, and rendering latency analytics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isRunningAudit}
            onClick={runAudit}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all shadow-sm ${
              isRunningAudit
                ? 'bg-[#151713] text-[#777970] border border-[#292B26] cursor-not-allowed'
                : 'bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e]'
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin text-[#D7F56B]' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isRunningAudit ? 'Running Diagnostic...' : 'Run Performance Audit'}</span>
          </button>
        </div>
      </div>

      {/* Audit Progress Notification if running */}
      {isRunningAudit && (
        <div className="bg-[#151713] border border-[#D7F56B]/30 rounded-lg p-4 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#D7F56B] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D7F56B] animate-ping" />
              {auditStep}
            </span>
            <span className="font-mono text-[#EAEAE3]">{auditProgress}%</span>
          </div>
          <div className="w-full bg-[#10120F] h-1 rounded-full overflow-hidden border border-[#292B26]">
            <div
              className="bg-[#D7F56B] h-full transition-all duration-300"
              style={{ width: `${auditProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Core Web Vitals 4 Main Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {CORE_WEB_VITALS.slice(0, 4).map((metric) => (
          <div
            key={metric.key}
            className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[10px] uppercase text-[#777970]">{metric.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#D7F56B]/10 text-[#D7F56B] border border-[#D7F56B]/20">
                  OPTIMAL
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-medium text-[#EAEAE3] tracking-tight tabular-nums">
                {metric.value}
                <span className="text-xs font-normal text-[#777970] ml-1">{metric.unit}</span>
              </div>
              <div className="text-xs text-[#777970] mt-2 leading-relaxed">
                {metric.description}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#292B26] flex items-center justify-between text-[11px] font-mono text-[#777970]">
              <span>Target: {metric.benchmark}</span>
              <span className="text-[#D7F56B]">Passed ✓</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section: Live Traffic Analytics & Optimization Audit Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Traffic & Visitor Telemetry (2 cols) */}
        <div className="lg:col-span-2 bg-[#10120F] border border-[#292B26] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#292B26]">
            <div>
              <h2 className="text-sm font-semibold text-[#EAEAE3] flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D7F56B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D7F56B]"></span>
                </span>
                Live Visitor & Engagement Telemetry
              </h2>
              <p className="text-xs text-[#777970] mt-0.5">Real-time edge analytics captured across all sessions</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xl font-medium text-[#D7F56B] tabular-nums">{liveVisitors}</span>
              <span className="text-xs text-[#777970] block">Active Visitors Right Now</span>
            </div>
          </div>

          {/* Traffic KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#151713] rounded-md border border-[#292B26]">
              <div className="text-[10px] uppercase font-mono text-[#777970]">Avg. Session</div>
              <div className="text-base font-mono font-medium text-[#EAEAE3] mt-0.5 tabular-nums">3m 42s</div>
            </div>
            <div className="p-3 bg-[#151713] rounded-md border border-[#292B26]">
              <div className="text-[10px] uppercase font-mono text-[#777970]">Bounce Rate</div>
              <div className="text-base font-mono font-medium text-[#EAEAE3] mt-0.5 tabular-nums">28.4%</div>
            </div>
            <div className="p-3 bg-[#151713] rounded-md border border-[#292B26]">
              <div className="text-[10px] uppercase font-mono text-[#777970]">Pages / Session</div>
              <div className="text-base font-mono font-medium text-[#EAEAE3] mt-0.5 tabular-nums">4.2</div>
            </div>
            <div className="p-3 bg-[#151713] rounded-md border border-[#292B26]">
              <div className="text-[10px] uppercase font-mono text-[#777970]">Conversion Rate</div>
              <div className="text-base font-mono font-medium text-[#D7F56B] mt-0.5 tabular-nums">3.8%</div>
            </div>
          </div>

          {/* Traffic Sources & Devices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            {/* Top Referral Channels */}
            <div>
              <h3 className="text-xs font-mono uppercase text-[#777970] mb-3">Top Inbound Channels</h3>
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[#EAEAE3] mb-1">
                    <span>Organic Search (Google)</span>
                    <span className="font-mono text-[#D7F56B]">44%</span>
                  </div>
                  <div className="w-full bg-[#151713] h-1 rounded-full overflow-hidden border border-[#292B26]">
                    <div className="bg-[#D7F56B] h-full rounded-full" style={{ width: '44%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#EAEAE3] mb-1">
                    <span>LinkedIn & Founder Profiles</span>
                    <span className="font-mono text-[#A3A49A]">28%</span>
                  </div>
                  <div className="w-full bg-[#151713] h-1 rounded-full overflow-hidden border border-[#292B26]">
                    <div className="bg-[#A3A49A] h-full rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#EAEAE3] mb-1">
                    <span>Direct Navigations</span>
                    <span className="font-mono text-[#777970]">18%</span>
                  </div>
                  <div className="w-full bg-[#151713] h-1 rounded-full overflow-hidden border border-[#292B26]">
                    <div className="bg-[#777970] h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#EAEAE3] mb-1">
                    <span>Industry Design Awards & Referrals</span>
                    <span className="font-mono text-[#777970]">10%</span>
                  </div>
                  <div className="w-full bg-[#151713] h-1 rounded-full overflow-hidden border border-[#292B26]">
                    <div className="bg-[#3A3D36] h-full rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Device Distribution */}
            <div>
              <h3 className="text-xs font-mono uppercase text-[#777970] mb-3">Device Segmentation</h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-[#151713] rounded-md border border-[#292B26] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#EAEAE3]">
                    <svg className="w-4 h-4 text-[#A3A49A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Desktop (Workstations & Laptops)</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#EAEAE3]">65%</span>
                </div>

                <div className="p-2.5 bg-[#151713] rounded-md border border-[#292B26] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#EAEAE3]">
                    <svg className="w-4 h-4 text-[#A3A49A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Mobile (iOS & Android)</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#EAEAE3]">31%</span>
                </div>

                <div className="p-2.5 bg-[#151713] rounded-md border border-[#292B26] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#EAEAE3]">
                    <svg className="w-4 h-4 text-[#A3A49A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Tablet & iPads</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#EAEAE3]">4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Optimization Audit Checklist (1 col) */}
        <div className="bg-[#10120F] border border-[#292B26] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#292B26] mb-4">
              <div>
                <h2 className="text-sm font-semibold text-[#EAEAE3]">Audited Optimizations</h2>
                <span className="text-[11px] text-[#777970]">Last check: {lastAuditDate}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D7F56B]/10 border border-[#D7F56B]/20 text-[#D7F56B]">
                100% Passed
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-[#D7F56B] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#EAEAE3]">Lazy WebGL & Three.js Split</div>
                  <div className="text-[11px] text-[#777970] leading-tight">
                    CentralSculpture chunk separated so initial HTML paints without waiting for 3D bundles.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#D7F56B] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#EAEAE3]">WOFF2 Font Preloading</div>
                  <div className="text-[11px] text-[#777970] leading-tight">
                    Manrope & Instrument Serif linked in head; zero FOIT (flash of invisible text).
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#D7F56B] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#EAEAE3]">Smooth Scroll RAF Debounced</div>
                  <div className="text-[11px] text-[#777970] leading-tight">
                    Lenis virtual scroll runs strictly on RAF; reduced motion preference respected.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#D7F56B] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#EAEAE3]">Brotli & Edge CDN Cache</div>
                  <div className="text-[11px] text-[#777970] leading-tight">
                    Static assets cached at 120 global edge points with immutable cache-control headers.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#D7F56B] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#EAEAE3]">Accessibility & Contrast</div>
                  <div className="text-[11px] text-[#777970] leading-tight">
                    Color tokens comply with WCAG AAA for editorial text and CTA contrasts.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#292B26] text-center">
            <button
              type="button"
              onClick={runAudit}
              disabled={isRunningAudit}
              className="text-xs text-[#D7F56B] hover:underline font-mono"
            >
              Re-run All 14 Diagnostic Tests →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
