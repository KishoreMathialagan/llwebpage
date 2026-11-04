import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { GrowthOrbit } from '../scenes/GrowthOrbit'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useMediaQuery } from '../hooks/useMediaQuery'

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

function StaticOrbitFallback() {
  return (
    <svg className="orbit-fallback" viewBox="0 0 900 700" aria-hidden="true">
      <defs>
        <radialGradient id="fallbackGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D6F36A" stopOpacity="0.13" />
          <stop offset="55%" stopColor="#D6F36A" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#D6F36A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fallbackMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3F1E9" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#6E716B" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F3F1E9" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <ellipse cx="450" cy="350" rx="420" ry="420" fill="url(#fallbackGlow)" />
      <ellipse cx="450" cy="350" rx="260" ry="112" fill="none" stroke="#D6F36A" strokeOpacity="0.35" transform="rotate(-18 450 350)" />
      <ellipse cx="450" cy="350" rx="298" ry="140" fill="none" stroke="#F3F1E9" strokeOpacity="0.12" transform="rotate(34 450 350)" />
      <ellipse cx="450" cy="350" rx="210" ry="92" fill="none" stroke="url(#fallbackMetal)" strokeWidth="10" transform="rotate(8 450 350)" />
      <circle cx="450" cy="350" r="78" fill="none" stroke="url(#fallbackMetal)" strokeWidth="26" />
      <circle cx="450" cy="350" r="122" fill="none" stroke="#F3F1E9" strokeOpacity="0.1" />
      <circle cx="664" cy="232" r="3" fill="#D6F36A" />
    </svg>
  )
}

export function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, '150px')
  const reduced = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 720px)')
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setWebgl(supportsWebGL())
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <div className="hero-canvas" ref={wrapRef} aria-hidden="true">
      <div className="hero-canvas-fallback">
        <StaticOrbitFallback />
      </div>

      {webgl && (
        <SceneBoundary fallback={null}>
          <Canvas
            camera={{ position: [0, 0.16, 9.6], fov: 36 }}
            dpr={isMobile ? [1, 1.4] : [1, 1.9]}
            frameloop={reduced ? 'demand' : inView && visible ? 'always' : 'never'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => gl.setClearColor('#080909', 0)}
          >
            <Suspense fallback={null}>
              <GrowthOrbit reduced={reduced} />
            </Suspense>
          </Canvas>
        </SceneBoundary>
      )}
    </div>
  )
}
