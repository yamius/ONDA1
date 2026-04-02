import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'

export default function WelcomeScene() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 0.001] }}
        style={{ width: '100%', height: '100%' }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Environment
            files="/hdr/night.hdr"
            background
          />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={-0.4}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
