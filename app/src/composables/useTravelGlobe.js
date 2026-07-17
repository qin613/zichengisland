/**
 * useTravelGlobe — 3D 地球引擎（亮色版 + 连线轨迹 + 地区标签）
 */
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

// 国家经纬度
const COUNTRY_COORDS = {
  '日本': [36.2, 138.3], '韩国': [35.9, 127.8], '泰国': [15.4, 101.0],
  '越南': [14.1, 108.3], '新加坡': [1.3, 103.8], '马来西亚': [4.2, 101.5],
  '印度尼西亚': [2.3, 117.6], '菲律宾': [12.9, 121.8], '柬埔寨': [12.6, 104.9],
  '老挝': [19.9, 102.5], '缅甸': [21.9, 96.0], '尼泊尔': [28.2, 84.0],
  '印度': [20.6, 78.9], '马尔代夫': [3.2, 73.2], '斯里兰卡': [7.9, 80.8],
  '阿联酋': [23.4, 53.8], '土耳其': [38.9, 35.0], '埃及': [26.8, 30.8],
  '摩洛哥': [31.8, -7.0], '南非': [-30.6, 22.9], '肯尼亚': [0.3, 37.9],
  '坦桑尼亚': [-6.4, 34.8], '塞舌尔': [-4.7, 55.5], '毛里求斯': [-20.3, 57.6],
  '英国': [55.4, -3.4], '法国': [46.6, 2.2], '德国': [51.2, 10.5],
  '意大利': [41.9, 12.6], '西班牙': [40.2, -3.7], '葡萄牙': [39.5, -8.0],
  '荷兰': [52.1, 5.3], '瑞士': [46.8, 8.2], '奥地利': [47.5, 14.5],
  '希腊': [39.1, 22.0], '冰岛': [64.9, -18.6], '挪威': [60.5, 9.0],
  '瑞典': [60.2, 16.5], '芬兰': [62.0, 26.3], '丹麦': [55.7, 10.5],
  '波兰': [52.0, 19.1], '捷克': [49.8, 15.5], '匈牙利': [47.2, 19.5],
  '克罗地亚': [45.1, 15.5], '俄罗斯': [61.5, 85.0], '美国': [39.8, -98.6],
  '加拿大': [56.1, -106.3], '墨西哥': [23.6, -102.5], '古巴': [22.0, -80.0],
  '巴西': [-14.2, -51.9], '阿根廷': [-38.4, -63.6], '智利': [-35.7, -71.5],
  '秘鲁': [-9.2, -74.2], '哥伦比亚': [4.6, -74.3], '澳大利亚': [-25.3, 133.8],
  '新西兰': [-41.5, 172.8], '斐济': [-17.7, 178.0], '中国': [35.9, 104.2],
  '中国台湾': [23.6, 121.0], '中国香港': [22.3, 114.2], '中国澳门': [22.2, 113.5],
}

// 地区映射
const COUNTRY_REGION = {
  '日本':'东亚','韩国':'东亚','中国':'东亚','中国台湾':'东亚','中国香港':'东亚','中国澳门':'东亚',
  '泰国':'东南亚','越南':'东南亚','新加坡':'东南亚','马来西亚':'东南亚','印度尼西亚':'东南亚',
  '菲律宾':'东南亚','柬埔寨':'东南亚','老挝':'东南亚','缅甸':'东南亚','尼泊尔':'南亚',
  '印度':'南亚','马尔代夫':'南亚','斯里兰卡':'南亚','阿联酋':'中东','土耳其':'中东','埃及':'北非',
  '摩洛哥':'北非','南非':'南部非洲','肯尼亚':'东非','坦桑尼亚':'东非','塞舌尔':'东非','毛里求斯':'东非',
  '英国':'西欧','法国':'西欧','德国':'西欧','意大利':'南欧','西班牙':'南欧','葡萄牙':'南欧',
  '荷兰':'西欧','瑞士':'西欧','奥地利':'中欧','希腊':'南欧','冰岛':'北欧','挪威':'北欧',
  '瑞典':'北欧','芬兰':'北欧','丹麦':'北欧','波兰':'中欧','捷克':'中欧','匈牙利':'中欧',
  '克罗地亚':'南欧','俄罗斯':'东欧','美国':'北美','加拿大':'北美','墨西哥':'北美','古巴':'加勒比',
  '巴西':'南美','阿根廷':'南美','智利':'南美','秘鲁':'南美','哥伦比亚':'南美',
  '澳大利亚':'大洋洲','新西兰':'大洋洲','斐济':'大洋洲',
}

