import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { BrandStatement } from './components/BrandStatement'
import { Services } from './components/Services'
import { Process } from './components/Process'
import { Portfolio } from './components/Portfolio'
import { WhyLeadloom } from './components/WhyLeadloom'
import { Insights } from './components/Insights'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { CustomCursor } from './components/CustomCursor'
import { AdminPanel } from './components/admin/AdminPanel'
import { useIsAdmin } from './lib/router'
import { initSmoothScroll, scrollToId } from './lib/scroll'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  const isAdmin = useIsAdmin()
  const [ready, setReady] = useState(false)
  const [incomingService, setIncomingService] = useState('')

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.remove('has-custom-cursor')
      const loader = document.getElementById('loader')
      if (loader) {
        loader.classList.add('is-done')
        window.setTimeout(() => loader.remove(), 400)
      }
      document.documentElement.classList.add('is-ready')
      setReady(true)
      return
    }

    const cleanupScroll = initSmoothScroll()

    let cancelled = false
    const started = performance.now()
    const minimum = 850

    const finishIntro = () => {
      if (cancelled) return
      const wait = Math.max(0, minimum - (performance.now() - started))
      window.setTimeout(() => {
        if (cancelled) return
        const loader = document.getElementById('loader')
        if (loader) {
          loader.classList.add('is-done')
          window.setTimeout(() => loader.remove(), 750)
        }
        document.documentElement.classList.add('is-ready')
        setReady(true)
        ScrollTrigger.refresh()
      }, wait)
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(finishIntro).catch(finishIntro)
    } else {
      finishIntro()
    }

    const failsafe = window.setTimeout(finishIntro, 2600)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      cancelled = true
      window.clearTimeout(failsafe)
      window.removeEventListener('load', onLoad)
      cleanupScroll()
    }
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) return

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const id = href.slice(1)
      const section = document.getElementById(id)
      if (!section) return

      event.preventDefault()
      scrollToId(id)
      window.history.replaceState(null, '', href)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [isAdmin])

  const handleSelectService = (service: string) => {
    setIncomingService(service)
    window.setTimeout(() => scrollToId('contact'), 80)
  }

  if (isAdmin) {
    return <AdminPanel />
  }

  return (
    <>
      <CustomCursor />
      <Navbar ready={ready} />
      <main id="main">
        <Hero ready={ready} />
        <BrandStatement />
        <Services onSelectService={handleSelectService} />
        <Process />
        <Portfolio />
        <WhyLeadloom />
        <Insights />
        <Contact incomingService={incomingService} />
      </main>
      <Footer />
    </>
  )
}
