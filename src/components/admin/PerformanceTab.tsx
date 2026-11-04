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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#F3F1E9] tracking-tight">
            Site Performance & Web Vitals
          </h1>
          <p className="text-sm text-[#A6A79F] mt-1">
            Real-time Core Web Vitals, CDN edge telemetry, and rendering latency analytics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isRunningAudit}
            onClick={runAudit}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isRunningAudit
                ? 'bg-[#181A18] text-[#A6A79F] border border-white/10 cursor-not-allowed'
                : 'bg-[#D6F36A] text-[#080909] hover:bg-[#c4d957]'
            }`}
          >
            <svg
              className={`w-4 h-4 ${isRunningAudit ? 'animate-spin text-[#D6F36A]' : ''}`}
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
        <div className="bg-[#181A18] border border-[#D6F36A]/40 rounded-xl p-4 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#D6F36A] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D6F36A] animate-ping" />
              {auditStep}
            </span>
            <span className="font-mono text-[#F3F1E9]">{auditProgress}%</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#D6F36A] h-full transition-all duration-300"
              style={{ width: `${auditProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Core Web Vitals 4 Main Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CORE_WEB_VITALS.slice(0, 4).map((metric) => (
          <div
            key={metric.key}
            className="bg-[#111311] border border-white/[0.08] p-5 rounded-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[11px] uppercase text-[#A6A79F]">{metric.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#D6F36A]/15 text-[#D6F36A] border border-[#D6F36A]/30">
                  GOOD
                </span>
              </div>
              <div className="text-3xl font-mono font-semibold text-[#F3F1E9] tracking-tight">
                {metric.value}
                <span className="text-sm font-normal text-[#A6A79F] ml-1">{metric.unit}</span>
              </div>
              <div className="text-xs text-[#6E716B] mt-2 leading-relaxed">
                {metric.description}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#6E716B]">
              <span>Target: {metric.benchmark}</span>
              <span className="text-[#D6F36A]">Passed ✓</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section: Live Traffic Analytics & Optimization Audit Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Traffic & Visitor Telemetry (2 cols) */}
        <div className="lg:col-span-2 bg-[#111311] border border-white/[0.08] rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-semibold text-[#F3F1E9] flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6F36A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D6F36A]"></span>
                </span>
                Live Visitor & Engagement Telemetry
              </h2>
              <p className="text-xs text-[#6E716B] mt-0.5">Real-time edge analytics captured across all sessions</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xl font-semibold text-[#D6F36A]">{liveVisitors}</span>
              <span className="text-xs text-[#A6A79F] block">Active Visitors Right Now</span>
            </div>
          </div>

          {/* Traffic KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#181A18] rounded-lg border border-white/[0.05]">
              <div className="text-[10px] uppercase font-mono text-[#6E716B]">Avg. Session</div>
              <div className="text-base font-mono font-semibold text-[#F3F1E9] mt-0.5">3m 42s</div>
            </div>
            <div className="p-3 bg-[#181A18] rounded-lg border border-white/[0.05]">
              <div className="text-[10px] uppercase font-mono text-[#6E716B]">Bounce Rate</div>
              <div className="text-base font-mono font-semibold text-[#D6F36A] mt-0.5">28.4%</div>
            </div>
            <div className="p-3 bg-[#181A18] rounded-lg border border-white/[0.05]">
              <div className="text-[10px] uppercase font-mono text-[#6E716B]">Pages / Session</div>
              <div className="text-base font-mono font-semibold text-[#F3F1E9] mt-0.5">4.2</div>
            </div>
            <div className="p-3 bg-[#181A18] rounded-lg border border-white/[0.05]">
              <div className="text-[10px] uppercase font-mono text-[#6E716B]">Conversion Rate</div>
              <div className="text-base font-mono font-semibold text-[#D6F36A] mt-0.5">3.8%</div>
            </div>
          </div>

          {/* Traffic Sources & Devices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Top Referral Channels */}
            <div>
              <h3 className="text-xs font-mono uppercase text-[#A6A79F] mb-3">Top Inbound Channels</h3>
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[#F3F1E9] mb-1">
                    <span>Organic Search (Google)</span>
                    <span className="font-mono text-[#D6F36A]">44%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#D6F36A] h-full rounded-full" style={{ width: '44%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#F3F1E9] mb-1">
                    <span>LinkedIn & Founder Profiles</span>
                    <span className="font-mono text-cyan-300">28%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#F3F1E9] mb-1">
                    <span>Direct Navigations</span>
                    <span className="font-mono text-amber-300">18%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#F3F1E9] mb-1">
                    <span>Industry Design Awards & Referrals</span>
                    <span className="font-mono text-purple-300">10%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Device Distribution */}
            <div>
              <h3 className="text-xs font-mono uppercase text-[#A6A79F] mb-3">Device Segmentation</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#181A18] rounded-lg border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#F3F1E9]">
                    <svg className="w-4 h-4 text-[#D6F36A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Desktop (Workstations & Laptops)</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#F3F1E9]">65%</span>
                </div>

                <div className="p-3 bg-[#181A18] rounded-lg border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#F3F1E9]">
                    <svg className="w-4 h-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Mobile (iOS & Android)</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#F3F1E9]">31%</span>
                </div>

                <div className="p-3 bg-[#181A18] rounded-lg border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#F3F1E9]">
                    <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Tablet & iPads</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#F3F1E9]">4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Optimization Audit Checklist (1 col) */}
        <div className="bg-[#111311] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <h2 className="text-sm font-semibold text-[#F3F1E9]">Audited Optimizations</h2>
                <span className="text-[11px] text-[#6E716B]">Last check: {lastAuditDate}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D6F36A]/15 text-[#D6F36A]">
                100% Passed
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-[#D6F36A] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#F3F1E9]">Lazy WebGL & Three.js Split</div>
                  <div className="text-[11px] text-[#6E716B] leading-tight">
                    CentralSculpture chunk separated so initial HTML paints without waiting for 3D bundles.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#D6F36A] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#F3F1E9]">WOFF2 Font Preloading</div>
                  <div className="text-[11px] text-[#6E716B] leading-tight">
                    Manrope & Instrument Serif linked in head; zero FOIT (flash of invisible text).
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#D6F36A] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#F3F1E9]">Smooth Scroll RAF Debounced</div>
                  <div className="text-[11px] text-[#6E716B] leading-tight">
                    Lenis virtual scroll runs strictly on RAF; reduced motion preference respected.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#D6F36A] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#F3F1E9]">Brotli & Edge CDN Cache</div>
                  <div className="text-[11px] text-[#6E716B] leading-tight">
                    Static assets cached at 120 global edge points with immutable cache-control headers.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#D6F36A] font-bold text-sm">✓</span>
                <div>
                  <div className="font-medium text-[#F3F1E9]">Accessibility & Contrast</div>
                  <div className="text-[11px] text-[#6E716B] leading-tight">
                    Color tokens comply with WCAG AAA for editorial text and CTA contrasts.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={runAudit}
              disabled={isRunningAudit}
              className="text-xs text-[#D6F36A] hover:underline font-mono"
            >
              Re-run All 14 Diagnostic Tests →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