// 地区坐标（用于标签显示）
const REGION_LABELS = {
  '东亚': [35, 110], '东南亚': [10, 108], '南亚': [20, 80],
  '中东': [28, 45], '西欧': [50, 5], '南欧': [40, 15],
  '北欧': [60, 15], '东欧': [55, 40], '中欧': [50, 20],
  '北非': [28, 20], '南部非洲': [-28, 25], '东非': [2, 38],
  '北美': [45, -100], '南美': [-15, -60], '加勒比': [22, -78],
  '大洋洲': [-25, 135],
}

const EARTH_TEXTURE = 'https://unpkg.com/three-globe@2.24.3/example/img/earth-blue-marble.jpg'

export function useTravelGlobe(canvasRef, labelContainerRef, visitedCountries) {
  let scene, camera, renderer, labelRenderer, controls, earth, markers, glowParticles, lines
  let atmo, stars
  let animId
  const ready = ref(false)

  function latLngToPos(lat, lng, r) {
    const phi = (90 - lat) * Math.PI / 180
    const theta = (lng + 180) * Math.PI / 180
    return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
  }

  // 球面弧线（两点间的路径）
  function createArc(p1, p2, segments = 40) {
    const pts = []
    const r = 1.03
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const v = new THREE.Vector3().lerpVectors(p1, p2, t).normalize().multiplyScalar(r + Math.sin(t * Math.PI) * 0.06)
      pts.push(v)
    }
    return new THREE.CatmullRomCurve3(pts)
  }

  function createGlowTex() {
    const c = document.createElement('canvas'); c.width = 64; c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255, 180, 200, 1)')
    g.addColorStop(0.2, 'rgba(232, 120, 150, 0.8)')
    g.addColorStop(0.5, 'rgba(200, 80, 110, 0.3)')
    g.addColorStop(1, 'rgba(200, 80, 110, 0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(c); tex.needsUpdate = true
    return tex
  }

  function updateMarkers() {
    if (!earth || !scene) return
    // 清除旧元素
    ;[markers, glowParticles, lines].forEach(o => { if (o) { scene.remove(o); if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() } })

    const list = visitedCountries.value || []
    const radius = 1.02
    const pts = []
    const colors = []

    for (const name of list) {
      const coord = COUNTRY_COORDS[name]
      if (!coord) continue
      const pos = latLngToPos(coord[0], coord[1], radius)
      pts.push(pos)
      const pink = new THREE.Color().setHSL(0.93 + Math.random() * 0.04, 0.55, 0.6)
      colors.push(pink.r, pink.g, pink.b)
    }
    if (pts.length === 0) return

    // 发光标记
    const tex = createGlowTex()
    const sMat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.95 })
    markers = new THREE.Group()
    pts.forEach(p => {
      const s = new THREE.Sprite(sMat.clone()); s.position.copy(p); s.scale.set(0.14, 0.14, 1)
      markers.add(s)
    })
    scene.add(markers)

    // 环绕粒子
    const pCount = pts.length * 16
    const pPos = new Float32Array(pCount * 3); const pCol = new Float32Array(pCount * 3)
    const bp = new THREE.Color('#e88a9a'); const bw = new THREE.Color('#fff')
    for (let i = 0; i < pCount; i++) {
      const idx = Math.floor(i / 16)
      const coord = COUNTRY_COORDS[list[idx]] || [0, 0]
      const off = 0.03 + Math.random() * 0.05
      const pos = latLngToPos(coord[0] + (Math.random() - 0.5) * 3, coord[1] + (Math.random() - 0.5) * 3, radius + off)
      pPos[i * 3] = pos.x; pPos[i * 3 + 1] = pos.y; pPos[i * 3 + 2] = pos.z
      const c = bp.clone().lerp(bw, Math.random() * 0.5)
      pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3))
    const pMat = new THREE.PointsMaterial({ size: 0.012, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })
    glowParticles = new THREE.Points(pGeo, pMat)
    scene.add(glowParticles)

    // 连线（TubeGeometry 实现可见加粗弧线）
    if (pts.length >= 2) {
      const lineGroup = new THREE.Group()
      for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length
        const curve = createArc(pts[i], pts[j])
        const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.005, 4, false)
        const tubeMat = new THREE.MeshBasicMaterial({ color: '#e88a9a', transparent: true, opacity: 0.6 })
        const tube = new THREE.Mesh(tubeGeo, tubeMat)
        lineGroup.add(tube)
      }
      lines = lineGroup
      scene.add(lines)
    }
  }

  function init() {
    const canvas = canvasRef.value
    if (!canvas) return
    const w = canvas.clientWidth, h = canvas.clientHeight

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.set(0, 0.3, 2.8)

    // WebGL渲染
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5

    // CSS2D渲染（地区标签）
    labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(w, h)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0'
    labelRenderer.domElement.style.left = '0'
    labelRenderer.domElement.style.pointerEvents = 'none'
    labelRenderer.domElement.style.zIndex = '1'
    canvas.parentNode.appendChild(labelRenderer.domElement)

    // 地球（亮化版）
    const geo = new THREE.SphereGeometry(1, 64, 64)
    const texLoader = new THREE.TextureLoader()
    const mat = new THREE.MeshPhongMaterial({
      map: texLoader.load(EARTH_TEXTURE),
      specular: new THREE.Color('#888'),
      shininess: 5,
    })
    earth = new THREE.Mesh(geo, mat)
    scene.add(earth)

    // 大气辉光增强
    const aGeo = new THREE.SphereGeometry(1.015, 64, 64)
    const aMat = new THREE.MeshPhongMaterial({
      color: '#f0e0d0', transparent: true, opacity: 0.12,
      side: THREE.BackSide,
    })
    atmo = new THREE.Mesh(aGeo, aMat)
    scene.add(atmo)

    // 光照（大幅提亮）
    const ambient = new THREE.AmbientLight(0x8888aa, 1.2)
    scene.add(ambient)
    const sun = new THREE.DirectionalLight(0xffffff, 2.0)
    sun.position.set(5, 3, 5)
    scene.add(sun)
    const fill1 = new THREE.DirectionalLight(0xffeedd, 0.6)
    fill1.position.set(-3, -1, -3)
    scene.add(fill1)
    const fill2 = new THREE.DirectionalLight(0xddddff, 0.4)
    fill2.position.set(0, -3, 0)
    scene.add(fill2)

    // 地区标签
    Object.entries(REGION_LABELS).forEach(([name, coord]) => {
      const pos = latLngToPos(coord[0], coord[1], 1.25)
      const div = document.createElement('div')
      div.textContent = name
      div.style.color = 'rgba(100, 80, 70, 0.5)'
      div.style.fontSize = '11px'
      div.style.fontWeight = '500'
      div.style.fontFamily = 'inherit'
      div.style.textShadow = '0 0 8px rgba(255,255,255,0.6)'
      div.style.pointerEvents = 'none'
      div.style.letterSpacing = '0.06em'
      const label = new CSS2DObject(div)
      label.position.copy(pos)
      scene.add(label)
    })

    // 星空
    stars = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 500 }, () => new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40))
      ),
      new THREE.PointsMaterial({ size: 0.01, color: '#d4c8b8', transparent: true, opacity: 0.3 })
    )
    scene.add(stars)

    // 控件
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08
    controls.minDistance = 1.4; controls.maxDistance = 5
    controls.rotateSpeed = 0.6; controls.autoRotate = true
    controls.autoRotateSpeed = 0.6; controls.enablePan = false

    updateMarkers()

    const onResize = () => {
      const w2 = canvas.clientWidth, h2 = canvas.clientHeight
      camera.aspect = w2 / h2; camera.updateProjectionMatrix()
      renderer.setSize(w2, h2); labelRenderer.setSize(w2, h2)
    }
    window.addEventListener('resize', onResize)

    function animate() {
      animId = requestAnimationFrame(animate)
      controls.update()
      if (glowParticles) glowParticles.rotation.y += 0.003
      if (stars) stars.rotation.y -= 0.0003
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    animate()
    ready.value = true

    onUnmounted(() => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      controls?.dispose(); renderer?.dispose(); labelRenderer?.domElement?.remove()
    })
  }

  onMounted(() => init())

  return { ready, updateMarkers, COUNTRY_REGION }
}
