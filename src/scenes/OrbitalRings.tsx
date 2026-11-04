import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Ring = {
  radius: number
  rotation: [number, number, number]
  color: string
  opacity: number
  beadSpeed: number
  beadSize: number
  phase: number
}

const RINGS: Ring[] = [
  { radius: 2.62, rotation: [1.16, 0.12, 0.34], color: '#d6f36a', opacity: 0.62, beadSpeed: 0.32, beadSize: 0.036, phase: 0 },
  { radius: 2.94, rotation: [1.42, 0.58, -0.18], color: '#f3f1e9', opacity: 0.26, beadSpeed: -0.21, beadSize: 0.026, phase: 1.8 },
  { radius: 3.32, rotation: [0.82, -0.36, 0.95], color: '#d6f36a', opacity: 0.34, beadSpeed: 0.16, beadSize: 0.028, phase: 3.4 },
  { radius: 3.66, rotation: [1.62, 0.92, 0.12], color: '#f3f1e9', opacity: 0.14, beadSpeed: -0.11, beadSize: 0.022, phase: 5.1 },
]

export function OrbitalRings({ reduced, count = 4 }: { reduced: boolean; count?: number }) {
  const beads = useRef<Array<THREE.Group | null>>([])
  const rings = RINGS.slice(0, count)

  useFrame((state) => {
    if (reduced) return
    const t = state.clock.elapsedTime
    beads.current.forEach((bead, index) => {
      if (!bead) return
      const ring = rings[index]
      if (!ring) return
      bead.rotation.z = t * ring.beadSpeed + ring.phase
    })
  })

  return (
    <group>
      {rings.map((ring, index) => (
        <group key={ring.radius} rotation={ring.rotation}>
          <mesh>
            <torusGeometry args={[ring.radius, 0.0045, 6, 260]} />
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={ring.opacity}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>

          <group ref={(node) => { beads.current[index] = node }}>
            <mesh position={[ring.radius, 0, 0]}>
              <sphereGeometry args={[ring.beadSize, 12, 12]} />
              <meshBasicMaterial color={ring.color} toneMapped={false} />
            </mesh>
            <mesh position={[ring.radius, 0, 0]} scale={7}>
              <sphereGeometry args={[ring.beadSize, 12, 12]} />
              <meshBasicMaterial
                color={ring.color}
                transparent
                opacity={0.13}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}
