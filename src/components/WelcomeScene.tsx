import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const EXR_URL = `${SUPABASE_URL}/storage/v1/object/public/hdr/hdr_p1/exr_p1_01.exr`

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

function CleanEnvironment() {
  const texture = useLoader(EXRLoader, EXR_URL) as THREE.DataTexture

  useEffect(() => {
    const data = texture.image?.data as Float32Array | null
    if (!data) return
    const MAX_VAL = 10000
    for (let i = 0; i < data.length; i++) {
      const v = data[i]
      if (!isFinite(v) || isNaN(v) || v > MAX_VAL) {
        data[i] = i % 4 === 3 ? 1.0 : MAX_VAL
      }
    }
    texture.needsUpdate = true
  }, [texture])

  return <Environment map={texture} background intensity={1.0} />
}

export default function WelcomeScene() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 0.001] }}
        style={{ width: '100%', height: '100%' }}
        frameloop="always"
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      >
        <Suspense fallback={null}>
          <CleanEnvironment />
        </Suspense>
        <PanoramaControls />
      </Canvas>
    </div>
  )
}
