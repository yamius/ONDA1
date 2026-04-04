import { Suspense, useRef, useEffect, useState, useCallback, Component, ReactNode } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

function PanoramaControls() {
  const { camera } = useThree()
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const lastY = useRef(0)
  const rotY = useRef(0)
  const rotX = useRef(0)
  const lastActivityTime = useRef(Date.now())

  useEffect(() => {
    const move = (x: number, y: number) => {
      const dx = x - lastX.current
      const dy = y - lastY.current
      rotY.current -= dx * 0.003
      rotX.current -= dy * 0.003
      rotX.current = Math.max(-0.6, Math.min(0.6, rotX.current))
      lastX.current = x
      lastY.current = y
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      isDragging.current = true
      lastX.current = e.touches[0].clientX
      lastY.current = e.touches[0].clientY
      lastActivityTime.current = Date.now()
    }
    const onTouchMove = (e: TouchEvent) => {
      lastActivityTime.current = Date.now()
      if (!isDragging.current || e.touches.length !== 1) return
      move(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchEnd = () => {
      isDragging.current = false
      lastActivityTime.current = Date.now()
    }

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      lastX.current = e.clientX
      lastY.current = e.clientY
      lastActivityTime.current = Date.now()
    }
    const onMouseMove = (e: MouseEvent) => {
      lastActivityTime.current = Date.now()
      if (!isDragging.current) return
      move(e.clientX, e.clientY)
    }
    const onMouseUp = () => {
      isDragging.current = false
      lastActivityTime.current = Date.now()
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchcancel', onTouchEnd)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
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
  const { scene } = useThree()

  const texture = useLoader(EXRLoader, url, (loader: EXRLoader) => {
    loader.setDataType(THREE.HalfFloatType)
  }) as THREE.DataTexture

  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.colorSpace = THREE.LinearSRGBColorSpace
    texture.needsUpdate = true
    scene.background = texture
    onReadyRef.current?.()

    return () => {
      scene.background = null
      scene.environment = null
    }
  }, [texture, scene])

  return null
}

const CANVAS_GL = {
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.0,
  alpha: true,
} as const

class PanoramaErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

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

  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    const prev = root.style.overflowY
    root.style.overflowY = 'hidden'
    return () => {
      root.style.overflowY = prev
    }
  }, [])

  return (
    <PanoramaErrorBoundary>
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0, overflow: 'hidden' }}>
      {hasPreview && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${previewUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          overflow: 'hidden',
          touchAction: 'none',
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
    </PanoramaErrorBoundary>
  )
}
