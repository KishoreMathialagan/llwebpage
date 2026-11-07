import { useState, useEffect } from 'react'
import {
  type CMSService,
  type CMSProject,
  getCMSServices,
  getCMSProjects,
  publishCMSService,
  unpublishCMSService,
  deleteCMSService,
  duplicateCMSService,
  reorderCMSServices,
  publishCMSProject,
  unpublishCMSProject,
  deleteCMSProject,
  duplicateCMSProject,
  reorderCMSProjects,
} from '../../../lib/cmsStorage'
import { CMSOverview } from './CMSOverview'
import { ServicesManager } from './ServicesManager'
import { WorksManager } from './WorksManager'
import { ServiceEditorModal } from './ServiceEditorModal'
import { ProjectEditorModal } from './ProjectEditorModal'
import { ContentPreviewModal } from './ContentPreviewModal'

export type CMSSubTab = 'overview' | 'services' | 'works'

interface Props {
  onShowToast: (msg: string) => void
}

export function CMSTab({ onShowToast }: Props) {
  const [subTab, setSubTab] = useState<CMSSubTab>('overview')
  const [services, setServices] = useState<CMSService[]>([])
  const [projects, setProjects] = useState<CMSProject[]>([])

  // Editor Modal States
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<CMSService | null>(null)

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null)

  // Preview Modal States
  const [previewItem, setPreviewItem] = useState<CMSService | CMSProject | null>(null)
  const [previewType, setPreviewType] = useState<'service' | 'project'>('service')

  const refreshData = () => {
    setServices(getCMSServices())
    setProjects(getCMSProjects())
  }

  useEffect(() => {
    refreshData()

    const handleCMSChange = () => {
      refreshData()
    }
    window.addEventListener('leadloom-cms-change', handleCMSChange)
    return () => window.removeEventListener('leadloom-cms-change', handleCMSChange)
  }, [])

  // Services actions
  const handlePublishService = (id: string) => {
    publishCMSService(id)
    refreshData()
    onShowToast('Service published to live website.')
  }

  const handleUnpublishService = (id: string) => {
    unpublishCMSService(id)
    refreshData()
    onShowToast('Service moved to draft (hidden from public site).')
  }

  const handleDeleteService = (id: string) => {
    const s = services.find((x) => x.id === id)
    if (window.confirm(`Are you sure you want to delete service "${s?.title || id}"?`)) {
      deleteCMSService(id)
      refreshData()
      onShowToast('Service deleted.')
    }
  }

  const handleDuplicateService = (id: string) => {
    const copy = duplicateCMSService(id)
    if (copy) {
      refreshData()
      onShowToast(`Duplicated "${copy.title}" as draft.`)
    }
  }

  const handleMoveServiceUp = (index: number) => {
    if (index <= 0) return
    const ids = services.map((s) => s.id)
    const temp = ids[index]
    ids[index] = ids[index - 1]
    ids[index - 1] = temp
    reorderCMSServices(ids)
    refreshData()
    onShowToast('Display order updated.')
  }

  const handleMoveServiceDown = (index: number) => {
    if (index >= services.length - 1) return
    const ids = services.map((s) => s.id)
    const temp = ids[index]
    ids[index] = ids[index + 1]
    ids[index + 1] = temp
    reorderCMSServices(ids)
    refreshData()
    onShowToast('Display order updated.')
  }

  // Projects actions
  const handlePublishProject = (id: string) => {
    publishCMSProject(id)
    refreshData()
    onShowToast('Case study published to live website.')
  }

  const handleUnpublishProject = (id: string) => {
    unpublishCMSProject(id)
    refreshData()
    onShowToast('Case study moved to draft (hidden from public site).')
  }

  const handleDeleteProject = (id: string) => {
    const p = projects.find((x) => x.id === id)
    if (window.confirm(`Are you sure you want to delete case study "${p?.title || id}"?`)) {
      deleteCMSProject(id)
      refreshData()
      onShowToast('Project deleted.')
    }
  }

  const handleDuplicateProject = (id: string) => {
    const copy = duplicateCMSProject(id)
    if (copy) {
      refreshData()
      onShowToast(`Duplicated "${copy.title}" as draft.`)
    }
  }

  const handleMoveProjectUp = (index: number) => {
    if (index <= 0) return
    const ids = projects.map((p) => p.id)
    const temp = ids[index]
    ids[index] = ids[index - 1]
    ids[index - 1] = temp
    reorderCMSProjects(ids)
    refreshData()
    onShowToast('Display order updated.')
  }

  const handleMoveProjectDown = (index: number) => {
    if (index >= projects.length - 1) return
    const ids = projects.map((p) => p.id)
    const temp = ids[index]
    ids[index] = ids[index + 1]
    ids[index + 1] = temp
    reorderCMSProjects(ids)
    refreshData()
    onShowToast('Display order updated.')
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub-Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B26]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777970] bg-[#151713] border border-[#292B26] px-1.5 py-0.5 rounded">
              ANTARA Headless CMS
            </span>
            <span className="text-xs text-[#777970]">Public Site Sync Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#EAEAE3] tracking-tight">
            Content Management System
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A49A] mt-0.5">
            Manage agency service disciplines and portfolio case studies without code redeployment.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center p-0.5 bg-[#10120F] border border-[#292B26] rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab('overview')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              subTab === 'overview'
                ? 'bg-[#151713] text-[#EAEAE3] border border-[#292B26] shadow-sm'
                : 'text-[#A3A49A] hover:text-[#EAEAE3]'
            }`}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => setSubTab('services')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              subTab === 'services'
                ? 'bg-[#151713] text-[#EAEAE3] border border-[#292B26] shadow-sm'
                : 'text-[#A3A49A] hover:text-[#EAEAE3]'
            }`}
          >
            <span>Services</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#10120F] border border-[#292B26] text-[#A3A49A]">
              {services.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('works')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              subTab === 'works'
                ? 'bg-[#151713] text-[#EAEAE3] border border-[#292B26] shadow-sm'
                : 'text-[#A3A49A] hover:text-[#EAEAE3]'
            }`}
          >
            <span>Works & Portfolio</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#10120F] border border-[#292B26] text-[#A3A49A]">
              {projects.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main SubTab View */}
      {subTab === 'overview' && (
        <CMSOverview
          services={services}
          projects={projects}
          onOpenNewService={() => {
            setEditingService(null)
            setIsServiceModalOpen(true)
          }}
          onOpenNewProject={() => {
            setEditingProject(null)
            setIsProjectModalOpen(true)
          }}
          onNavigateToServices={() => setSubTab('services')}
          onNavigateToWorks={() => setSubTab('works')}
          onEditService={(s) => {
            setEditingService(s)
            setIsServiceModalOpen(true)
          }}
          onEditProject={(p) => {
            setEditingProject(p)
            setIsProjectModalOpen(true)
          }}
          onPublishService={handlePublishService}
          onPublishProject={handlePublishProject}
        />
      )}

      {subTab === 'services' && (
        <ServicesManager
          services={services}
          onOpenNew={() => {
            setEditingService(null)
            setIsServiceModalOpen(true)
          }}
          onEdit={(s) => {
            setEditingService(s)
            setIsServiceModalOpen(true)
          }}
          onPreview={(s) => {
            setPreviewItem(s)
            setPreviewType('service')
          }}
          onPublish={handlePublishService}
          onUnpublish={handleUnpublishService}
          onDuplicate={handleDuplicateService}
          onDelete={handleDeleteService}
          onMoveUp={handleMoveServiceUp}
          onMoveDown={handleMoveServiceDown}
        />
      )}

      {subTab === 'works' && (
        <WorksManager
          projects={projects}
          onOpenNew={() => {
            setEditingProject(null)
            setIsProjectModalOpen(true)
          }}
          onEdit={(p) => {
            setEditingProject(p)
            setIsProjectModalOpen(true)
          }}
          onPreview={(p) => {
            setPreviewItem(p)
            setPreviewType('project')
          }}
          onPublish={handlePublishProject}
          onUnpublish={handleUnpublishProject}
          onDuplicate={handleDuplicateProject}
          onDelete={handleDeleteProject}
          onMoveUp={handleMoveProjectUp}
          onMoveDown={handleMoveProjectDown}
        />
      )}

      {/* Modals */}
      <ServiceEditorModal
        isOpen={isServiceModalOpen}
        initialService={editingService}
        onClose={() => setIsServiceModalOpen(false)}
        onSaved={(_, msg) => {
          refreshData()
          onShowToast(msg)
        }}
      />

      <ProjectEditorModal
        isOpen={isProjectModalOpen}
        initialProject={editingProject}
        onClose={() => setIsProjectModalOpen(false)}
        onSaved={(_, msg) => {
          refreshData()
          onShowToast(msg)
        }}
      />

      <ContentPreviewModal
        item={previewItem}
        type={previewType}
        onClose={() => setPreviewItem(null)}
        onPublish={() => {
          if (!previewItem) return
          if (previewType === 'service') handlePublishService(previewItem.id)
          else handlePublishProject(previewItem.id)
          setPreviewItem(null)
        }}
      />
    </div>
  )
}

