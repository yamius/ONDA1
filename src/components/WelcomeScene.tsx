import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

function PanoramaControls() {
  const { camera, gl } = useThree()
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const lastY = useRef(0)
  const rotY = useRef(0)
  const rotX = useRef(0)

  useEffect(() => {
    const el = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      lastX.current = e.clientX
      lastY.current = e.clientY
      el.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastX.current
      const dy = e.clientY - lastY.current
      rotY.current -= dx * 0.003
      rotX.current -= dy * 0.003
      rotX.current = Math.max(-0.6, Math.min(0.6, rotX.current))
      lastX.current = e.clientX
      lastY.current = e.clientY
    }

    const onPointerUp = () => { isDragging.current = false }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointerleave', onPointerUp)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointerleave', onPointerUp)
    }
  }, [gl.domElement])

  useFrame((_, delta) => {
    if (!isDragging.current) {
      rotY.current -= delta * 0.06
    }
    camera.rotation.order = 'YXZ'
    camera.rotation.y = rotY.current
    camera.rotation.x = rotX.current
  })

  return null
}

export default function WelcomeScene() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 0.001] }}
        style={{ width: '100%', height: '100%' }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Environment files="/hdr/night.hdr" background />
        </Suspense>
        <PanoramaControls />
      </Canvas>
    </div>
  )
}
