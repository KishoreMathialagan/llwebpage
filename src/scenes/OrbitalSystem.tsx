import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbitalSystemProps {
  reduced?: boolean
}

/**
 * OrbitalSystem
 *
 * Delicate architectural orbital ellipses enclosing the central sculpture.
 * Features:
 * - 3 interlocking tilted metallic rings (silver & muted olive)
 * - Precision metallic sphere orbiting along the outer trajectory on the right
 */
export function OrbitalSystem({ reduced = false }: OrbitalSystemProps) {
  const sphereRef = useRef<THREE.Group>(null)

  // 1. Primary Outer Ellipse
  const ring1Geo = useMemo(() => {
    const a = 4.4
    const b = 2.1
    const pts: THREE.Vector3[] = []
    const segs = 140
    for (let i = 0; i <= segs; i++) {
      const theta = (i / segs) * Math.PI * 2
      pts.push(new THREE.Vector3(a * Math.cos(theta), b * Math.sin(theta), 0))
    }
    const curve = new THREE.CatmullRomCurve3(pts, true)
    return new THREE.TubeGeometry(curve, 180, 0.009, 10, true)
  }, [])

  // 2. Secondary Interlocking Ellipse
  const ring2Geo = useMemo(() => {
    const a = 3.65
    const b = 1.75
    const pts: THREE.Vector3[] = []
    const segs = 120
    for (let i = 0; i <= segs; i++) {
      const theta = (i / segs) * Math.PI * 2
      pts.push(new THREE.Vector3(a * Math.cos(theta), b * Math.sin(theta), 0))
    }
    const curve = new THREE.CatmullRomCurve3(pts, true)
    return new THREE.TubeGeometry(curve, 160, 0.008, 8, true)
  }, [])

  // 3. Inner Delicate Accent Ellipse
  const ring3Geo = useMemo(() => {
    const a = 2.9
    const b = 1.35
    const pts: THREE.Vector3[] = []
    const segs = 100
    for (let i = 0; i <= segs; i++) {
      const theta = (i / segs) * Math.PI * 2
      pts.push(new THREE.Vector3(a * Math.cos(theta), b * Math.sin(theta), 0))
    }
    const curve = new THREE.CatmullRomCurve3(pts, true)
    return new THREE.TubeGeometry(curve, 140, 0.007, 8, true)
  }, [])

  // Sphere geometry and material
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.105, 32, 32), [])

  useFrame((state) => {
    if (reduced || !sphereRef.current) return
    // Smooth, slow orbital transit along Ring 1 on the right quadrant
    const t = (state.clock.elapsedTime * 0.12) % (Math.PI * 2)
    // Ring 1 is a=4.4, b=2.1
    const a = 4.4
    const b = 2.1
    const localX = a * Math.cos(t)
    const localY = b * Math.sin(t)
    sphereRef.current.position.set(localX, localY, 0)
  })

  return (
    <group>
      {/* Ring 1 (Outer Silver Orbit with Orbiting Sphere) */}
      <group rotation={[0.38, 0.45, -0.15]}>
        <mesh geometry={ring1Geo}>
          <meshPhysicalMaterial
            color="#C5C8BB"
            roughness={0.16}
            metalness={0.96}
            clearcoat={0.9}
            reflectivity={0.95}
            envMapIntensity={2.0}
          />
        </mesh>

        {/* Orbiting Metallic Chrome Sphere */}
        <group ref={sphereRef} position={[4.4, 0, 0]}>
          <mesh geometry={sphereGeo} castShadow>
            <meshPhysicalMaterial
              color="#C5C8BB"
              roughness={0.08}
              metalness={0.98}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              reflectivity={0.98}
              envMapIntensity={2.8}
            />
          </mesh>

          {/* Micro Lime Glow Core on Sphere */}
          <pointLight
            color="#B9D94A"
            intensity={1.2}
            distance={1.6}
            decay={2}
          />
        </group>
      </group>

      {/* Ring 2 (Tilted Muted Olive Orbit) */}
      <group rotation={[-0.42, -0.32, 0.48]}>
        <mesh geometry={ring2Geo}>
          <meshPhysicalMaterial
            color="#777F38"
            roughness={0.24}
            metalness={0.92}
            clearcoat={0.65}
            reflectivity={0.88}
            envMapIntensity={1.8}
          />
        </mesh>
      </group>

      {/* Ring 3 (Inner Counter-Tilted Silver Orbit) */}
      <group rotation={[0.25, -0.55, -0.25]}>
        <mesh geometry={ring3Geo}>
          <meshPhysicalMaterial
            color="#C5C8BB"
            roughness={0.18}
            metalness={0.95}
            clearcoat={0.8}
            reflectivity={0.92}
            envMapIntensity={1.9}
          />
        </mesh>
      </group>
    </group>
  )
}
