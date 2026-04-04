import { Suspense, useRef, useEffect } from 'react'
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

function cleanEXRData(data: Float32Array) {
  for (let i = 0; i < data.length; i++) {
    const v = data[i]
    if (isNaN(v) || !isFinite(v) || v < 0) {
      data[i] = 1.0
    }
  }
}

function applyAsBackground(texture: THREE.DataTexture, scene: THREE.Scene, gl: THREE.WebGLRenderer) {
  const data = texture.image?.data as Float32Array | null
  if (data) cleanEXRData(data)

  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.LinearSRGBColorSpace
  texture.needsUpdate = true

  const pmrem = new THREE.PMREMGenerator(gl)
  pmrem.compileEquirectangularShader()
  const envMap = pmrem.fromEquirectangular(texture).texture
  pmrem.dispose()

  scene.background = envMap
  scene.environment = envMap

  return envMap
}

interface CleanEnvironmentProps {
  url: string
  previewUrl?: string
}

function CleanEnvironment({ url, previewUrl }: CleanEnvironmentProps) {
  const { scene, gl } = useThree()

  const initialUrl = previewUrl ?? url
  const texture = useLoader(EXRLoader, initialUrl, (loader: EXRLoader) => {
    loader.setDataType(THREE.FloatType)
  }) as THREE.DataTexture

  const sphereRef = useRef<THREE.Mesh | null>(null)
  const fadeProgressRef = useRef(0)
  const fadeActiveRef = useRef(false)
  const fullEnvMapRef = useRef<THREE.Texture | null>(null)
  const previewEnvMapRef = useRef<THREE.Texture | null>(null)

  useEffect(() => {
    const envMap = applyAsBackground(texture, scene, gl)
    previewEnvMapRef.current = envMap

    if (!previewUrl) return

    const loader = new EXRLoader()
    loader.setDataType(THREE.FloatType)

    loader.load(url, (fullTex) => {
      const fullData = fullTex.image?.data as Float32Array | null
      if (fullData) cleanEXRData(fullData)

      fullTex.needsUpdate = true

      const pmrem = new THREE.PMREMGenerator(gl)
      pmrem.compileEquirectangularShader()
      const fullEnvMap = pmrem.fromEquirectangular(fullTex).texture
      pmrem.dispose()
      fullEnvMapRef.current = fullEnvMap

      const geo = new THREE.SphereGeometry(499, 60, 40)
      const mat = new THREE.MeshBasicMaterial({
        map: fullTex,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      const sphere = new THREE.Mesh(geo, mat)
      scene.add(sphere)
      sphereRef.current = sphere

      fadeProgressRef.current = 0
      fadeActiveRef.current = true
    })

    return () => {
      fadeActiveRef.current = false
      if (sphereRef.current) {
        scene.remove(sphereRef.current)
        sphereRef.current.geometry.dispose()
        ;(sphereRef.current.material as THREE.MeshBasicMaterial).map?.dispose()
        ;(sphereRef.current.material as THREE.MeshBasicMaterial).dispose()
        sphereRef.current = null
      }
      if (previewEnvMapRef.current) {
        previewEnvMapRef.current.dispose()
        previewEnvMapRef.current = null
      }
      if (fullEnvMapRef.current) {
        fullEnvMapRef.current.dispose()
        fullEnvMapRef.current = null
      }
      scene.background = null
      scene.environment = null
    }
  }, [texture, url, previewUrl, scene, gl])

  useFrame((_, delta) => {
    if (!fadeActiveRef.current || !sphereRef.current) return

    fadeProgressRef.current = Math.min(1, fadeProgressRef.current + delta / 2)
    const mat = sphereRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = fadeProgressRef.current

    if (fadeProgressRef.current >= 1) {
      fadeActiveRef.current = false
      if (fullEnvMapRef.current) {
        scene.background = fullEnvMapRef.current
        scene.environment = fullEnvMapRef.current
      }
      scene.remove(sphereRef.current)
      mat.map?.dispose()
      mat.dispose()
      sphereRef.current.geometry.dispose()
      sphereRef.current = null
    }
  })

  return null
}

interface WelcomeSceneProps {
  url: string
  previewUrl?: string
}

export default function WelcomeScene({ url, previewUrl }: WelcomeSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 0.001] }}
        style={{ width: '100%', height: '100%' }}
        frameloop="always"
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      >
        <Suspense fallback={null}>
          <CleanEnvironment url={url} previewUrl={previewUrl} />
        </Suspense>
        <PanoramaControls />
      </Canvas>
    </div>
  )
}
