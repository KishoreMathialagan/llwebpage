import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { CentralSculpture } from './CentralSculpture'
import { OrbitalRings } from './OrbitalRings'
import { FloatingParticles } from './FloatingParticles'
import { createRadialTexture } from './textures'

function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree()

  useFrame((state) => {
    if (reduced) return
    // Subtle pointer-based rotation
    const targetX = state.pointer.x * 0.15
    const targetY = state.pointer.y * 0.1
    camera.position.x += (targetX - camera.position.x) * 0.02
    camera.position.y += (targetY - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })

  return null
}

export function GrowthOrbit({ reduced }: { reduced: boolean }) {
  const { size } = useThree()
  const parallax = useRef<THREE.Group>(null)

  const detail: 'full' | 'lite' = size.width < 720 ? 'lite' : 'full'
  const mobile = size.width < 720
  const tablet = size.width < 1120

  const position: [number, number, number] = mobile
    ? [0, -0.08, 0]
    : tablet
      ? [1.15, 0.24, 0]
      : [1.62, 0.08, 0]
  const scale = mobile ? 0.6 : tablet ? 0.8 : 0.94

  const glowTexture = useMemo(
    () =>
      createRadialTexture([
        [0, 'rgba(255,255,255,0.9)'],
        [0.22, 'rgba(255,255,255,0.35)'],
        [1, 'rgba(255,255,255,0)'],
      ]),
    [],
  )

  useEffect(() => () => glowTexture.dispose(), [glowTexture])

  useFrame((state) => {
    if (reduced || !parallax.current) return
    const targetY = state.pointer.x * 0.1
    const targetX = -state.pointer.y * 0.05
    parallax.current.rotation.y += (targetY - parallax.current.rotation.y) * 0.045
    parallax.current.rotation.x += (targetX - parallax.current.rotation.x) * 0.045
  })

  return (
    <>
      <CameraRig reduced={reduced} />

      <ambientLight intensity={0.38} />
      <directionalLight position={[4.5, 6, 4.5]} intensity={2.4} color="#f7f2df" />
      <directionalLight position={[-5, -1.5, 3]} intensity={0.75} color="#dbe7c0" />
      <pointLight position={[2.4, -0.8, 2.6]} intensity={9} distance={9} decay={2} color="#d6f36a" />
      <ambientLight intensity={0.25} />
      <spotLight
        position={[-4.5, 3.5, 3.5]}
        angle={0.55}
        penumbra={1}
        intensity={30}
        distance={16}
        decay={2}
        color="#f3f1e9"
      />

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={5}
          color="#f3f1e9"
          scale={[12, 7, 1]}
          position={[0, 6, -6]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="circle"
          intensity={1.2}
          color="#d6f36a"
          scale={[5, 5, 1]}
          position={[-7, 1, 2]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#ffffff"
          scale={[6, 3, 1]}
          position={[6, -1, 3]}
          target={[0, 0, 0]}
        />
      </Environment>

      <group ref={parallax}>
        <group position={position} scale={scale}>
          <CentralSculpture reduced={reduced} detail={detail} />
          <OrbitalRings reduced={reduced} count={mobile ? 3 : 4} />
          <FloatingParticles reduced={reduced} detail={detail} />
        </group>
      </group>

      {/* Controlled atmospheric glow, kept behind the sculpture */}
      <sprite position={[-2.6, 0.6, -2.4]} scale={[7, 7, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#d6f36a"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[2.4, 1.6, -3.2]} scale={[9, 9, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#f3f1e9"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      {/* A pool of light beneath the installation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.6, -2.7, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshBasicMaterial
          map={glowTexture}
          color="#cfe58a"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  )
}
