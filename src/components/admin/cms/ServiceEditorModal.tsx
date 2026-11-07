import { useState, useEffect } from 'react'
import {
  type CMSService,
  type ServiceGlyph,
  type ServiceStatus,
  slugify,
  upsertCMSService,
} from '../../../lib/cmsStorage'
import { SERVICE_GLYPHS } from '../../Icons'
import { AdminCustomSelect } from '../AdminCustomSelect'

interface Props {
  initialService?: CMSService | null
  isOpen: boolean
  onClose: () => void
  onSaved: (service: CMSService, message: string) => void
}

const GLYPH_OPTIONS: { id: ServiceGlyph; label: string }[] = [
  { id: 'orbit', label: 'Orbit (Strategy)' },
  { id: 'signal', label: 'Signal (Performance)' },
  { id: 'wave', label: 'Wave (Social/Content)' },
  { id: 'search', label: 'Search (SEO)' },
  { id: 'mark', label: 'Mark (Branding)' },
  { id: 'frame', label: 'Frame (UX/Web)' },
]

export function ServiceEditorModal({ initialService, isOpen, onClose, onSaved }: Props) {
  const isEditing = Boolean(initialService?.id)

  const [title, setTitle] = useState('')
  const [shortTitle, setShortTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugManual, setIsSlugManual] = useState(false)
  const [category, setCategory] = useState('Digital & Brand Growth')
  const [description, setDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [glyph, setGlyph] = useState<ServiceGlyph>('orbit')
  const [capabilities, setCapabilities] = useState<string[]>([''])
  const [process, setProcess] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(1)
  const [isFeatured, setIsFeatured] = useState(true)
  const [status, setStatus] = useState<ServiceStatus>('Draft')
  const [featuredImage, setFeaturedImage] = useState<string>('')
  const [imageAlt, setImageAlt] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  useEffect(() => {
    if (initialService) {
      setTitle(initialService.title)
      setShortTitle(initialService.shortTitle)
      setSlug(initialService.slug)
      setIsSlugManual(true)
      setCategory(initialService.category || 'Digital & Brand Growth')
      setDescription(initialService.description || '')
      setFullDescription(initialService.fullDescription || initialService.description || '')
      setGlyph(initialService.glyph || 'orbit')
      setCapabilities(initialService.capabilities?.length ? initialService.capabilities : [''])
      setProcess(initialService.process || '')
      setDisplayOrder(initialService.displayOrder || 1)
      setIsFeatured(initialService.isFeatured ?? true)
      setStatus(initialService.status || 'Draft')
      setFeaturedImage(initialService.featuredImage || '')
      setImageAlt(initialService.imageAlt || '')
      setMetaTitle(initialService.metaTitle || '')
      setMetaDescription(initialService.metaDescription || '')
    } else {
      setTitle('')
      setShortTitle('')
      setSlug('')
      setIsSlugManual(false)
      setCategory('Digital & Brand Growth')
      setDescription('')
      setFullDescription('')
      setGlyph('orbit')
      setCapabilities(['Audience Research', 'Competitive Strategy', 'Execution Roadmaps'])
      setProcess('Discovery → Architecture → Execution → Optimization')
      setDisplayOrder(1)
      setIsFeatured(true)
      setStatus('Draft')
      setFeaturedImage('')
      setImageAlt('')
      setMetaTitle('')
      setMetaDescription('')
    }
  }, [initialService, isOpen])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!shortTitle || shortTitle === title) {
      setShortTitle(val)
    }
    if (!isSlugManual) {
      setSlug(slugify(val))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).')
      return
    }

    // Read as Base64 data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setFeaturedImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleAddCapability = () => {
    setCapabilities([...capabilities, ''])
  }

  const handleUpdateCapability = (index: number, val: string) => {
    const updated = [...capabilities]
    updated[index] = val
    setCapabilities(updated)
  }

  const handleRemoveCapability = (index: number) => {
    if (capabilities.length <= 1) {
      setCapabilities([''])
      return
    }
    setCapabilities(capabilities.filter((_, i) => i !== index))
  }

  const handleSubmit = (finalStatus: ServiceStatus) => {
    if (!title.trim()) {
      alert('Please provide a service title.')
      return
    }

    const cleanCapabilities = capabilities.map((c) => c.trim()).filter(Boolean)

    const saved = upsertCMSService({
      id: initialService?.id,
      title: title.trim(),
      shortTitle: (shortTitle || title).trim(),
      slug: slug || slugify(title),
      category: category.trim(),
      description: description.trim(),
      fullDescription: fullDescription.trim() || description.trim(),
      glyph,
      capabilities: cleanCapabilities.length ? cleanCapabilities : ['General Service Capability'],
      process: process.trim(),
      displayOrder: Number(displayOrder) || 1,
      isFeatured,
      status: finalStatus,
      featuredImage: featuredImage || undefined,
      thumbnail: featuredImage || undefined,
      imageAlt: imageAlt.trim(),
      metaTitle: metaTitle.trim() || `${title} | ANTARA Services`,
      metaDescription: metaDescription.trim() || description.trim(),
    })

    onSaved(saved, isEditing ? `Service "${saved.title}" updated (${finalStatus})` : `Service "${saved.title}" created (${finalStatus})`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#10120F] border border-[#292B26] rounded-lg w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#292B26] bg-[#151713]">
          <div>
            <h2 className="text-sm font-semibold text-[#EAEAE3]">
              {isEditing ? `Edit Service: ${initialService?.title}` : 'Add New Public Service'}
            </h2>
            <p className="text-[11px] text-[#777970] mt-0.5">
              Configure copy, glyph branding, capabilities, and publication settings.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#777970] hover:text-[#EAEAE3] p-1.5 rounded transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] block">1. Basic Information</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Service Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. AI Workflow Engineering"
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Short Navigation Title</label>
                <input
                  type="text"
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  placeholder="e.g. AI Workflows"
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#777970] font-mono uppercase text-[10px]">URL Slug</label>
                  <button
                    type="button"
                    onClick={() => setIsSlugManual(!isSlugManual)}
                    className="text-[10px] text-[#D7F56B] hover:underline"
                  >
                    {isSlugManual ? 'Reset Auto-Slug' : 'Customize Slug'}
                  </button>
                </div>
                <div className="flex items-center bg-[#151713] border border-[#292B26] rounded-md px-2 text-[#777970] font-mono text-[11px]">
                  <span>/services/</span>
                  <input
                    type="text"
                    value={slug}
                    readOnly={!isSlugManual}
                    onChange={(e) => {
                      setIsSlugManual(true)
                      setSlug(slugify(e.target.value))
                    }}
                    placeholder="ai-workflow-engineering"
                    className="w-full bg-transparent p-1.5 text-[#EAEAE3] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Digital Strategy"
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Short Summary (Homepage Card) *</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief editorial summary that appears on the public services list..."
                className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
              />
            </div>
          </div>

          {/* Section 2: Visual Branding & Glyph */}
          <div className="space-y-3 pt-3 border-t border-[#292B26]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] block">2. Visual Branding & Media</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Service Glyph Icon</label>
                <div className="grid grid-cols-3 gap-2">
                  {GLYPH_OPTIONS.map((g) => {
                    const isSelected = glyph === g.id
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGlyph(g.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all ${
                          isSelected
                            ? 'bg-[#151713] border-[#D7F56B] text-[#D7F56B]'
                            : 'bg-[#10120F] border-[#292B26] text-[#777970] hover:text-[#EAEAE3]'
                        }`}
                      >
                        <svg className="w-6 h-6 mb-1" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
                          {SERVICE_GLYPHS[g.id]}
                        </svg>
                        <span className="text-[9px] font-mono">{g.label.split(' ')[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Featured Image (Optional)</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    className="block w-full text-[11px] text-[#777970] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-[#292B26] file:text-[10px] file:bg-[#151713] file:text-[#EAEAE3] hover:file:border-[#D7F56B]/40 cursor-pointer"
                  />
                  {featuredImage ? (
                    <div className="relative w-full h-24 rounded border border-[#292B26] overflow-hidden bg-[#151713]">
                      <img src={featuredImage} alt={imageAlt || title} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFeaturedImage('')}
                        className="absolute top-1 right-1 bg-black/80 text-white rounded px-1.5 py-0.5 text-[9px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#777970] italic">
                      No custom image uploaded. Public website will render the dynamic SVG glyph.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Capabilities List */}
          <div className="space-y-3 pt-3 border-t border-[#292B26]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970]">3. Key Capabilities</span>
              <button
                type="button"
                onClick={handleAddCapability}
                className="text-xs text-[#D7F56B] hover:underline font-mono"
              >
                + Add Capability
              </button>
            </div>

            <div className="space-y-2">
              {capabilities.map((cap, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#777970] w-5 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={cap}
                    onChange={(e) => handleUpdateCapability(idx, e.target.value)}
                    placeholder="e.g. Conversion Rate Optimization"
                    className="flex-1 bg-[#151713] border border-[#292B26] rounded-md p-1.5 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCapability(idx)}
                    className="text-[#777970] hover:text-[#EAEAE3] px-2 py-1"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Display & SEO Settings */}
          <div className="space-y-3 pt-3 border-t border-[#292B26]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] block">4. Publication & Display Settings</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Publication Status</label>
                <AdminCustomSelect
                  value={status}
                  onChange={(val) => setStatus(val as ServiceStatus)}
                  variant="full"
                  options={[
                    { label: 'Draft (Hidden)', value: 'Draft' },
                    { label: 'Published (Public)', value: 'Published' },
                    { label: 'Archived', value: 'Archived' },
                  ]}
                  ariaLabel="Select Publication Status"
                />
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Display Order</label>
                <input
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] font-mono focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#292B26] text-[#D7F56B] focus:ring-0"
                />
                <label htmlFor="isFeatured" className="text-xs text-[#EAEAE3] cursor-pointer">
                  Featured on Homepage
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-[#292B26] bg-[#151713] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded text-xs text-[#777970] hover:text-[#EAEAE3] transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('Draft')}
              className="px-3.5 py-1.5 rounded text-xs font-medium bg-[#10120F] text-[#EAEAE3] border border-[#292B26] hover:bg-[#1a1c17] transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('Published')}
              className="px-4 py-1.5 rounded text-xs font-semibold bg-[#D7F56B] text-[#090A09] hover:bg-[#c9e85e] transition-colors shadow-sm"
            >
              Save & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

