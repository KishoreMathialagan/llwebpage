import type { CMSService, CMSProject } from '../../../lib/cmsStorage'

interface Props {
  services: CMSService[]
  projects: CMSProject[]
  onOpenNewService: () => void
  onOpenNewProject: () => void
  onNavigateToServices: () => void
  onNavigateToWorks: () => void
  onEditService: (service: CMSService) => void
  onEditProject: (project: CMSProject) => void
  onPublishService: (id: string) => void
  onPublishProject: (id: string) => void
}

export function CMSOverview({
  services,
  projects,
  onOpenNewService,
  onOpenNewProject,
  onNavigateToServices,
  onNavigateToWorks,
  onEditService,
  onEditProject,
  onPublishService,
  onPublishProject,
}: Props) {
  const publishedServices = services.filter((s) => s.status === 'Published')
  const draftServices = services.filter((s) => s.status === 'Draft')
  const publishedProjects = projects.filter((p) => p.status === 'Published')
  const draftProjects = projects.filter((p) => p.status === 'Draft')

  // Recently updated items across both services & projects
  const allRecent = [
    ...services.map((s) => ({
      id: s.id,
      title: s.title,
      type: 'Service' as const,
      status: s.status,
      slug: s.slug,
      updatedAt: s.updatedAt,
      raw: s,
    })),
    ...projects.map((p) => ({
      id: p.id,
      title: p.title,
      type: 'Case Study' as const,
      status: p.status,
      slug: p.slug,
      updatedAt: p.updatedAt,
      raw: p,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Items awaiting publication (Drafts)
  const draftsAwaitingPublication = [
    ...draftServices.map((s) => ({ id: s.id, title: s.title, type: 'Service' as const, raw: s })),
    ...draftProjects.map((p) => ({ id: p.id, title: p.title, type: 'Case Study' as const, raw: p })),
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4 CMS KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Published Services */}
        <div
          onClick={onNavigateToServices}
          className="group cursor-pointer bg-[#10120F] border border-[#292B26] hover:border-[#D7F56B]/30 rounded-lg p-4 transition-all duration-150"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#777970]">Published Services</span>
            <span className="text-[#D7F56B] bg-[#D7F56B]/10 border border-[#D7F56B]/20 text-[10px] font-mono px-1.5 py-0.5 rounded">
              LIVE
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-medium text-[#EAEAE3] font-mono tracking-tight tabular-nums">
            {publishedServices.length}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#292B26] flex items-center justify-between text-[11px] text-[#777970]">
            <span>{draftServices.length} in draft</span>
            <span className="text-[#A3A49A] group-hover:text-[#D7F56B] transition-colors font-medium">Manage →</span>
          </div>
        </div>

        {/* Published Works */}
        <div
          onClick={onNavigateToWorks}
          className="group cursor-pointer bg-[#10120F] border border-[#292B26] hover:border-[#D7F56B]/30 rounded-lg p-4 transition-all duration-150"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#777970]">Portfolio Studies</span>
            <span className="text-[#D7F56B] bg-[#D7F56B]/10 border border-[#D7F56B]/20 text-[10px] font-mono px-1.5 py-0.5 rounded">
              LIVE
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-medium text-[#EAEAE3] font-mono tracking-tight tabular-nums">
            {publishedProjects.length}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#292B26] flex items-center justify-between text-[11px] text-[#777970]">
            <span>{draftProjects.length} in draft</span>
            <span className="text-[#A3A49A] group-hover:text-[#D7F56B] transition-colors font-medium">Manage →</span>
          </div>
        </div>

        {/* Draft Items */}
        <div className="bg-[#10120F] border border-[#292B26] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#777970]">Draft Queue</span>
            <span className="text-[#A3A49A] bg-[#151713] border border-[#292B26] text-[10px] font-mono px-1.5 py-0.5 rounded">
              UNPUBLISHED
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-medium text-[#EAEAE3] font-mono tracking-tight tabular-nums">
            {draftServices.length + draftProjects.length}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#292B26] text-[11px] text-[#777970]">
            Awaiting executive sign-off
          </div>
        </div>

        {/* Total Assets / Entries */}
        <div className="bg-[#10120F] border border-[#292B26] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#777970]">Total Content Nodes</span>
            <span className="text-[#A3A49A] bg-[#151713] border border-[#292B26] text-[10px] font-mono px-1.5 py-0.5 rounded">
              CMS DB
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-medium text-[#D7F56B] font-mono tracking-tight tabular-nums">
            {services.length + projects.length}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#292B26] text-[11px] text-[#777970]">
            Stored across services & works
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="p-4 bg-[#10120F] border border-[#292B26] rounded-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold text-[#EAEAE3]">Quick Publishing Actions</h3>
          <p className="text-[11px] text-[#777970] mt-0.5">Publish new agency disciplines or client studies directly to the live site.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewService}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors shadow-sm"
          >
            <span>+ Add Service</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#151713] text-[#EAEAE3] border border-[#292B26] hover:bg-[#1a1c17] transition-colors"
          >
            <span>+ Add Project</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToServices}
            className="px-3 py-1.5 rounded-md text-xs text-[#A3A49A] hover:text-[#EAEAE3] hover:bg-[#151713] transition-colors"
          >
            Manage Services →
          </button>

          <button
            type="button"
            onClick={onNavigateToWorks}
            className="px-3 py-1.5 rounded-md text-xs text-[#A3A49A] hover:text-[#EAEAE3] hover:bg-[#151713] transition-colors"
          >
            Manage Works →
          </button>
        </div>
      </div>

      {/* 2-Column Split: Recently Updated & Awaiting Publication */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recently Updated Content (2 cols) */}
        <div className="lg:col-span-2 bg-[#10120F] border border-[#292B26] rounded-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-4 sm:px-5 py-3.5 border-b border-[#292B26] flex items-center justify-between bg-[#10120F]">
              <h3 className="text-xs sm:text-sm font-semibold text-[#EAEAE3]">Recently Modified Content</h3>
              <span className="text-[10px] font-mono text-[#777970]">Active Records</span>
            </div>

            <div className="divide-y divide-[#292B26]">
              {allRecent.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="px-4 sm:px-5 py-3 hover:bg-[#D7F56B]/[0.03] transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#EAEAE3] truncate">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#151713] border border-[#292B26] text-[#A3A49A]">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#777970] mt-0.5 truncate">
                      /{item.type === 'Service' ? 'services' : 'work'}/{item.slug}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        item.status === 'Published'
                          ? 'bg-[#D7F56B]/10 text-[#D7F56B] border border-[#D7F56B]/25 font-medium'
                          : 'bg-[#151713] text-[#A3A49A] border border-[#292B26]'
                      }`}
                    >
                      {item.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (item.type === 'Service') onEditService(item.raw as CMSService)
                        else onEditProject(item.raw as CMSProject)
                      }}
                      className="text-xs text-[#D7F56B] hover:underline"
                    >
                      Edit →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 sm:px-5 py-2.5 border-t border-[#292B26] text-[11px] text-[#777970] flex items-center justify-between">
            <span>Synchronized with live website router</span>
            <span className="text-[#D7F56B]">Reactive HMR Connected</span>
          </div>
        </div>

        {/* Content Awaiting Publication (1 col) */}
        <div className="bg-[#10120F] border border-[#292B26] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#292B26] mb-3">
              <h3 className="text-xs font-semibold text-[#EAEAE3]">Awaiting Publication</h3>
              <span className="text-[10px] font-mono text-[#A3A49A] bg-[#151713] border border-[#292B26] px-1.5 py-0.5 rounded">
                {draftsAwaitingPublication.length} Drafts
              </span>
            </div>

            {draftsAwaitingPublication.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#777970] border border-dashed border-[#292B26] rounded-md">
                No draft items pending publication. Everything is live!
              </div>
            ) : (
              <div className="space-y-2.5">
                {draftsAwaitingPublication.map((draft) => (
                  <div
                    key={`${draft.type}-${draft.id}`}
                    className="p-3 bg-[#151713] border border-[#292B26] rounded-md flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-xs text-[#EAEAE3] truncate">{draft.title}</div>
                      <div className="text-[10px] font-mono text-[#777970]">{draft.type}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (draft.type === 'Service') onPublishService(draft.id)
                        else onPublishProject(draft.id)
                      }}
                      className="px-2.5 py-1 rounded text-[10px] font-mono font-medium bg-[#D7F56B]/15 text-[#D7F56B] border border-[#D7F56B]/30 hover:bg-[#D7F56B] hover:text-[#090A09] transition-all"
                    >
                      Publish
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#292B26] text-[11px] text-[#777970]">
            Draft items are completely hidden from public visitors until published.
          </div>
        </div>
      </div>
    </div>
  )
}

