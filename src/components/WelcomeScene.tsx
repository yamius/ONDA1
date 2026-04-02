import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

function PanoramaControls() {
  const { camera } = useThree()
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const lastY = useRef(0)
  const rotY = useRef(0)
  const rotX = useRef(0)
  const lastActivityTime = useRef(Date.now())

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      lastX.current = e.clientX
      lastY.current = e.clientY
      lastActivityTime.current = Date.now()
    }

    const onPointerMove = (e: PointerEvent) => {
      lastActivityTime.current = Date.now()
      if (!isDragging.current) return
      const dx = e.clientX - lastX.current
      const dy = e.clientY - lastY.current
      rotY.current -= dx * 0.003
      rotX.current -= dy * 0.003
      rotX.current = Math.max(-0.6, Math.min(0.6, rotX.current))
      lastX.current = e.clientX
      lastY.current = e.clientY
    }

    const onPointerUp = () => {
      isDragging.current = false
      lastActivityTime.current = Date.now()
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  useFrame((_, delta) => {
    const idleSeconds = (Date.now() - lastActivityTime.current) / 1000
    if (!isDragging.current && idleSeconds >= 4) {
      rotY.current -= delta * 0.02
    }
    camera.rotation.order = 'YXZ'
    camera.rotation.y = rotY.current
    camera.rotation.x = rotX.current
  })

  return null
}

interface ParticlesProps {
  count?: number
  color?: string
  size?: number
  speed?: number
  spread?: number
}

function Particles({ count = 180, color = '#ffffff', size = 0.012, speed = 0.08, spread = 3.5 }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null)

  const { positions, velocities, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const r = spread * (0.4 + Math.random() * 0.6)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      velocities[i * 3] = (Math.random() - 0.5) * 0.4
      velocities[i * 3 + 1] = 0.2 + Math.random() * 0.5
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.4

      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, velocities, phases }
  }, [count, spread])

  const posRef = useRef(positions.slice())

  useFrame((state, delta) => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] * delta * speed
      pos[i * 3 + 1] += velocities[i * 3 + 1] * delta * speed
      pos[i * 3 + 2] += velocities[i * 3 + 2] * delta * speed

      pos[i * 3] += Math.sin(t * 0.3 + phases[i]) * delta * 0.05

      const dist = Math.sqrt(
        pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2
      )
      if (dist > spread * 1.1 || pos[i * 3 + 1] > spread) {
        pos[i * 3] = posRef.current[i * 3]
        pos[i * 3 + 1] = posRef.current[i * 3 + 1]
        pos[i * 3 + 2] = posRef.current[i * 3 + 2]
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true

    const mat = mesh.current.material as THREE.PointsMaterial
    mat.opacity = 0.55 + Math.sin(t * 0.8) * 0.15
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

interface WelcomeSceneProps {
  files: string
  night?: boolean
}

export default function WelcomeScene({ files, night = false }: WelcomeSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 0.001] }}
        style={{ width: '100%', height: '100%' }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Environment files={files} background />
        </Suspense>
        {night ? (
          <Particles count={200} color="#a8d8ff" size={0.010} speed={0.04} spread={3.5} />
        ) : (
          <Particles count={150} color="#ffffff" size={0.014} speed={0.07} spread={3.5} />
        )}
        <PanoramaControls />
      </Canvas>
    </div>
  )
}
