import { SERVICES, PROJECTS } from '../data/content'

export type ServiceStatus = 'Draft' | 'Published' | 'Archived'
export type ProjectStatus = 'Draft' | 'Published' | 'Archived'
export type ProjectRatio = 'landscape' | 'portrait' | 'square' | 'wide'
export type ProjectArtVariant = 'aurelia' | 'northline' | 'marrow' | 'fieldwork'
export type ServiceGlyph = 'orbit' | 'signal' | 'wave' | 'search' | 'mark' | 'frame'

export interface CMSService {
  id: string
  slug: string
  index: string
  title: string
  shortTitle: string
  description: string
  fullDescription?: string
  category: string
  capabilities: string[]
  benefits?: string[]
  process?: string
  glyph: ServiceGlyph
  featuredImage?: string
  thumbnail?: string
  imageAlt?: string
  displayOrder: number
  isFeatured: boolean
  status: ServiceStatus
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface CMSProject {
  id: string
  slug: string
  index: string
  title: string
  client: string
  industry: string
  category: string
  description: string
  fullDescription?: string
  concept: string
  scope?: string[]
  servicesProvided?: string[]
  challenge?: string
  approach?: string
  outcome?: string
  coverImage?: string
  thumbnail?: string
  gallery?: string[]
  videoUrl?: string
  imageAlt?: string
  art: ProjectArtVariant
  ratio: ProjectRatio
  note: string
  displayOrder: number
  isFeatured: boolean
  status: ProjectStatus
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface CMSMediaAsset {
  id: string
  name: string
  url: string
  size: number
  type: string
  altText?: string
  createdAt: string
}

const STORAGE_KEYS = {
  SERVICES: 'leadloom_cms_services_v1',
  PROJECTS: 'leadloom_cms_projects_v1',
  MEDIA: 'leadloom_cms_media_v1',
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

function notifyCMSChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('leadloom-cms-change'))
  }
}

// Initial Seed Generators
function createInitialServices(): CMSService[] {
  const now = new Date().toISOString()
  return SERVICES.map((service, i) => ({
    id: `srv-${service.index}-${slugify(service.shortTitle)}`,
    slug: slugify(service.shortTitle),
    index: service.index,
    title: service.title,
    shortTitle: service.shortTitle,
    description: service.description,
    fullDescription: service.description,
    category: 'Digital & Brand Growth',
    capabilities: [...service.capabilities],
    benefits: [
      'Tailored strategy aligned with executive revenue goals',
      'High-velocity iteration with real-time analytics loop',
      'Senior specialist direction without agency bureaucracy',
    ],
    process: 'Discovery → Architecture → Execution → Optimization',
    glyph: service.glyph,
    displayOrder: i + 1,
    isFeatured: true,
    status: 'Published',
    metaTitle: `${service.title} | ANTARA Digital Agency`,
    metaDescription: service.description,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  }))
}

function createInitialProjects(): CMSProject[] {
  const now = new Date().toISOString()
  return PROJECTS.map((proj, i) => ({
    id: proj.id,
    slug: slugify(proj.title),
    index: proj.index,
    title: proj.title,
    client: `${proj.title} Co.`,
    industry: proj.industry,
    category: proj.category,
    description: proj.description,
    fullDescription: `${proj.description}\n\n${proj.concept}`,
    concept: proj.concept,
    scope: ['Brand Architecture', 'Visual Language', 'Design Systems', 'Digital Experience'],
    servicesProvided: [proj.category],
    challenge: `Create an authoritative identity and digital presence that balances functional utility with distinctive visual personality.`,
    approach: proj.concept,
    outcome: `Elevated market positioning, notable organic discovery boost, and unified brand expression across digital and physical touchpoints.`,
    art: proj.art,
    ratio: proj.ratio as ProjectRatio,
    note: proj.note,
    displayOrder: i + 1,
    isFeatured: true,
    status: 'Published',
    metaTitle: `${proj.title} — ${proj.category} Concept Study | ANTARA`,
    metaDescription: proj.description,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  }))
}

// -------------------------------------------------------------
// Services CRUD APIs
// -------------------------------------------------------------

export function getCMSServices(): CMSService[] {
  if (typeof window === 'undefined') return createInitialServices()
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES)
    if (!raw) {
      const initial = createInitialServices()
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(initial))
      return initial
    }
    const parsed: CMSService[] = JSON.parse(raw)
    return parsed.sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (err) {
    console.error('Failed to load CMS services from storage:', err)
    return createInitialServices()
  }
}

export function getPublishedCMSServices(): CMSService[] {
  return getCMSServices().filter((s) => s.status === 'Published')
}

export function getCMSServiceById(id: string): CMSService | undefined {
  return getCMSServices().find((s) => s.id === id)
}

export function getCMSServiceBySlug(slug: string): CMSService | undefined {
  return getCMSServices().find((s) => s.slug === slug)
}

export function saveCMSServices(services: CMSService[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
    notifyCMSChange()
  } catch (err) {
    console.error('Failed to save CMS services:', err)
  }
}

