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
        color: new THREE.Color('#b9bcb1'),
        metalness: 1,
        roughness: 0.18,
        envMapIntensity: 1.1,
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
    const count = detail === 'full' ? 13 : 7
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
      spin.current.rotation.y = t * 0.055
      spin.current.rotation.x = Math.sin(t * 0.07) * 0.055
    }
    if (shards.current) {
      shards.current.rotation.y = -t * 0.032
      shards.current.rotation.z = Math.sin(t * 0.06) * 0.04
    }
  })

  return (
    <group>
      <group ref={spin}>
        {/* Organic chrome knot */}
        <mesh rotation={[0.28, 0.1, 0.42]} castShadow>
          <torusKnotGeometry args={[1.12, 0.195, 220, 28, 2, 3]} />
          <meshStandardMaterial
            color="#a3a69c"
            metalness={1}
            roughness={0.18}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* A single bright thread following the same path */}
        <mesh rotation={[0.28, 0.1, 0.42]} scale={1.045}>
          <torusKnotGeometry args={[1.12, 0.012, 240, 6, 2, 3]} />
          <meshBasicMaterial color="#eef7c4" toneMapped={false} transparent opacity={0.55} />
        </mesh>

        {/* Dark core */}
        <mesh rotation={[0.4, 0.2, 0.1]}>
          <icosahedronGeometry args={[0.58, 1]} />
          <meshStandardMaterial
            color="#2a2d26"
            metalness={0.92}
            roughness={0.42}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Internal orbit */}
        <mesh rotation={[Math.PI / 2.15, 0.18, 0.2]}>
          <torusGeometry args={[1.86, 0.006, 8, 220]} />
          <meshBasicMaterial color="#d6f36a" toneMapped={false} transparent opacity={0.8} />
        </mesh>

        {/* Architectural loom arcs */}
        <mesh rotation={[0.6, 0.25, 1.02]}>
          <torusGeometry args={[2.02, 0.022, 10, 180, Math.PI * 1.35]} />
          <meshStandardMaterial
            color="#767a70"
            metalness={1}
            roughness={0.34}
            envMapIntensity={1.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[1.75, 0.55, 0.35]}>
          <torusGeometry args={[2.18, 0.014, 8, 180, Math.PI * 1.1]} />
          <meshStandardMaterial
            color="#5c6057"
            metalness={1}
            roughness={0.4}
            envMapIntensity={1.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[0.15, 1.15, 2.1]}>
          <torusGeometry args={[1.72, 0.012, 8, 180, Math.PI * 0.9]} />
          <meshStandardMaterial
            color="#d0d2c8"
            metalness={1}
            roughness={0.18}
            envMapIntensity={1.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Blades */}
        <RoundedBox args={[3.25, 0.028, 0.38]} radius={0.012} smoothness={2} rotation={[0, 0, 0.32]}>
          <meshStandardMaterial
            color="#3c4038"
            metalness={0.95}
            roughness={0.3}
            envMapIntensity={1.2}
          />
        </RoundedBox>
        <RoundedBox args={[2.7, 0.024, 0.3]} radius={0.01} smoothness={2} rotation={[0, 0, 1.42]}>
          <meshStandardMaterial
            color="#62665c"
            metalness={1}
            roughness={0.28}
            envMapIntensity={1.35}
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
