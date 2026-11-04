import { useEffect, useState, type RefObject } from 'react'

export function useInView(ref: RefObject<HTMLElement>, rootMargin = '0px') {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
