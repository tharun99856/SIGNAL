import { useRef, useMemo, useCallback, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const trailVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const trailFragmentShader = `
  varying vec2 vUv;
  uniform float uTime;

  float circle(vec2 uv, vec2 pos) {
    float d = length(uv - pos);
    return max(0.0, 1.0 - d * 8.0);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    uv.y = 1.0 - uv.y;

    vec2 trail1Pos = vec2(0.4 + sin(time * 0.7) * 0.15, 0.3 + cos(time * 0.5) * 0.15);
    float c1 = circle(uv, trail1Pos);

    vec2 trail2Pos = vec2(0.7 + cos(time * 0.6) * 0.2, 0.6 + sin(time * 0.8) * 0.2);
    float c2 = circle(uv, trail2Pos);

    vec3 trailColor = vec3(0.04, 0.04, 0.08) * (c1 * 0.5 + c2 * 0.5);
    gl_FragColor = vec4(trailColor, 1.0);
  }
`

const starVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const starFragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSpeed;

  float circle(vec2 uv, vec2 pos) {
    float d = length(uv - pos);
    return max(0.0, 1.0 - d * 8.0);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    float speed = uSpeed;

    vec2 star1Pos = vec2(0.35 + sin(time * speed) * 0.25, 0.35 + cos(time * speed * 0.8) * 0.25);
    float c1 = circle(uv, star1Pos);

    vec2 star2Pos = vec2(0.65 + cos(time * speed * 0.9) * 0.25, 0.65 + sin(time * speed * 1.1) * 0.25);
    float c2 = circle(uv, star2Pos);

    float combined = max(c1, c2);
    float glow = pow(combined, 1.4);

    vec3 color1 = vec3(0.24, 0.32, 0.82) * c1;
    vec3 color2 = vec3(0.38, 0.44, 0.86) * c2;
    vec3 col = color1 + color2;

    col += vec3(0.5, 0.6, 1.0) * glow * 0.4;
    col += vec3(0.2, 0.1, 0.5) * pow(glow, 3.0) * 0.2;

    gl_FragColor = vec4(col, 1.0);
  }
`

// PERFORMANCE: Memoize to prevent unnecessary re-renders
const TrailPlane = memo(() => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={trailVertexShader}
        fragmentShader={trailFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
})

TrailPlane.displayName = 'TrailPlane'

const StarPlane = memo(({ speed }: { speed: React.MutableRefObject<number> }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 0.2 },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uSpeed.value =
        0.2 + speed.current * 0.5
    }
  })

  return (
    <mesh position={[0, 0, -9.5]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
})

StarPlane.displayName = 'StarPlane'

const Scene = memo(() => {
  const speedRef = useRef(0.2)
  const targetSpeed = useRef(0.2)
  const { viewport, size } = useThree()

  const handlePointerMove = useCallback(
    (e: THREE.Event) => {
      const native = (e as any).nativeEvent || e
      if (!native) return
      const clientX = native.clientX ?? 0
      const clientY = native.clientY ?? 0
      const cx = size.width / 2
      const cy = size.height / 2
      const dx = (clientX - cx) / cx
      const dy = (clientY - cy) / cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      targetSpeed.current = 0.2 + Math.min(dist, 1) * 0.8
    },
    [size]
  )

  useFrame(() => {
    speedRef.current += (targetSpeed.current - speedRef.current) * 0.05
  })

  return (
    <group onPointerMove={handlePointerMove}>
      <mesh position={[0, 0, -11]} scale={[viewport.width * 2, viewport.height * 2, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#0A0A0A" />
      </mesh>
      <TrailPlane />
      <StarPlane speed={speedRef} />
    </group>
  )
})

Scene.displayName = 'Scene'

// PERFORMANCE: Memoize entire component + optimize Canvas settings
export default memo(function StarVisualization() {
  return (
    <div className="absolute inset-0">
      <Canvas
        orthographic
        camera={{ zoom: 50, position: [0, 0, 10] }}
        gl={{ 
          antialias: false, // PERF: Disable antialiasing for speed
          alpha: false,
          powerPreference: 'high-performance', // Use GPU acceleration
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]} // PERF: Limit device pixel ratio
        performance={{ min: 0.5 }} // Auto-degrade if slow
        frameloop="demand" // Only render when needed
        style={{ background: '#0A0A0A' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
})
