import { useRef, useMemo, memo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const vertexShader = `
  uniform float uScrollSpeed;
  uniform float uCurveStrength;
  uniform float uCurveFrequency;
  varying vec2 vUv;
  #define PI 3.141592653

  void main() {
    vec3 pos = position;
    vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    float xDisplacement = uCurveStrength * cos(worldPosition.y * uCurveFrequency);
    pos.x += xDisplacement;
    pos.x -= uCurveStrength;
    float yDisplacement = -sin(uv.x * PI) * uScrollSpeed;
    pos.y += yDisplacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
  }
`

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uPlaneSizes;
  uniform vec2 uImageSizes;
  varying vec2 vUv;

  void main() {
    vec2 ratio = vec2(
      min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
      min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec4 finalColor = texture2D(uTexture, uv);
    finalColor.rgb += 0.04;
    gl_FragColor = finalColor;
  }
`

const images = [
  '/images/ingestion-1.jpg',
  '/images/ingestion-2.jpg',
  '/images/ingestion-3.jpg',
  '/images/ingestion-1.jpg',
  '/images/ingestion-2.jpg',
  '/images/ingestion-3.jpg',
  '/images/ingestion-1.jpg',
  '/images/ingestion-2.jpg',
  '/images/ingestion-3.jpg',
]

const CARD_WIDTH = 3
const CARD_HEIGHT = 3.5
const CARD_GAP = 0.6
const CURVE_STRENGTH = 1.2
const CURVE_FREQUENCY = 0.4
const SCROLL_SPEED = 0.008

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

interface CardProps {
  index: number
  totalCount: number
  texture: THREE.Texture
  imageWidth: number
  imageHeight: number
}

// PERFORMANCE: Memoize individual cards
const Card = memo(({ index, totalCount, texture, imageWidth, imageHeight }: CardProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const totalHeight = totalCount * CARD_GAP

  const initialY = useMemo(() => {
    return index * CARD_GAP - totalCount * CARD_GAP * 0.3
  }, [index, totalCount])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uScrollSpeed: { value: SCROLL_SPEED },
        uCurveStrength: { value: CURVE_STRENGTH },
        uCurveFrequency: { value: CURVE_FREQUENCY },
        uPlaneSizes: { value: new THREE.Vector2(CARD_WIDTH, CARD_HEIGHT) },
        uImageSizes: { value: new THREE.Vector2(imageWidth, imageHeight) },
      },
      side: THREE.DoubleSide,
    })
  }, [texture, imageWidth, imageHeight])

  useFrame(() => {
    if (!meshRef.current) return
    const ref = meshRef.current
    ref.position.y -= SCROLL_SPEED
    ref.position.y = mod(ref.position.y + totalHeight / 2, totalHeight) - totalHeight / 2

    const xDisplacement = CURVE_STRENGTH * Math.cos(ref.position.y * CURVE_FREQUENCY)
    ref.position.x = xDisplacement - CURVE_STRENGTH

    const mat = ref.material as THREE.ShaderMaterial
    if (mat.uniforms) {
      mat.uniforms.uScrollSpeed.value = SCROLL_SPEED
      mat.uniforms.uCurveStrength.value = CURVE_STRENGTH
    }
  })

  return (
    <mesh
      ref={meshRef}
      material={material}
      position={[0, initialY, 0]}
    >
      <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT, 16, 16]} />
    </mesh>
  )
})

Card.displayName = 'Card'

// PERFORMANCE: Memoize scene
const Scene = memo(() => {
  const textures = useLoader(
    THREE.TextureLoader,
    images
  ) as THREE.Texture[]

  const cards = useMemo(() => {
    return images.map((_, i) => {
      const tex = textures[i % textures.length]
      return {
        index: i,
        texture: tex,
        imageWidth: (tex.image as HTMLImageElement)?.width || 768,
        imageHeight: (tex.image as HTMLImageElement)?.height || 1024,
      }
    })
  }, [textures])

  return (
    <>
      <pointLight color="#6371DD" intensity={50} position={[2, 4, 6]} />
      <ambientLight intensity={0.15} />
      <group>
        {cards.map((card) => (
          <Card
            key={card.index}
            index={card.index}
            totalCount={cards.length}
            texture={card.texture}
            imageWidth={card.imageWidth}
            imageHeight={card.imageHeight}
          />
        ))}
      </group>
      <Environment preset="city" />
    </>
  )
})

Scene.displayName = 'Scene'

// PERFORMANCE: Memoize + optimize Canvas
export default memo(function CurvedCarousel() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
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
