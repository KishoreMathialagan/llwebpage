import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createRadialTexture } from './textures'

type Props = {
  reduced: boolean
  detail: 'full' | 'lite'
}

function makePositions(count: number, inner: number, outer: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const radius = inner + Math.pow(Math.random(), 0.7) * (outer - inner)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
    positions[i * 3 + 1] = Math.cos(phi) * radius * 0.62
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius
  }
  return positions
}

export function FloatingParticles({ reduced, detail }: Props) {
  const fine = useRef<THREE.Points>(null)
  const broad = useRef<THREE.Points>(null)

  const texture = useMemo(
    () =>
      createRadialTexture([
        [0, 'rgba(255,255,255,1)'],
        [0.4, 'rgba(255,255,255,0.6)'],
        [1, 'rgba(255,255,255,0)'],
      ]),
    [],
  )

  useEffect(() => () => texture.dispose(), [texture])

  const counts = useMemo(
    () => (detail === 'full' ? { fine: 520, broad: 190 } : { fine: 200, broad: 80 }),
    [detail],
  )

  const finePositions = useMemo(() => makePositions(counts.fine, 2.2, 8.5), [counts.fine])
  const broadPositions = useMemo(() => makePositions(counts.broad, 4.5, 12), [counts.broad])

  useFrame((state) => {
    if (reduced) return
    const t = state.clock.elapsedTime
    if (fine.current) {
      fine.current.rotation.y = t * 0.012
      fine.current.rotation.x = Math.sin(t * 0.04) * 0.03
      fine.current.position.y = Math.sin(t * 0.11) * 0.06
    }
    if (broad.current) {
      broad.current.rotation.y = -t * 0.007
      broad.current.position.y = Math.cos(t * 0.08) * 0.1
    }
  })

  return (
    <group>
      <points ref={fine}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[finePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          color="#d9e9a8"
          size={0.032}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      <points ref={broad}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[broadPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          color="#f3f1e9"
          size={0.065}
          sizeAttenuation
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  )
}
