import { useState, useMemo } from 'react'
import type { CMSService } from '../../../lib/cmsStorage'
import { SERVICE_GLYPHS } from '../../Icons'
import { AdminCustomSelect } from '../AdminCustomSelect'

interface Props {
  services: CMSService[]
  onOpenNew: () => void
  onEdit: (service: CMSService) => void
  onPreview: (service: CMSService) => void
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
}

export function ServicesManager({
  services,
  onOpenNew,
  onEdit,
  onPreview,
  onPublish,
  onUnpublish,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category).filter(Boolean))
    return Array.from(set)
  }, [services])

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shortTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      const matchCat = categoryFilter === 'all' || s.category === categoryFilter

      return matchSearch && matchStatus && matchCat
    })
  }, [services, searchTerm, statusFilter, categoryFilter])

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Filter and Actions Bar */}
      <div className="bg-[#10120F] border border-[#292B26] p-4 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services by title, slug, or capability..."
              className="w-full bg-[#151713] border border-[#292B26] rounded-md px-3 py-1.5 text-xs text-[#EAEAE3] placeholder-[#777970] focus:outline-none focus:border-[#D7F56B]/60"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#777970] hover:text-[#EAEAE3]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <AdminCustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            variant="compact"
            options={[
              { label: `All Statuses (${services.length})`, value: 'all' },
              { label: `Published (${services.filter((s) => s.status === 'Published').length})`, value: 'Published' },
              { label: `Draft (${services.filter((s) => s.status === 'Draft').length})`, value: 'Draft' },
              { label: `Archived (${services.filter((s) => s.status === 'Archived').length})`, value: 'Archived' },
            ]}
            ariaLabel="Filter services by status"
          />

          {/* Category Filter */}
          {categories.length > 0 && (
            <AdminCustomSelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              variant="compact"
              options={[
                { label: 'All Categories', value: 'all' },
                ...categories.map((c) => ({ label: c, value: c })),
              ]}
              ariaLabel="Filter services by category"
            />
          )}
        </div>

        <button
          type="button"
          onClick={onOpenNew}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors shadow-sm flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-[#10120F] border border-[#292B26] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151713] text-[#777970] font-mono text-[10px] uppercase tracking-wider border-b border-[#292B26]">
              <tr>
                <th className="py-2.5 px-3 text-center w-12 font-normal">Order</th>
                <th className="py-2.5 px-4 font-normal">Service Name & Slug</th>
                <th className="py-2.5 px-3 font-normal">Glyph & Category</th>
                <th className="py-2.5 px-3 font-normal">Capabilities</th>
                <th className="py-2.5 px-3 font-normal">Status</th>
                <th className="py-2.5 px-3 font-normal">Last Updated</th>
                <th className="py-2.5 px-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292B26] text-[#EAEAE3]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777970]">
                    No services match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((service, index) => {
                  const isPublished = service.status === 'Published'
                  return (
                    <tr key={service.id} className="hover:bg-[#D7F56B]/[0.03] transition-colors group">
                      {/* Order Controls */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono text-[10px] text-[#777970]">
                          <button
                            type="button"
                            onClick={() => onMoveUp(index)}
                            disabled={index === 0}
                            className="p-0.5 hover:text-[#D7F56B] disabled:opacity-30 disabled:hover:text-[#777970]"
                            title="Move up in order"
                          >
                            ▲
                          </button>
                          <span className="w-4 font-medium text-[#EAEAE3]">{service.displayOrder}</span>
                          <button
                            type="button"
                            onClick={() => onMoveDown(index)}
                            disabled={index === services.length - 1}
                            className="p-0.5 hover:text-[#D7F56B] disabled:opacity-30 disabled:hover:text-[#777970]"
                            title="Move down in order"
                          >
                            ▼
                          </button>
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#EAEAE3] group-hover:text-[#D7F56B] transition-colors">
                          {service.title}
                        </div>
                        <div className="text-[11px] font-mono text-[#777970]">
                          /services/{service.slug}
                        </div>
                      </td>

                      {/* Glyph & Category */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#151713] border border-[#292B26] flex items-center justify-center text-[#D7F56B]">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
                              {SERVICE_GLYPHS[service.glyph] || SERVICE_GLYPHS.orbit}
                            </svg>
                          </div>
                          <span className="text-[#A3A49A] text-[11px] truncate max-w-[140px]">{service.category}</span>
                        </div>
                      </td>

                      {/* Capabilities Preview */}
                      <td className="py-3 px-3">
                        <span className="text-[#777970] text-[11px] block truncate max-w-[200px]">
                          {service.capabilities.slice(0, 3).join(', ')}
                          {service.capabilities.length > 3 ? ` (+${service.capabilities.length - 3})` : ''}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block text-[10px] font-mono tracking-wider px-2 py-0.5 rounded uppercase ${
                            isPublished
                              ? 'bg-[#D7F56B]/10 text-[#D7F56B] border border-[#D7F56B]/25 font-medium'
                              : 'bg-[#151713] text-[#A3A49A] border border-[#292B26]'
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#777970]">
                        {new Date(service.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onPreview(service)}
                            className="px-2 py-1 rounded text-xs text-[#A3A49A] hover:text-[#EAEAE3] hover:bg-[#151713] transition-colors"
                            title="Preview how it looks publicly"
                          >
                            Preview
                          </button>

                          <button
                            type="button"
                            onClick={() => onEdit(service)}
                            className="px-2 py-1 rounded text-xs font-medium text-[#D7F56B] hover:bg-[#151713] transition-colors"
                            title="Edit Service"
                          >
                            Edit
                          </button>

                          {isPublished ? (
                            <button
                              type="button"
                              onClick={() => onUnpublish(service.id)}
                              className="px-2 py-1 rounded text-[11px] text-[#777970] hover:text-[#EAEAE3] hover:bg-[#151713] transition-colors"
                              title="Unpublish (Save as draft)"
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onPublish(service.id)}
                              className="px-2 py-1 rounded text-[11px] text-[#D7F56B] hover:bg-[#D7F56B]/10 transition-colors font-medium"
                              title="Publish to public site"
                            >
                              Publish
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDuplicate(service.id)}
                            className="p-1 text-[#777970] hover:text-[#EAEAE3] hover:bg-[#151713] rounded transition-colors"
                            title="Duplicate Service"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(service.id)}
                            className="p-1 text-[#777970] hover:text-[#EAEAE3] hover:bg-[#151713] rounded transition-colors"
                            title="Delete Service"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
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
