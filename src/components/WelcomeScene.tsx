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

const EXR_P1_PREVIEW_B64 = 'data:application/octet-stream;base64,di8xAQIAAABPcmllbnRhdGlvbgBzdHJpbmcAAQAAADFTb2Z0d2FyZQBzdHJpbmcADQAAAEJsZW5kZXIgNS4xLjBjaGFubmVscwBjaGxpc3QASQAAAEEAAQAAAAAAAAABAAAAAQAAAEIAAQAAAAAAAAABAAAAAQAAAEcAAQAAAAAAAAABAAAAAQAAAFIAAQAAAAAAAAABAAAAAQAAAABjb2xvckludGVyb3BJRABzdHJpbmcAEAAAAGxpbl9yZWM3MDlfc2NlbmVjb21wcmVzc2lvbgBjb21wcmVzc2lvbgABAAAACGRhdGFXaW5kb3cAYm94MmkAEAAAAAAAAAAAAAAAfwAAAD8AAABkaXNwbGF5V2luZG93AGJveDJpABAAAAAAAAAAAAAAAH8AAAA/AAAAbGluZU9yZGVyAGxpbmVPcmRlcgABAAAAAG9paW86Q29sb3JTcGFjZQBzdHJpbmcAEAAAAGxpbl9yZWM3MDlfc2NlbmVwaXhlbEFzcGVjdFJhdGlvAGZsb2F0AAQAAAAAAIA/c2NyZWVuV2luZG93Q2VudGVyAHYyZgAIAAAAAAAAAAAAAABzY3JlZW5XaW5kb3dXaWR0aABmbG9hdAAEAAAAAACAP3hEZW5zaXR5AGZsb2F0AAQAAAAAAJBCAAACAAAAAAAAdQsAAAAAAAAAAAAAbQkAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkHAAAAAAAAGwEAAAAAAAAPAAAAAAAAAIAAAAAAAAAAACAAAAAAAAC5BwAAAAAAAMAAAAAAAAAAAAAAAAAAAAASAFIAFAFHACQBQgA0AUEACAEAAAAAEf8AAMoCAADVJwAAAAAAABP////////////////////////////////////////////////////////////////////////9eD////Qn///9Bf/kn/5H////QT95K/eSP/kb/5J/+Rv3kj95H/eSv3kf95L/eSP/kb85K/OSvzkv85J/OSvzkn85K/OSP3kn8ZK/2Sfzkv85I/GSv1kn85L/GS/xkj95L/eSfxkr8ZL/OS/3kn95L/GS/1kn9ZL/CS/1kv+pL/GSvzkv8ZL/OS//kv/////w8v9pL/////8vL/OS///9EL/IS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ZQ////0J////QX/5L/+R////0E/eSf3kj/5G/eSv3kj/5G/eSP3kj85L/OS/3kf95J/eSP/kf85K/OSPzkn85I/OSvzkn95H/eSvzkv85J/OSfzkn95I/GS/xkr8ZK/GSfzkv8ZL/GS/xkr8ZL/CS/wkv8ZJ/GSvxkv8JL/KSP5kv85L/GSfzkv85L/CS/ykv85L/CS/2kn8ZL/CS/0kr8JL/SS/1kr8pK/WS/xkv9ZL/KSvxkv+pK/KS/xkr9hL/AS/wkv9RL/SS/2Ev/xL/4S//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MwwBRhyCCSCCCSSOyywKSjjh1rDC33bv1pom61bdu+737QV2ll7s7r5hdYrdi2/M9DveHp9j0sZ3N9zH0jZitYwu3dndfwpQtV177uvsJoXVTcYsvfdw7vTsbK6viu3vu5jenFidW7vu4d3pGs/WM3fd191MxWvi3f82BpzFbtXwzZ3v3xPljO9199vhW3Kr7r77cwKl7NZVjOvfr6+6wSmiRsMIdGK197r23dEMVwyIu2uP7q7q3jgthQOPbN2+z32vvgsQHIpuZXcNN3E7s7rq+cBBFfWDd9X9uSBgm+z2S3d7fn3IxgRQ+zyW3tX6+8jHQJ3rputne/ogsgT21ib67uY77joYjcmGZ01afpVvu95oXrmvn1ele/e9yhCq6W4qt9vZ1yocDjsudcYqveVr9jM6YVVHNzd3l93h7yEWJwrYrL317r3IQSOhmyY1LL23duvIwvXEvMZaayuFZ6xQ+7ENeHwVIG5qEm9GfK2a97Lldw4VXhGCNEPTmUifLY3Kz8zb2HvYL0wrE8QjlZbX3eVxX27jZuc9vDig6aG2zLymf2fcTgZYzdZqrV3PC8yhWayulm9T27EXvBEC5AIjEziJa6s+x94zs5uNeUg4EIgssIjrrsZ68xI1vRCFOc1d6acRWs4Tg7ESgpcwwmMqIZiuiXjFmjc2AEidaq+sUjb5XcAoLwiJjSQpQOQxE5WoJ2W1nlbFsYYyuvW3LrOmCYcRQRuIrEqS9ilWvQuN7ptMXj5PJ1NyJij6KrfIosV74QZOfcwF6g3XhCvop9it+Ys/vYk/eRgchisy1n0vfUMf3UFkNzrTe/ET31HcVFC4udmbSrdYVPuxFnMBuEhFVctb5XNlFtLp9EQV0/GLp+wQ4H0F+9BiZJCFboklbT9sbbwPHbW5GfI2OZuqkcQBnTCY3Caajw8ushl0JLY7AmO67UzPqxy63KRwjBkHggRtHBs4Q21WajM/BOTzm5GfSIdhtdSOKw1mDDGmSbPa+asdOYax4ICdmVR4oOpRX2UjghDY5EToD4uxYPHS9HhAFAWGz6BdMeQNhIYVyhdEl94KQbHkGTGEIHbsViEmL44eAQTsbngum+QPCCG15Lo4PAchoIgIAtFwDgpSDIGAgAOLyYBQlBOcPCQSDAYojxxQgEYwBQPCUZHhKPnj0GkjxSkJik6PpSoeSICiUnHjo+Aklckh03lBB83PeLgPjuRlw88JzwLgUB0D0CIUhqGwmHQJhgLRIQHBkaAGCspGQjNDFQe2KRGA0nKRKJpDISiQpRUH0hiUCYB+KEnRPOQDx1zo+kLR0iEBLJl5hRErmG4ugv3SIzQpNQRaJhQrRltLpL7w+BYARAAQkSAMDQZGQuqRqEkxeiIScgcnh5c6cOj6SQ8deDrYhJ0idE6k3bSUNiwmHkSFj6UaNcW7hARpxXsT5AqG5lRIysMwoGAhWdeHkkQPD51I08NpzQ6R0qh4dGDp3PpKofcDAABtbcig93Wcea9UmW3lIEhYAsBgqC4RDCBWTCMQSFoWmk0nMumH0kpUPOH5dRR5Uh4eYjKzbJ/PHUEMsbK5eZKo5knG8bqGh0IKp4oDQJLDm5PMYV2Wb4JTqtcz66KudPnAZhLEPmEqyuva9GqnYPHXzajvFRevtPJwahKhWOslawquTeO4THdm5HFt9qL19Z5wG5l2asdc0rWSoyNM8dwnOH6+LYnvI2fw0mOHheNU0tS0RBFB2wGI3GiZvkgX9gEJNp4sZBNliECQ9ZZd05dx4sYhrELIPJ+MImg1wWMRk2iFEmmmSDiMoqMuO+E+49l/NxX+saw7N4OTmpcR4mR7u615893k/rrb1BHa5v7g7ed/ovA377eKq+r2bPU2zeRnP4MPu52B/yctkiIgAWxmqjQ9vyPCgJRDYJMUapFxBG8NyGSrVsK61EMoaFAkvFUsWIaAOMMUYZsEwpiY3AkUUykcGVhkJKMqoUFtKKhZYVpGAw9zaT3UYBAS6PDgT3T7wDHBHBueLwxUiEEZwHwXaplb+cma8a8klwY9fAFSmXnI7W6HPSeJD77T52INCqqizvKOfd2Bcp81x3/LXeNJ6APzhzwjp42qtnqKcM2lAGAQDHJ0EgAAAAQAgAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM4GAAAAAAAA+QAAAAAAAAAPAAAAAAAAAIAAAAAAAAAAACAAAAAAAAB5BwAAAAAAAMAAAAAAAAAAAAAAAAAAAAASAFIAFAFHACQBQgA0AUEACAEAAAAAGf8AAGgCAACMIgAAAAAAAA/////////////////////////////////////////////////////////////////////////9eD////Qj///9BP/kz/5H////QT95M/eR//kb/5L/+Rv3kn95I/eS/3kj95J/eSf3kn95H/OSvzkn95I/OS/zkn85K/OSP3kr8ZL/WSf3kv85L/OSfxkr8ZL/OSvzkn85I/OS/zkv85J/OSv3kr85L/OS/3kr8ZL/GS/0kr+pK/SS/wkr8ZL/WS/xkv8pL/aS/zkv///BC/1Ev8RL/IS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MD////Qn///9Bf/kr/5H////QT95K/eR//kf95J/eSP/kf95L/eSP3kr95I/eS/3kr85L/OS/3kf/5J/OS/zkr95K/OSvzkn/5L/eS/3kv/////y8v85L///6Qv/////4cv//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9nDAFGHHIHJHJLKALL/AiywLgRB0UlgUBUGDq2mWHBlrl+A2MyyzYzvVmPz8TBsOnCVhrJdrLYwpLMI2vCAqEaE3OmmN6zcAQcDA+ajwwaw9NjHMyTgUbwIxg/YnM5feMXvCgCHOJknHFCmYk8Jw2axmctoyam8YA1Bi2ZrxJkXTR+OBdBufOyCjPNM0J5j3PcxpvCUycW3l14y2abDgvVelkY1nM4u4i3spdHyEcD9A6VJEo7D0Z2lzHJFI9o2ccln5tZbeSIug/cEgDg2CMAoSi4IgFBkEIbCUgUFhCAcDwpBCLCEWKnY4qKiAWKnOQKkCp0c4qcVTcybuKgZQFNMxONxps6dmm4FQYKAPBkgDgOg8DQdAWQFCAqQFwwHAZFg0QFRVocKihAgLCrQgxA5NIMQzQhwkHHDRGEyYy8cvptyDlDljMyW3DQBAQDVsyFIMjTQ1nGikUy/JQ5RvcdieLbjhZwBjx5QaKONOrskUdDszmWS/mqJoOX1CFP27kIEWiKdmYuppR702pqPNsfeEwEgGCCOgqA0OCAkg9SYSCwsVjMXY8V7BCqnqm+OMF3cy/QBYCEuwyD4OFCcQ6FeAJDZsWYxRXh4ZmTVtvhIpSxNzL7kQMATxGIGQfBt1LsaDQvGEbi3hSZZYzTF94MDNLFChl9zgLgUOCJiRoPC4Ve6xnUOi8ZjJxA5/CjxU2Nw8TGMfihQy/YA1yDx1t+CHwdx4LMx9a/EdvF6hZaWvm8vgnaWv/onMfr5vLyRBsOPvqPl4TBujGmNZL0+uXXmh+L3HzcDguRIvEDImaNSltm7DKam9BpfcFQywVyQAhV6NqqWbuTiD9urS8UwglimnGnFrEIQ7veRQ3USRwuC7uhXGXco5fPu5MtbxwAJfdgsrWVb9pvbLyIWHEanL5pfLw+KsXX0j4vcWVB9Hev4AB0Bppk5vH8Hehd0U8fpfEXy74MIWllmL2+BBfBLdQoRcjB62xB+TtL9rbNvbMm+HUmH3NHomJnRkE5U5mYw980VYjFtz9pb1akh6k1WK+Rqhpj78m6Xn6zfHJyJl2jaK43fN+4mxGyxfQ9L9ZuSBZiJ+tM30lr8O8DTLpoaZ3hPeNx4qw7SxZTGLX596vU1Vstvm/iyzS4RX/xXTrN/1akU7/05cWv/wmsxa7/fErjyJscxSjneCRe7zcm+eLRw9jhxZEpJyjuIt1sp++03sqzRqmxsnOftuY3MXj1YezDoPWamu0y5OTjDAlr/bbey29jSdU6NXsE6eTdJruE7fIqdMW3t3HxzY45ZZUH4tXMv8lHqb06oqEjz6nTJ03/VXolVmstLqzdN/SgvbTCt/1HLKRhK501KxoxpnfDd8pfejrMRQSluPZlY9ow3gTtzF5jclFdE1rWorK8qbFlL1vU35O5ptfS6VEXTJx9f7S+2bwemuqGQsQ8eWM9oT7zeXrGqEkjWe2pZ5ocUojzx/pi13MbqRZdENrdhtgTby7H7zcHheRU4hcsNADBTpHwr9gII84UBAoUFAgIFBQeHBgNha2X2AQWHAwYACg4KAgp1OQUFAYWBgYVhpR+d4opm7lVbanT19LOLibff+VK1Xr4+/P+lhiQ2eh7i/nOLxuC/L8auKh+/daokqxjSkYYyHDSJSHWO5vmeNmkOxCKzlzAIBJBJxGUkUBSEoapJMKcCLQSA3ZKBIYMGzuFK8gOkkIwMgQmbWCYEEhuAo+IQCsA6twgwOPhs0N741hc09dGrn0j91vnvBVlszw9YF6N2vUTO0PuaXD60x2OzhzJ1/1vfaNjmIZkHfwYmbvvM8qrDWrmEmA/0HQeG0rHjaq2eopwzaUAYBAMcnQQ=='

export const PRACTICE_EXR_PREVIEW: Record<string, string> = {
  'p1-1': EXR_P1_PREVIEW_B64,
  'p1-2': EXR_P1_PREVIEW_B64,
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
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0, overflow: 'hidden', background: 'black' }}>
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
