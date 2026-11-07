import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SERVICES, SITE } from '../data/content'
import { getPublishedCMSServices } from '../lib/cmsStorage'
import { ArrowUpRight } from './Icons'
import { CustomSelect } from './CustomSelect'
import { addLead } from '../lib/adminStorage'

const FORM_ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim() || ''

type Fields = {
  name: string
  email: string
  company: string
  service: string
  details: string
}

type FieldName = keyof Fields

const EMPTY_FIELDS: Fields = {
  name: '',
  email: '',
  company: '',
  service: '',
  details: '',
}


function validateField(field: FieldName, values: Fields): string {
  const value = values[field].trim()
  if (field === 'name') {
    if (!value) return 'Please tell us your name.'
    if (value.length < 2) return 'Please use at least two characters.'
  }
  if (field === 'email') {
    if (!value) return 'Please add your work email.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Please check the email address.'
  }
  if (field === 'service') {
    if (!value) return 'Choose the area you need help with.'
  }
  if (field === 'details') {
    if (!value) return 'Please share a little about the project.'
    if (value.length < 20) return 'A little more context would help — at least 20 characters.'
  }
  return ''
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string }
  | { kind: 'manual'; message: string; mailto: string }

type Props = {
  incomingService: string
}

export function Contact({ incomingService }: Props) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [values, setValues] = useState<Fields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [serviceOptions, setServiceOptions] = useState<string[]>(() => {
    const published = getPublishedCMSServices()
    const titles = published.length ? published.map((s) => s.shortTitle) : SERVICES.map((s) => s.shortTitle)
    return ['Select a service', ...titles, 'A few of these', 'Not sure yet']
  })

  // Synchronize options reactively with CMS changes
  useEffect(() => {
    const handleCMSChange = () => {
      const published = getPublishedCMSServices()
      const titles = published.length ? published.map((s) => s.shortTitle) : SERVICES.map((s) => s.shortTitle)
      setServiceOptions(['Select a service', ...titles, 'A few of these', 'Not sure yet'])
    }
    window.addEventListener('leadloom-cms-change', handleCMSChange)
    return () => window.removeEventListener('leadloom-cms-change', handleCMSChange)
  }, [])

  useEffect(() => {
    if (!incomingService) return
    setValues((current) => ({ ...current, service: incomingService }))
    setErrors((current) => ({ ...current, service: '' }))
    setStatus({ kind: 'idle' })
  }, [incomingService])

  useEffect(() => {
    if (!root.current || reduced) return
    const context = gsap.context(() => {
      gsap.from('.contact-title .line-inner', {
        yPercent: 112,
        duration: 1.1,
        stagger: 0.085,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-head', start: 'top 82%' },
      })
      gsap.from('.contact-copy > *:not(.contact-title), .contact-form', {
        opacity: 0,
        y: 22,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.contact-grid', start: 'top 76%' },
      })
    }, root)
    return () => context.revert()
  }, [reduced])

  const mailtoHref = useMemo(() => {
    const subject = `Project enquiry${values.service ? ` — ${values.service}` : ''}`
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.company ? `Company: ${values.company}` : '',
      `Need help with: ${values.service}`,
      '',
      values.details,
    ]
      .filter(Boolean)
      .join('\n')
    return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [values])

  const updateField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, { ...values, [field]: value }) }))
    }
    if (status.kind === 'error' || status.kind === 'manual' || status.kind === 'success') {
      setStatus({ kind: 'idle' })
    }
  }

  const handleBlur = (field: FieldName) => {
    const error = validateField(field, values)
    setErrors((current) => ({ ...current, [field]: error }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requiredFields: FieldName[] = ['name', 'email', 'service', 'details']
    const nextErrors: Partial<Record<FieldName, string>> = {}
    requiredFields.forEach((field) => {
      const error = validateField(field, values)
      if (error) nextErrors[field] = error
    })
    setErrors(nextErrors)

    const firstError = requiredFields.find((field) => nextErrors[field])
    if (firstError) {
      setStatus({ kind: 'error', message: 'Please check the highlighted fields before sending.' })
      document.getElementById(`contact-${firstError}`)?.focus()
      return
    }

    // Save lead to local CRM storage so it is immediately visible in the Admin Panel
    addLead({
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim() || 'Direct Client',
      service: values.service,
      details: values.details.trim(),
      status: 'New',
      estimatedValue: 18000,
      priority: 'High',
      notes: 'Captured live from website contact enquiry form.',
    })

    if (!FORM_ENDPOINT) {
      setStatus({
        kind: 'manual',
        message: 'Your inquiry has been logged in our internal CRM. You can also send a direct email copy if preferred.',
        mailto: mailtoHref,
      })
      setValues(EMPTY_FIELDS)
      setErrors({})
      return
    }

    setStatus({ kind: 'submitting' })
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...values,
          source: 'antara.com — project enquiry',
        }),
      })

      if (!response.ok) throw new Error(`Request failed with ${response.status}`)

      setStatus({
        kind: 'success',
        message: 'Thank you — your note is with us. We’ll be in touch soon.',
      })
      setValues(EMPTY_FIELDS)
      setErrors({})
    } catch {
      setStatus({
        kind: 'error',
        message: `Something went wrong sending the form. Please email us directly at ${SITE.email}.`,
      })
    }
  }

  return (
    <section className="contact section" id="contact" ref={root} data-cursor-theme="lime" aria-labelledby="contact-title">
      <div className="contact-atmosphere" aria-hidden="true">
        <div className="contact-glow" />
        </div>

      <div className="shell">
        <div className="section-top">
          <span className="label">
            <span className="label-index">08</span>
            Have something in mind?
          </span>
          <span className="section-top-note">Contact / Start a project</span>
        </div>

        <div className="contact-grid">
          <div className="contact-copy">
            <h2 className="contact-title" id="contact-title">
              <span className="line"><span className="line-inner">Let&rsquo;s turn your next</span></span>
              <span className="line"><span className="line-inner">big idea into <em>momentum.</em></span></span>
            </h2>

            <p className="contact-lede">
              Tell us where you want to go. Let&rsquo;s explore what we can build together.
            </p>

            <div className="contact-direct">
              <span className="eyebrow">Prefer email?</span>
              <a className="contact-email" href={`mailto:${SITE.email}`} data-cursor="cta">
                {SITE.email}
                <ArrowUpRight />
              </a>
              <p className="contact-location">{SITE.location}</p>
            </div>

            <div className="contact-availability">
              <span className="status-dot" aria-hidden="true" />
              <span>Open to new conversations.</span>
            </div>
          </div>

          <form className="contact-form" data-cursor-theme="dark" onSubmit={handleSubmit} noValidate aria-describedby="contact-form-status">
            <div className="form-head">
              <span className="eyebrow">Project enquiry</span>
              <span className="form-head-note">All fields marked * are required</span>
            </div>

            <div className="form-grid">
              <div className={`field ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  onBlur={() => handleBlur('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  required
                />
                {errors.name && <span className="field-error" id="error-name">{errors.name}</span>}
              </div>

              <div className={`field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="contact-email">Work email <span aria-hidden="true">*</span></label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={values.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  required
                />
                {errors.email && <span className="field-error" id="error-email">{errors.email}</span>}
              </div>

              <div className="field">
                <label htmlFor="contact-company">Company name</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Company or brand"
                  value={values.company}
                  onChange={(event) => updateField('company', event.target.value)}
                />
              </div>

              <div className={`field ${errors.service ? 'has-error' : ''}`}>
                <label htmlFor="contact-service">What do you need help with? <span aria-hidden="true">*</span></label>
                <CustomSelect
                  id="contact-service"
                  name="service"
                  value={values.service}
                  placeholder="Select a service"
                  options={serviceOptions}
                  onChange={(val) => updateField('service', val)}
                  onBlur={() => handleBlur('service')}
                  error={Boolean(errors.service)}
                  describedBy={errors.service ? 'error-service' : undefined}
                  required
                />
                {errors.service && <span className="field-error" id="error-service">{errors.service}</span>}
              </div>

              <div className={`field field-full ${errors.details ? 'has-error' : ''}`}>
                <label htmlFor="contact-details">Project details <span aria-hidden="true">*</span></label>
                <textarea
                  id="contact-details"
                  name="details"
                  rows={4}
                  placeholder="What are you building, and what would progress look like?"
                  value={values.details}
                  onChange={(event) => updateField('details', event.target.value)}
                  onBlur={() => handleBlur('details')}
                  aria-invalid={Boolean(errors.details)}
                  aria-describedby={errors.details ? 'error-details' : undefined}
                  required
                />
                {errors.details && <span className="field-error" id="error-details">{errors.details}</span>}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary form-submit"
                  disabled={status.kind === 'submitting'}
                  data-cursor="cta"
                >
                  <span>{status.kind === 'submitting' ? 'Sending…' : 'Send Project Brief'}</span>
                  <span className="btn-arrow"><ArrowUpRight /></span>
                </button>
                <p className="form-privacy">
                  Your details are only used to respond to this enquiry.
                </p>
              </div>

              <div id="contact-form-status" className={`form-status form-status-${status.kind}`} role="status" aria-live="polite">
                {status.kind === 'success' && <p>{status.message}</p>}
                {status.kind === 'error' && <p>{status.message}</p>}
                {status.kind === 'manual' && (
                  <>
                    <p>{status.message}</p>
                    <a className="form-status-link" href={status.mailto}>
                      Open your email app
                      <ArrowUpRight />
                    </a>
                    <span className="form-status-note">
                      Or write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                    </span>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
