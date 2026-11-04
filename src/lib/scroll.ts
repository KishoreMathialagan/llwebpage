import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null
let reduceMotion = false

export function initSmoothScroll() {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return () => {}

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.4,
    smoothWheel: true,
  })

  const onScroll = () => ScrollTrigger.update()
  lenis.on('scroll', onScroll)

  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  document.documentElement.classList.add('has-lenis')

  return () => {
    gsap.ticker.remove(tick)
    lenis?.off('scroll', onScroll)
    lenis?.destroy()
    lenis = null
    document.documentElement.classList.remove('has-lenis')
  }
}

export function stopScroll() {
  lenis?.stop()
}

export function startScroll() {
  lenis?.start()
}

export function scrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  const offset = id === 'top' ? 0 : -8

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration: 1.25,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    })
    return
  }

  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}
