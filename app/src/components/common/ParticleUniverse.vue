<script setup>
/**
 * ParticleUniverse — 粉色粒子宇宙 + 流光彗星
 * 小圆点 + 快速旋转 + 拖尾流光 + Bloom 辉光
 */
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { EffectComposer, RenderPass, EffectPass, BloomEffect } from 'postprocessing'

const props = defineProps({
  particleCount: { type: Number, default: 15000 },
  bloomIntensity: { type: Number, default: 1.2 },
  bloomRadius: { type: Number, default: 0.6 },
  rotationSpeed: { type: Number, default: 0.04 },
  cometCount: { type: Number, default: 10 },
})

const canvasRef = ref(null)
let renderer, scene, camera, galaxyPoints, cometPoints, composer
let mouseX = 0, mouseY = 0, animId, time = 0
let galaxyRotationY = 0

// ===== 星系粒子 =====
function generateGalaxy() {
  const count = props.particleCount
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const palette = [
    new THREE.Color('#c05060'),
    new THREE.Color('#d4756b'),
    new THREE.Color('#e88a9a'),
    new THREE.Color('#f0b0b8'),
  ]
  const radius = 12
  for (let i = 0; i < count; i++) {
    const r = Math.random() * radius
    const angle = r * 1.5 + (Math.random() - 0.5) * Math.max(0.1, (1 - r / radius) * 1.2) * Math.PI * 2
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    const y = (Math.random() - 0.5) * (0.3 + (1 - r / radius) * 0.8)
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z
    const t = r / radius
    const idx = Math.min(Math.floor(t * (palette.length - 1)), palette.length - 2)
    const lt = (t - idx / (palette.length - 1)) * (palette.length - 1)
    const c = palette[idx].clone().lerp(palette[idx + 1], lt)
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
  }
  return { positions, colors }
}

// ===== 流光彗星 =====
function generateComets() {
  const count = props.cometCount
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const radius = 11
  const brightPink = new THREE.Color('#f0a0b0')
  const brightWhite = new THREE.Color('#f8e8ec')

  for (let i = 0; i < count; i++) {
    const r = 4 + Math.random() * (radius - 4)
    const angle = Math.random() * Math.PI * 2
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    const y = (Math.random() - 0.5) * 1.5
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z
    const c = brightPink.clone().lerp(brightWhite, Math.random())
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
  }
  window.__cometOrbits = Array.from({ length: count }, (_, i) => ({
    radius: 4 + Math.random() * 7,
    speed: 0.3 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    yOff: (Math.random() - 0.5) * 2,
  }))
  return { positions: pos, colors: col }
}

function init() {
  const canvas = canvasRef.value
  if (!canvas) return
  const w = window.innerWidth, h = window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
  camera.position.set(0, 0.8, 10)

  renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: 'low-power' })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0xf5f0eb, 1)

  // ── 星系粒子（小圆点） ──
  const { positions: gp, colors: gc } = generateGalaxy()
  const gGeo = new THREE.BufferGeometry()
  gGeo.setAttribute('position', new THREE.BufferAttribute(gp, 3))
  gGeo.setAttribute('color', new THREE.BufferAttribute(gc, 3))
  const gMat = new THREE.PointsMaterial({
    size: 0.07, vertexColors: true, transparent: true, opacity: 1,
    blending: THREE.NormalBlending, depthWrite: true, sizeAttenuation: true,
  })
  galaxyPoints = new THREE.Points(gGeo, gMat)
  scene.add(galaxyPoints)

  // ── 流光彗星 ──
  const { positions: cp, colors: cc } = generateComets()
  const cGeo = new THREE.BufferGeometry()
  cGeo.setAttribute('position', new THREE.BufferAttribute(cp, 3))
  cGeo.setAttribute('color', new THREE.BufferAttribute(cc, 3))
  const cMat = new THREE.PointsMaterial({
    size: 0.5, vertexColors: true, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false, sizeAttenuation: true,
  })
  cometPoints = new THREE.Points(cGeo, cMat)
  scene.add(cometPoints)

  // ── Bloom 辉光 ──
  const bloom = new BloomEffect({
    intensity: props.bloomIntensity,
    radius: props.bloomRadius,
    luminanceThreshold: 0.01,
    luminanceSmoothing: 0.15,
  })
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new EffectPass(camera, bloom))

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
}

function onResize() {
  const w = window.innerWidth, h = window.innerHeight
  camera.aspect = w / h; camera.updateProjectionMatrix()
  renderer.setSize(w, h); composer.setSize(w, h)
}

function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
}

function animate() {
  animId = requestAnimationFrame(animate)
  if (!galaxyPoints || !cometPoints || !composer) return

  time += 0.016

  galaxyRotationY += props.rotationSpeed * 0.016
  galaxyPoints.rotation.y = galaxyRotationY
  galaxyPoints.rotation.x += (mouseY * 0.06 - galaxyPoints.rotation.x) * 0.015
  galaxyPoints.rotation.z += (mouseX * 0.04 - galaxyPoints.rotation.z) * 0.015

  const pos = cometPoints.geometry.attributes.position.array
  const orbits = window.__cometOrbits || []
  for (let i = 0; i < orbits.length; i++) {
    const o = orbits[i]
    const a = time * o.speed + o.phase
    const r = o.radius
    pos[i * 3] = Math.cos(a) * r
    pos[i * 3 + 1] = o.yOff + Math.sin(time * 0.5 + o.phase) * 1.2
    pos[i * 3 + 2] = Math.sin(a) * r
  }
  cometPoints.geometry.attributes.position.needsUpdate = true
  cometPoints.rotation.y = galaxyPoints.rotation.y
  cometPoints.rotation.x = galaxyPoints.rotation.x
  cometPoints.rotation.z = galaxyPoints.rotation.z

  composer.render()
}

onMounted(() => { init(); animate() })
onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMouseMove)
  renderer?.dispose(); composer?.dispose(); scene?.clear()
  window.__cometOrbits = null
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-universe" />
</template>

<style scoped>
.particle-universe {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 0;
  pointer-events: none;
  display: block;
}
</style>
