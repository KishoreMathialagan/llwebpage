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
import { Preloader } from './components/Preloader'
import { AdminPanel } from './components/admin/AdminPanel'
import { useIsAdmin } from './lib/router'
import { initSmoothScroll, scrollToId } from './lib/scroll'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  const isAdmin = useIsAdmin()
  const [ready, setReady] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [incomingService, setIncomingService] = useState('')

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.remove('has-custom-cursor')
      const loader = document.getElementById('loader')
      if (loader) loader.remove()
      document.documentElement.classList.add('is-ready')
      setReady(true)
      setPreloaderDone(true)
      return
    }

    const cleanupScroll = initSmoothScroll()

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
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

  const handlePreloaderStartExit = () => {
    document.documentElement.classList.add('is-ready')
    setReady(true)
    ScrollTrigger.refresh()
  }

  const handlePreloaderComplete = () => {
    setPreloaderDone(true)
    ScrollTrigger.refresh()
  }

  const handleSelectService = (service: string) => {
    setIncomingService(service)
    window.setTimeout(() => scrollToId('contact'), 80)
  }

  if (isAdmin) {
    return <AdminPanel />
  }

  return (
    <>
      {!isAdmin && !preloaderDone && (
        <Preloader
          onStartExit={handlePreloaderStartExit}
          onComplete={handlePreloaderComplete}
        />
      )}
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
