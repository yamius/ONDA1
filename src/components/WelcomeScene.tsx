import { Suspense, useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const HDR_BASE = `${SUPABASE_URL}/storage/v1/object/public/hdr/hdr_p1`

export const PRACTICE_EXR: Record<string, string> = {
  'p1-1': `${HDR_BASE}/exr_p1_01.exr`,
  'p1-2': `${HDR_BASE}/exr_p1_02.exr`,
}

export const PRACTICE_EXR_PREVIEW: Record<string, string> = {
  'p1-1': '/hdr/exr_p1_01_prev.exr',
  'p1-2': '/hdr/exr_p1_01_prev.exr',
}

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

interface CleanEnvironmentProps {
  url: string
  onReady?: () => void
}

function CleanEnvironment({ url, onReady }: CleanEnvironmentProps) {
  const { scene, gl } = useThree()
  const texture = useLoader(EXRLoader, url, (loader: EXRLoader) => {
    loader.setDataType(THREE.FloatType)
  }) as THREE.DataTexture

  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const data = texture.image?.data as Float32Array | null
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const v = data[i]
        if (isNaN(v) || !isFinite(v) || v < 0) data[i] = 1.0
      }
    }

    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.colorSpace = THREE.LinearSRGBColorSpace
    texture.needsUpdate = true

    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const envMap = pmrem.fromEquirectangular(texture).texture
    pmrem.dispose()

    scene.background = envMap
    scene.environment = envMap

    onReadyRef.current?.()

    return () => {
      envMap.dispose()
      scene.background = null
      scene.environment = null
    }
  }, [texture, scene, gl])

  return null
}

const CANVAS_GL = {
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.0,
} as const

const CANVAS_CAMERA = { fov: 75, position: [0, 0, 0.001] as [number, number, number] }

interface WelcomeSceneProps {
  url: string
  previewUrl?: string
}

export default function WelcomeScene({ url, previewUrl }: WelcomeSceneProps) {
  const [fullReady, setFullReady] = useState(false)
  const hasPreview = Boolean(previewUrl)

  const handleFullReady = useCallback(() => {
    setFullReady(true)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0, overflow: 'hidden' }}>
      {hasPreview && (
        <div className="absolute inset-0" style={{ pointerEvents: 'none', overflow: 'hidden' }}>
          <Canvas
            camera={CANVAS_CAMERA}
            style={{ display: 'block', width: '100%', height: '100%' }}
            frameloop="always"
            gl={CANVAS_GL}
          >
            <Suspense fallback={null}>
              <CleanEnvironment url={previewUrl!} />
            </Suspense>
          </Canvas>
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          overflow: 'hidden',
          opacity: hasPreview && !fullReady ? 0 : 1,
          transition: hasPreview ? 'opacity 2000ms ease-in-out' : 'none',
        }}
      >
        <Canvas
          camera={CANVAS_CAMERA}
          style={{ display: 'block', width: '100%', height: '100%' }}
          frameloop="always"
          gl={CANVAS_GL}
        >
          <Suspense fallback={null}>
            <CleanEnvironment
              url={url}
              onReady={hasPreview ? handleFullReady : undefined}
            />
          </Suspense>
          <PanoramaControls />
        </Canvas>
      </div>
    </div>
  )
}
