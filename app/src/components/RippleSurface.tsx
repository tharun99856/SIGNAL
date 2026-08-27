import { useRef, useMemo, useCallback, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// PERFORMANCE: Memoize the ripple plane
const RipplePlane = memo(() => {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef(new THREE.Vector2(0, 0))
  const targetMouse = useRef(new THREE.Vector2(0, 0))
  const materialRef = useRef<any>(null)

  const customUniforms = useMemo(
    () => ({
      time: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  )

  const handlePointerMove = useCallback((e: any) => {
    const native = e.nativeEvent || e
    if (!native) return
    const rect = native.target?.getBoundingClientRect
      ? native.target.getBoundingClientRect()
      : { width: 1, height: 1, left: 0, top: 0 }
    const x = ((native.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((native.clientY - rect.top) / rect.height) * 2 - 1)
    targetMouse.current.set(x, y)
  }, [])

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime

    mouseRef.current.lerp(targetMouse.current, 0.1)

    if (meshRef.current) {
      const mat = meshRef.current.material as any
      if (mat.uniforms) {
        if (mat.uniforms.time) mat.uniforms.time.value = elapsed
        if (mat.uniforms.uMouse) mat.uniforms.uMouse.value.copy(mouseRef.current)
      }
    }

    // Add gentle ambient ripple
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position
      if (positions) {
        const arr = positions.array as Float32Array
        for (let i = 0; i < arr.length; i += 3) {
          const x = arr[i]
          const y = arr[i + 1]
          const dist = Math.sqrt(x * x + y * y)
          arr[i + 2] =
            Math.sin(dist * 3 - elapsed * 1.5) * 0.08 +
            Math.sin(x * 2 + elapsed) * 0.04
        }
        positions.needsUpdate = true
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      rotation={[-Math.PI / 6, 0, 0]}
    >
      <planeGeometry args={[10, 10, 128, 128]} />
      <MeshTransmissionMaterial
        ref={materialRef}
        background={new THREE.Color('#0A0A0A')}
        transmission={1.0}
        roughness={0.05}
        thickness={1.5}
        chromaticAberration={0.12}
        ior={1.5}
        transparent
        {...(customUniforms as any)}
      />
    </mesh>
  )
})

RipplePlane.displayName = 'RipplePlane'

// PERFORMANCE: Memoize scene
const Scene = memo(() => {
  const { viewport } = useThree()

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={20} color="#6371DD" />
      <pointLight position={[-5, -3, 3]} intensity={10} color="#3E54D3" />
      <mesh position={[0, 0, -5]} scale={[viewport.width * 2, viewport.height * 2, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#0A0A0A" />
      </mesh>
      <RipplePlane />
    </>
  )
})

Scene.displayName = 'Scene'

// PERFORMANCE: Memoize + optimize Canvas
export default memo(function RippleSurface() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: false, // PERF: Disable for speed
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={[1, 1.5]} // PERF: Limit pixel ratio
        performance={{ min: 0.5 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
})
