import { useState, useEffect } from 'react'
import {
  type CMSProject,
  type ProjectArtVariant,
  type ProjectRatio,
  type ProjectStatus,
  slugify,
  upsertCMSProject,
} from '../../../lib/cmsStorage'
import { ProjectArt } from '../../ProjectArt'
import { AdminCustomSelect } from '../AdminCustomSelect'

interface Props {
  initialProject?: CMSProject | null
  isOpen: boolean
  onClose: () => void
  onSaved: (project: CMSProject, message: string) => void
}

const ART_VARIANTS: { id: ProjectArtVariant; label: string }[] = [
  { id: 'aurelia', label: 'Aurelia (Orbital Minimal)' },
  { id: 'northline', label: 'Northline (Technical Logistics)' },
  { id: 'marrow', label: 'Marrow (Fire & Hearth)' },
  { id: 'fieldwork', label: 'Fieldwork (Architectural Grid)' },
]

const RATIO_OPTIONS: { id: ProjectRatio; label: string }[] = [
  { id: 'landscape', label: 'Landscape (Standard)' },
  { id: 'portrait', label: 'Portrait (Tall)' },
  { id: 'square', label: 'Square (1:1)' },
  { id: 'wide', label: 'Wide (Panoramic)' },
]

export function ProjectEditorModal({ initialProject, isOpen, onClose, onSaved }: Props) {
  const isEditing = Boolean(initialProject?.id)

  const [title, setTitle] = useState('')
  const [client, setClient] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugManual, setIsSlugManual] = useState(false)
  const [industry, setIndustry] = useState('Technology & Innovation')
  const [category, setCategory] = useState('Brand Identity')
  const [description, setDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [concept, setConcept] = useState('')
  const [art, setArt] = useState<ProjectArtVariant>('aurelia')
  const [ratio, setRatio] = useState<ProjectRatio>('landscape')
  const [note, setNote] = useState('Production case study')
  const [coverImage, setCoverImage] = useState<string>('')
  const [imageAlt, setImageAlt] = useState('')
  const [challenge, setChallenge] = useState('')
  const [approach, setApproach] = useState('')
  const [outcome, setOutcome] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(1)
  const [isFeatured, setIsFeatured] = useState(true)
  const [status, setStatus] = useState<ProjectStatus>('Draft')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title)
      setClient(initialProject.client || '')
      setSlug(initialProject.slug)
      setIsSlugManual(true)
      setIndustry(initialProject.industry || 'Technology & Innovation')
      setCategory(initialProject.category || 'Brand Identity')
      setDescription(initialProject.description || '')
      setFullDescription(initialProject.fullDescription || initialProject.description || '')
      setConcept(initialProject.concept || '')
      setArt(initialProject.art || 'aurelia')
      setRatio(initialProject.ratio || 'landscape')
      setNote(initialProject.note || 'Production case study')
      setCoverImage(initialProject.coverImage || '')
      setImageAlt(initialProject.imageAlt || '')
      setChallenge(initialProject.challenge || '')
      setApproach(initialProject.approach || '')
      setOutcome(initialProject.outcome || '')
      setDisplayOrder(initialProject.displayOrder || 1)
      setIsFeatured(initialProject.isFeatured ?? true)
      setStatus(initialProject.status || 'Draft')
      setMetaTitle(initialProject.metaTitle || '')
      setMetaDescription(initialProject.metaDescription || '')
    } else {
      setTitle('')
      setClient('')
      setSlug('')
      setIsSlugManual(false)
      setIndustry('Technology & Innovation')
      setCategory('Brand Identity')
      setDescription('')
      setFullDescription('')
      setConcept('')
      setArt('aurelia')
      setRatio('landscape')
      setNote('Production case study')
      setCoverImage('')
      setImageAlt('')
      setChallenge('')
      setApproach('')
      setOutcome('')
      setDisplayOrder(1)
      setIsFeatured(true)
      setStatus('Draft')
      setMetaTitle('')
      setMetaDescription('')
    }
  }, [initialProject, isOpen])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!client) {
      setClient(`${val} Co.`)
    }
    if (!isSlugManual) {
      setSlug(slugify(val))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setCoverImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (finalStatus: ProjectStatus) => {
    if (!title.trim()) {
      alert('Please provide a project title.')
      return
    }

    const saved = upsertCMSProject({
      id: initialProject?.id,
      title: title.trim(),
      client: client.trim() || `${title} Co.`,
      slug: slug || slugify(title),
      industry: industry.trim(),
      category: category.trim(),
      description: description.trim(),
      fullDescription: fullDescription.trim() || description.trim(),
      concept: concept.trim() || description.trim(),
      challenge: challenge.trim(),
      approach: approach.trim() || concept.trim(),
      outcome: outcome.trim(),
      coverImage: coverImage || undefined,
      thumbnail: coverImage || undefined,
      imageAlt: imageAlt.trim(),
      art,
      ratio,
      note: note.trim(),
      displayOrder: Number(displayOrder) || 1,
      isFeatured,
      status: finalStatus,
      metaTitle: metaTitle.trim() || `${title} — ${category} Study | ANTARA`,
      metaDescription: metaDescription.trim() || description.trim(),
    })

    onSaved(saved, isEditing ? `Project "${saved.title}" updated (${finalStatus})` : `Project "${saved.title}" created (${finalStatus})`)
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
              {isEditing ? `Edit Case Study: ${initialProject?.title}` : 'Add New Portfolio Project'}
            </h2>
            <p className="text-[11px] text-[#777970] mt-0.5">
              Configure project story, visual artworks, challenge/approach narrative, and visibility.
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
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] block">1. Project & Client Info</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Aurelia Skincare"
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Client / Brand Name</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Aurelia Labs Ltd."
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsSlugManual(true)
                    setSlug(slugify(e.target.value))
                  }}
                  placeholder="aurelia-skincare"
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] font-mono focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Wellness & Retail"
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Brand Identity"
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Short Description (Card Teaser) *</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A quiet identity system built around ritual and considered restraint..."
                className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
              />
            </div>
          </div>

          {/* Section 2: Visual Artwork & Media */}
          <div className="space-y-3 pt-3 border-t border-[#292B26]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] block">2. Visual Artwork & Media</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">3D / Generative Art Motif</label>
                <div className="grid grid-cols-2 gap-2">
                  {ART_VARIANTS.map((v) => {
                    const isSelected = art === v.id
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setArt(v.id)}
                        className={`p-2 rounded-md border text-left transition-all ${
                          isSelected
                            ? 'bg-[#151713] border-[#D7F56B] text-[#D7F56B]'
                            : 'bg-[#10120F] border-[#292B26] text-[#777970] hover:text-[#EAEAE3]'
                        }`}
                      >
                        <div className="h-10 w-full mb-1 rounded bg-[#090A09] overflow-hidden flex items-center justify-center">
                          <ProjectArt variant={v.id} />
                        </div>
                        <span className="text-[9px] font-mono block truncate">{v.label.split(' ')[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Custom Cover Image Upload</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    className="block w-full text-[11px] text-[#777970] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-[#292B26] file:text-[10px] file:bg-[#151713] file:text-[#EAEAE3] hover:file:border-[#D7F56B]/40 cursor-pointer"
                  />
                  {coverImage ? (
                    <div className="relative w-full h-24 rounded border border-[#292B26] overflow-hidden bg-[#151713]">
                      <img src={coverImage} alt={imageAlt || title} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="absolute top-1 right-1 bg-black/80 text-white rounded px-1.5 py-0.5 text-[9px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#777970] italic">
                      No custom photo uploaded. Project will display the selected generative art motif.
                    </div>
                  )}

                  <div className="pt-1">
                    <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Card Aspect Ratio</label>
                    <AdminCustomSelect
                      value={ratio}
                      onChange={(val) => setRatio(val as ProjectRatio)}
                      variant="full"
                      options={RATIO_OPTIONS.map((r) => ({ label: r.label, value: r.id }))}
                      ariaLabel="Select Card Aspect Ratio"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Strategic Narrative & Drawer Story */}
          <div className="space-y-3 pt-3 border-t border-[#292B26]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] block">3. Detailed Case Study Story (Drawer View)</span>
            <div>
              <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Strategic Concept Focus</label>
              <textarea
                rows={2}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="The identity uses a single editorial letterform as a flexible mark, paired with warm paper tones..."
                className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">The Challenge</label>
                <textarea
                  rows={2}
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Market saturation, legacy consumer perception, or acquisition friction..."
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>

              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Outcome & Impact</label>
                <textarea
                  rows={2}
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="+42% qualified inbound pipeline, international design recognition..."
                  className="w-full bg-[#151713] border border-[#292B26] rounded-md p-2 text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Publication Settings */}
          <div className="space-y-3 pt-3 border-t border-[#292B26]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] block">4. Publication Settings</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#777970] mb-1 font-mono uppercase text-[10px]">Publication Status</label>
                <AdminCustomSelect
                  value={status}
                  onChange={(val) => setStatus(val as ProjectStatus)}
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
                  id="projFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#292B26] text-[#D7F56B] focus:ring-0"
                />
                <label htmlFor="projFeatured" className="text-xs text-[#EAEAE3] cursor-pointer">
                  Featured Case Study
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

