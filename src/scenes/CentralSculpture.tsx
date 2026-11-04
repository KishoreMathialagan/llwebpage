import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

type Props = {
  reduced: boolean
  detail: 'full' | 'lite'
}

/**
 * The central sculpture: an organic chrome knot held inside a sparse
 * architectural "loom" of metal arcs and blades. The tension between the
 * engineered frame and the fluid centre is the brand idea, made physical.
 */
export function CentralSculpture({ reduced, detail }: Props) {
  const spin = useRef<THREE.Group>(null)
  const shards = useRef<THREE.Group>(null)

  const shardGeometry = useMemo(() => new THREE.OctahedronGeometry(0.055, 0), [])
  /* CentralSculpture.tsx - enhanced chrome materials */
const shardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d2d5cc'),
    metalness: 0.98,
    roughness: 0.14,
    envMapIntensity: 1.4,
  }),
  [],
)

  useEffect(() => {
    return () => {
      shardGeometry.dispose()
      shardMaterial.dispose()
    }
  }, [shardGeometry, shardMaterial])

  const shardData = useMemo(() => {
    const count = detail === 'full' ? 14 : 8
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + i * 0.37
      const radius = 2.45 + (i % 4) * 0.28
      return {
        position: [
          Math.cos(angle) * radius,
          Math.sin(i * 1.7) * 1.15,
          Math.sin(angle) * radius * 0.72,
        ] as [number, number, number],
        rotation: [i * 0.6, i * 0.9, i * 0.4] as [number, number, number],
        scale: 0.65 + (i % 5) * 0.18,
      }
    })
  }, [detail])

  useFrame((state) => {
    if (reduced) return
    const t = state.clock.elapsedTime
    if (spin.current) {
      spin.current.rotation.y = t * 0.052
      spin.current.rotation.x = Math.sin(t * 0.065) * 0.055
    }
    if (shards.current) {
      shards.current.rotation.y = -t * 0.03
      shards.current.rotation.z = Math.sin(t * 0.055) * 0.04
    }
  })

  return (
    <group>
      <group ref={spin}>
        {/* Organic chrome knot — fluid sculptural heart */}
        <mesh rotation={[0.28, 0.1, 0.42]} castShadow>
          <torusKnotGeometry args={[1.14, 0.198, 240, 32, 2, 3]} />
          <meshStandardMaterial
            color="#c4c7be"
            metalness={0.98}
            roughness={0.12}
            envMapIntensity={1.85}
          />
        </mesh>

        {/* Luminous orbital neon thread following knot contours */}
        <mesh rotation={[0.28, 0.1, 0.42]} scale={1.04}>
          <torusKnotGeometry args={[1.14, 0.012, 260, 8, 2, 3]} />
          <meshBasicMaterial color="#eef8c6" toneMapped={false} transparent opacity={0.65} />
        </mesh>

        {/* Dark faceted core */}
        <mesh rotation={[0.4, 0.2, 0.1]}>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial
            color="#20221e"
            metalness={0.95}
            roughness={0.36}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Precision internal orbit ring */}
        <mesh rotation={[Math.PI / 2.15, 0.18, 0.2]}>
          <torusGeometry args={[1.88, 0.007, 8, 240]} />
          <meshBasicMaterial color="#d6f36a" toneMapped={false} transparent opacity={0.85} />
        </mesh>

        {/* Architectural loom arcs — structural tension */}
        <mesh rotation={[0.6, 0.25, 1.02]}>
          <torusGeometry args={[2.04, 0.022, 12, 190, Math.PI * 1.35]} />
          <meshStandardMaterial
            color="#8c9086"
            metalness={0.98}
            roughness={0.24}
            envMapIntensity={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[1.75, 0.55, 0.35]}>
          <torusGeometry args={[2.2, 0.015, 10, 190, Math.PI * 1.1]} />
          <meshStandardMaterial
            color="#6b6f65"
            metalness={0.96}
            roughness={0.32}
            envMapIntensity={1.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[0.15, 1.15, 2.1]}>
          <torusGeometry args={[1.74, 0.012, 8, 190, Math.PI * 0.92]} />
          <meshStandardMaterial
            color="#e2e4dc"
            metalness={0.98}
            roughness={0.14}
            envMapIntensity={1.75}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Minimal architectural blades */}
        <RoundedBox args={[3.3, 0.026, 0.38]} radius={0.012} smoothness={2} rotation={[0, 0, 0.32]}>
          <meshStandardMaterial
            color="#464b41"
            metalness={0.96}
            roughness={0.25}
            envMapIntensity={1.35}
          />
        </RoundedBox>
        <RoundedBox args={[2.75, 0.022, 0.3]} radius={0.01} smoothness={2} rotation={[0, 0, 1.42]}>
          <meshStandardMaterial
            color="#787d72"
            metalness={0.98}
            roughness={0.22}
            envMapIntensity={1.5}
          />
        </RoundedBox>
      </group>

      {/* Orbiting metallic fragments */}
      <group ref={shards}>
        {shardData.map((shard, index) => (
          <mesh
            key={index}
            geometry={shardGeometry}
            material={shardMaterial}
            position={shard.position}
            rotation={shard.rotation}
            scale={shard.scale}
          />
        ))}
      </group>
    </group>
  )
}
