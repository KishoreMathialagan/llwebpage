import type { CMSService, CMSProject } from '../../../lib/cmsStorage'
import { SERVICE_GLYPHS, ArrowUpRight } from '../../Icons'
import { ProjectArt } from '../../ProjectArt'

interface Props {
  item: CMSService | CMSProject | null
  type: 'service' | 'project'
  onClose: () => void
  onPublish?: () => void
}

export function ContentPreviewModal({ item, type, onClose, onPublish }: Props) {
  if (!item) return null

  const isService = type === 'service'
  const service = isService ? (item as CMSService) : null
  const project = !isService ? (item as CMSProject) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#10120F] border border-[#292B26] rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#292B26] bg-[#151713]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D7F56B]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#777970]">
              {isService ? 'Service Public Preview' : 'Portfolio Case Study Preview'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10120F] border border-[#292B26] text-[#A3A49A]">
              Status: {item.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {item.status !== 'Published' && onPublish && (
              <button
                type="button"
                onClick={onPublish}
                className="px-3 py-1 rounded text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors"
              >
                Publish Now
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[#777970] hover:text-[#EAEAE3] p-1.5 rounded transition-colors text-sm"
              title="Close Preview"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Preview Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {isService && service && (
            <div className="space-y-6">
              {/* Simulated Public Website Row */}
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777970] block mb-2">Public Homepage Row Simulation:</span>
                <div className="bg-[#090A09] border border-[#292B26] p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-mono text-[#777970]">{service.index}</span>
                    <div>
                      <h3 className="text-base font-medium text-[#EAEAE3]">{service.title}</h3>
                      <p className="text-xs text-[#A3A49A] mt-1 max-w-xl">{service.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end md:self-auto">
                    <div className="hidden sm:block">
                      <span className="text-[10px] font-mono uppercase text-[#777970] block mb-1">Capabilities</span>
                      <ul className="text-[11px] text-[#A3A49A] space-y-0.5">
                        {service.capabilities.slice(0, 3).map((c) => (
                          <li key={c}>• {c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-10 h-10 rounded bg-[#151713] border border-[#292B26] flex items-center justify-center text-[#EAEAE3]">
                      <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.15">
                        {SERVICE_GLYPHS[service.glyph] || SERVICE_GLYPHS.orbit}
                      </svg>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-[#151713] border border-[#292B26] flex items-center justify-center text-[#D7F56B]">
                      <ArrowUpRight />
                    </div>
                  </div>
                </div>
              </div>

              {/* Extended Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#151713] border border-[#292B26] rounded-md space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#777970]">Full Capabilities List</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.capabilities.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded bg-[#10120F] border border-[#292B26] text-xs text-[#EAEAE3]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#151713] border border-[#292B26] rounded-md space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#777970]">Meta SEO Preview</span>
                  <div className="text-xs">
                    <div className="text-[#D7F56B] font-medium">{service.metaTitle || service.title}</div>
                    <div className="text-[#777970] font-mono text-[10px] mt-0.5">antara.com/services/{service.slug}</div>
                    <div className="text-[#A3A49A] mt-1 text-[11px] line-clamp-2">{service.metaDescription || service.description}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isService && project && (
            <div className="space-y-6">
              {/* Simulated Public Card */}
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777970] block mb-2">Public Portfolio Card Simulation:</span>
                <div className="bg-[#090A09] border border-[#292B26] p-4 rounded-lg max-w-sm space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#777970]">
                    <span>{project.index}</span>
                    <span>{project.category}</span>
                    <span>{project.industry}</span>
                  </div>

                  <div className="h-44 rounded bg-[#151713] border border-[#292B26] overflow-hidden flex items-center justify-center relative">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <ProjectArt variant={project.art} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-[#EAEAE3]">{project.title}</h4>
                      <ArrowUpRight />
                    </div>
                    <p className="text-xs text-[#777970] mt-1 line-clamp-2">{project.description}</p>
                    <span className="text-[10px] text-[#A3A49A] block mt-1">{project.note}</span>
                  </div>
                </div>
              </div>

              {/* Case Study Drawer Content */}
              <div className="p-5 bg-[#151713] border border-[#292B26] rounded-md space-y-4">
                <span className="text-[10px] font-mono uppercase text-[#777970]">Full Drawer Story Preview</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#777970]">Client & Industry</span>
                    <div className="text-xs text-[#EAEAE3] font-medium mt-0.5">{project.client} • {project.industry}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#777970]">Services Provided</span>
                    <div className="text-xs text-[#EAEAE3] font-medium mt-0.5">{(project.servicesProvided || [project.category]).join(', ')}</div>
                  </div>
                </div>

                {project.challenge && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#777970]">Challenge</span>
                    <p className="text-xs text-[#A3A49A] mt-0.5 leading-relaxed">{project.challenge}</p>
                  </div>
                )}

                {project.approach && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#777970]">Approach & Concept</span>
                    <p className="text-xs text-[#A3A49A] mt-0.5 leading-relaxed">{project.approach}</p>
                  </div>
                )}

                {project.outcome && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#777970]">Outcome & Business Impact</span>
                    <p className="text-xs text-[#D7F56B] mt-0.5 leading-relaxed font-medium">{project.outcome}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#292B26] bg-[#151713] flex items-center justify-between text-xs text-[#777970]">
          <span>Slug: <strong className="font-mono text-[#EAEAE3]">/{item.slug}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs text-[#A3A49A] hover:text-[#EAEAE3] transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}