export function upsertCMSService(data: Partial<CMSService> & { title: string; shortTitle: string }): CMSService {
  const current = getCMSServices()
  const now = new Date().toISOString()
  const cleanSlug = data.slug ? slugify(data.slug) : slugify(data.title)

  if (data.id) {
    // Update existing
    const updated = current.map((item) => {
      if (item.id === data.id) {
        const nextStatus = data.status || item.status
        return {
          ...item,
          ...data,
          slug: cleanSlug,
          updatedAt: now,
          publishedAt: nextStatus === 'Published' && item.status !== 'Published' ? now : item.publishedAt,
        }
      }
      return item
    })
    saveCMSServices(updated)
    return updated.find((item) => item.id === data.id)!
  } else {
    // Create new
    const nextIndex = (current.length + 1).toString().padStart(2, '0')
    const newService: CMSService = {
      id: `srv-${Date.now().toString(36)}`,
      slug: cleanSlug,
      index: nextIndex,
      title: data.title,
      shortTitle: data.shortTitle,
      description: data.description || '',
      fullDescription: data.fullDescription || data.description || '',
      category: data.category || 'Digital & Brand Growth',
      capabilities: data.capabilities || ['Strategy', 'Implementation'],
      benefits: data.benefits || [],
      process: data.process || '',
      glyph: data.glyph || 'orbit',
      featuredImage: data.featuredImage,
      thumbnail: data.thumbnail,
      imageAlt: data.imageAlt,
      displayOrder: data.displayOrder ?? current.length + 1,
      isFeatured: data.isFeatured ?? true,
      status: data.status || 'Draft',
      metaTitle: data.metaTitle || `${data.title} | ANTARA`,
      metaDescription: data.metaDescription || data.description,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === 'Published' ? now : undefined,
    }
    saveCMSServices([...current, newService])
    return newService
  }
}

export function publishCMSService(id: string): void {
  const current = getCMSServices()
  const now = new Date().toISOString()
  const updated = current.map((s) => (s.id === id ? { ...s, status: 'Published' as ServiceStatus, publishedAt: now, updatedAt: now } : s))
  saveCMSServices(updated)
}

export function unpublishCMSService(id: string): void {
  const current = getCMSServices()
  const now = new Date().toISOString()
  const updated = current.map((s) => (s.id === id ? { ...s, status: 'Draft' as ServiceStatus, updatedAt: now } : s))
  saveCMSServices(updated)
}

export function deleteCMSService(id: string): void {
  const current = getCMSServices()
  const updated = current.filter((s) => s.id !== id)
  saveCMSServices(updated)
}

export function duplicateCMSService(id: string): CMSService | null {
  const current = getCMSServices()
  const existing = current.find((s) => s.id === id)
  if (!existing) return null

  const now = new Date().toISOString()
  const copy: CMSService = {
    ...existing,
    id: `srv-${Date.now().toString(36)}`,
    slug: `${existing.slug}-copy`,
    title: `${existing.title} (Copy)`,
    shortTitle: `${existing.shortTitle} (Copy)`,
    index: (current.length + 1).toString().padStart(2, '0'),
    status: 'Draft',
    displayOrder: current.length + 1,
    createdAt: now,
    updatedAt: now,
    publishedAt: undefined,
  }
  saveCMSServices([...current, copy])
  return copy
}

export function reorderCMSServices(orderedIds: string[]): void {
  const current = getCMSServices()
  const map = new Map(current.map((item) => [item.id, item]))
  const updated: CMSService[] = []

  orderedIds.forEach((id, index) => {
    const item = map.get(id)
    if (item) {
      updated.push({
        ...item,
        displayOrder: index + 1,
        index: (index + 1).toString().padStart(2, '0'),
      })
      map.delete(id)
    }
  })

  // Append any remaining
  map.forEach((item) => {
    updated.push(item)
  })

  saveCMSServices(updated)
}

// -------------------------------------------------------------
// Projects / Works CRUD APIs
// -------------------------------------------------------------

export function getCMSProjects(): CMSProject[] {
  if (typeof window === 'undefined') return createInitialProjects()
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS)
    if (!raw) {
      const initial = createInitialProjects()
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initial))
      return initial
    }
    const parsed: CMSProject[] = JSON.parse(raw)
    return parsed.sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (err) {
    console.error('Failed to load CMS projects from storage:', err)
    return createInitialProjects()
  }
}

export function getPublishedCMSProjects(): CMSProject[] {
  return getCMSProjects().filter((p) => p.status === 'Published')
}

export function getCMSProjectById(id: string): CMSProject | undefined {
  return getCMSProjects().find((p) => p.id === id)
}

export function getCMSProjectBySlug(slug: string): CMSProject | undefined {
  return getCMSProjects().find((p) => p.slug === slug)
}

export function saveCMSProjects(projects: CMSProject[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    notifyCMSChange()
  } catch (err) {
    console.error('Failed to save CMS projects:', err)
  }
}

export function upsertCMSProject(data: Partial<CMSProject> & { title: string; category: string }): CMSProject {
  const current = getCMSProjects()
  const now = new Date().toISOString()
  const cleanSlug = data.slug ? slugify(data.slug) : slugify(data.title)

  if (data.id) {
    // Update existing
    const updated = current.map((item) => {
      if (item.id === data.id) {
        const nextStatus = data.status || item.status
        return {
          ...item,
          ...data,
          slug: cleanSlug,
          updatedAt: now,
          publishedAt: nextStatus === 'Published' && item.status !== 'Published' ? now : item.publishedAt,
        }
      }
      return item
    })
    saveCMSProjects(updated)
    return updated.find((item) => item.id === data.id)!
  } else {
    // Create new
    const nextIndex = (current.length + 1).toString().padStart(2, '0')
    const newProject: CMSProject = {
      id: `proj-${Date.now().toString(36)}`,
      slug: cleanSlug,
      index: nextIndex,
      title: data.title,
      client: data.client || `${data.title} Client`,
      industry: data.industry || 'Technology & Innovation',
      category: data.category,
      description: data.description || '',
      fullDescription: data.fullDescription || data.description || '',
      concept: data.concept || data.description || '',
      scope: data.scope || ['Creative Direction', 'Experience Design'],
      servicesProvided: data.servicesProvided || [data.category],
      challenge: data.challenge || '',
      approach: data.approach || '',
      outcome: data.outcome || '',
      coverImage: data.coverImage,
      thumbnail: data.thumbnail,
      gallery: data.gallery || [],
      videoUrl: data.videoUrl,
      imageAlt: data.imageAlt,
      art: data.art || 'aurelia',
      ratio: data.ratio || 'landscape',
      note: data.note || 'Production case study',
      displayOrder: data.displayOrder ?? current.length + 1,
      isFeatured: data.isFeatured ?? true,
      status: data.status || 'Draft',
      metaTitle: data.metaTitle || `${data.title} | ANTARA Works`,
      metaDescription: data.metaDescription || data.description,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === 'Published' ? now : undefined,
    }
    saveCMSProjects([...current, newProject])
    return newProject
  }
}

export function publishCMSProject(id: string): void {
  const current = getCMSProjects()
  const now = new Date().toISOString()
  const updated = current.map((p) => (p.id === id ? { ...p, status: 'Published' as ProjectStatus, publishedAt: now, updatedAt: now } : p))
  saveCMSProjects(updated)
}

export function unpublishCMSProject(id: string): void {
  const current = getCMSProjects()
  const now = new Date().toISOString()
  const updated = current.map((p) => (p.id === id ? { ...p, status: 'Draft' as ProjectStatus, updatedAt: now } : p))
  saveCMSProjects(updated)
}

export function deleteCMSProject(id: string): void {
  const current = getCMSProjects()
  const updated = current.filter((p) => p.id !== id)
  saveCMSProjects(updated)
}

export function duplicateCMSProject(id: string): CMSProject | null {
  const current = getCMSProjects()
  const existing = current.find((p) => p.id === id)
  if (!existing) return null

  const now = new Date().toISOString()
  const copy: CMSProject = {
    ...existing,
    id: `proj-${Date.now().toString(36)}`,
    slug: `${existing.slug}-copy`,
    title: `${existing.title} (Copy)`,
    index: (current.length + 1).toString().padStart(2, '0'),
    status: 'Draft',
    displayOrder: current.length + 1,
    createdAt: now,
    updatedAt: now,
    publishedAt: undefined,
  }
  saveCMSProjects([...current, copy])
  return copy
}

export function reorderCMSProjects(orderedIds: string[]): void {
  const current = getCMSProjects()
  const map = new Map(current.map((item) => [item.id, item]))
  const updated: CMSProject[] = []

  orderedIds.forEach((id, index) => {
    const item = map.get(id)
    if (item) {
      updated.push({
        ...item,
        displayOrder: index + 1,
        index: (index + 1).toString().padStart(2, '0'),
      })
      map.delete(id)
    }
  })

  map.forEach((item) => {
    updated.push(item)
  })

  saveCMSProjects(updated)
}

// -------------------------------------------------------------
// Media Assets Management
// -------------------------------------------------------------

export function getCMSMediaAssets(): CMSMediaAsset[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDIA)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function addCMSMediaAsset(asset: Omit<CMSMediaAsset, 'id' | 'createdAt'>): CMSMediaAsset {
  const current = getCMSMediaAssets()
  const newAsset: CMSMediaAsset = {
    ...asset,
    id: `med-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  }
  const updated = [newAsset, ...current]
  try {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to store media asset in localStorage:', err)
  }
  return newAsset
}

export function deleteCMSMediaAsset(id: string): void {
  const current = getCMSMediaAssets()
  const updated = current.filter((m) => m.id !== id)
  try {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to delete media asset from localStorage:', err)
  }
}
