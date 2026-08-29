// ============================================================================
//  程序化电影感海洋 · WebGPU + TSL
//  - 5 组 Gerstner 波驱动高密度海面，解析法线（大尺度稳定）
//  - 三层梯度噪声 + FBM 细节
//  - 深浅水色 / Fresnel 反射 / 浪尖透光 / 太阳闪光 / 泡沫 / 地平线雾化
//  - 解析天空函数（太阳圆盘 / 光晕 / 程序化云带 / 昼夜连续调色）与海面反射共用
//  - TSL Bloom + ACES + OrbitControls + 自动漂移 + SEA STATE / TIME OF DAY / DRIFT / FPS
//  - 加载 / 错误界面、WebGPU 检测、响应式、触摸、DPR 上限、标签页暂停、性能保护
// ============================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import {
  Fn, vec2, vec3, vec4, float, uniform, varying,
  positionLocal, positionWorld, cameraPosition,
  sin, cos, dot, normalize, mix, clamp, smoothstep, pow, max, abs, length, reflect,
  mx_fractal_noise_float, pass,
} from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

// ---- 诊断标记：确认模块求值成功 ----
window.__oceanLoaded = 1;

// ---------- DOM ----------
const appEl = document.getElementById('app');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorMsgEl = document.getElementById('error-msg');
const fpsEl = document.getElementById('fps');
const seaInput = document.getElementById('sea');
const todInput = document.getElementById('tod');
const driftToggle = document.getElementById('drift');
const seaValEl = document.getElementById('sea-val');
const todValEl = document.getElementById('tod-val');

const params = new URLSearchParams(location.search);
const isBg = params.has('bg');
if (isBg) document.body.classList.add('bg-mode');

function showError(msg) {
  console.error('[Ocean] ERROR:', msg);
  errorMsgEl.textContent = msg || '初始化失败。';
  errorEl.classList.add('show');
  loadingEl.classList.add('hide');
}
function hideLoading() {
  loadingEl.classList.add('hide');
}

// 全局错误捕获：任何未处理异常都显示到界面，避免"静默黑屏"
window.addEventListener('error', (e) => {
  if (errorEl && !errorEl.classList.contains('show')) {
    showError('页面脚本错误：' + (e.message || e.error || 'unknown'));
  }
});
window.addEventListener('unhandledrejection', (e) => {
  if (errorEl && !errorEl.classList.contains('show')) {
    showError('异步初始化失败：' + (e.reason && e.reason.message ? e.reason.message : e.reason));
  }
});

// ---------- Uniforms ----------
const uTime = uniform(0);
const uSeaState = uniform(parseFloat(seaInput.value));      // 0..1 海况
const uTimeOfDay = uniform(parseFloat(todInput.value));     // 0..1 昼夜
const uSunDir = uniform(new THREE.Vector3(0, 0.95, 0.3).normalize());

function updateSun(tod) {
  const ang = tod * Math.PI * 2.0;
  const elev = Math.sin(ang);          // -1(午夜) .. 1(正午)
  const az = ang;
  uSunDir.value.set(Math.cos(az), elev, Math.sin(az)).normalize();
}
updateSun(uTimeOfDay.value);

// ============================================================================
//  Gerstner 波场（顶点阶段计算位移 / 解析法线 / 波高）
// ============================================================================
const WAVES = [
  { a: 0.0, L: 180, A: 4.0, s: 1.0 },
  { a: 0.7, L: 110, A: 2.6, s: 1.2 },
  { a: 1.3, L: 64,  A: 1.5, s: 1.5 },
  { a: 2.0, L: 38,  A: 0.9, s: 1.8 },
  { a: 2.7, L: 22,  A: 0.5, s: 2.2 },
];
const STEEPNESS = 0.85;
const NW = WAVES.length;

function computeField() {
  const p = positionLocal.xz; // 水平坐标 (x, z)
  let dx = float(0), dz = float(0), hgt = float(0);
  let nx = float(0), nz = float(0), ny = float(1);

  for (let i = 0; i < NW; i++) {
    const w = WAVES[i];
    const dirX = Math.cos(w.a);
    const dirZ = Math.sin(w.a);
    const k = (2 * Math.PI) / w.L;
    const omega = Math.sqrt(9.8 * k);
    // 保证不产生环：Q*A*k*N <= STEEPNESS
    const Qbase = STEEPNESS / (k * w.A * NW);

    const Aeff = float(w.A).mul(uSeaState);
    const Qeff = float(Qbase).mul(uSeaState);

    const phaseArg = p.x.mul(dirX).add(p.y.mul(dirZ));
    const ph = float(k).mul(phaseArg).add(float(omega).mul(uTime));
    const c = cos(ph);
    const s = sin(ph);

    dx = dx.add(Qeff.mul(Aeff).mul(dirX).mul(c));
    dz = dz.add(Qeff.mul(Aeff).mul(dirZ).mul(c));
    hgt = hgt.add(Aeff.mul(s));

    const WA = float(k).mul(Aeff);
    nx = nx.sub(WA.mul(c).mul(dirX));
    nz = nz.sub(WA.mul(c).mul(dirZ));
    ny = ny.sub(Qeff.mul(WA).mul(s));
  }

  const pos = vec3(p.x.add(dx), hgt, p.y.add(dz));
  const normal = vec3(nx, ny, nz);
  return { pos, normal, height: hgt };
}

const oceanPositionFn = Fn(() => computeField().pos);
const oceanNormalFn = Fn(() => computeField().normal);
const oceanHeightFn = Fn(() => computeField().height);

// ============================================================================
//  解析天空函数（与海面反射共用 sunDir / 昼夜调色）
// ============================================================================
const skyColor = Fn(([dir]) => {
  const d = normalize(dir);
  const day = smoothstep(-0.05, 0.22, uSunDir.y);

  const horizonDay = vec3(0.72, 0.80, 0.92);
  const zenithDay = vec3(0.16, 0.40, 0.78);
  const horizonNight = vec3(0.04, 0.06, 0.11);
  const zenithNight = vec3(0.01, 0.02, 0.05);

  const horizonCol = mix(horizonNight, horizonDay, day);
  const zenithCol = mix(zenithNight, zenithDay, day);
  const t = clamp(d.y, 0.0, 1.0);
  let col = mix(horizonCol, zenithCol, pow(t, 0.45));

  // 低空暖色（日出/日落）
  const lowSun = smoothstep(0.30, 0.0, abs(uSunDir.y));
  const warm = vec3(1.0, 0.45, 0.18);
  col = mix(col, warm, lowSun.mul(0.35).mul(smoothstep(0.0, 0.25, d.y)));

  // 太阳圆盘 + 光晕
  const sd = dot(d, uSunDir);
  const sunVis = smoothstep(-0.02, 0.15, uSunDir.y);
  const disk = smoothstep(0.9988, 0.9995, sd);
  const glow = pow(max(sd, 0.0), 250.0).mul(0.5).add(pow(max(sd, 0.0), 8.0).mul(0.25));
  const sunCol = mix(vec3(1.0, 0.4, 0.15), vec3(1.0, 0.96, 0.85), day);
  col = col.add(sunCol.mul(glow).mul(sunVis)).add(sunCol.mul(disk).mul(2.0).mul(sunVis));

  // 低空程序化云带
  const cUV = d.xz.div(max(d.y, 0.08));
  const cc = cUV.mul(0.5).add(vec2(uTime.mul(0.01), uTime.mul(0.004)));
  const cn = mx_fractal_noise_float(vec3(cc.x, cc.y, 0.0), 5, 2.0, 0.5);
  const cloud = smoothstep(0.05, 0.5, cn.mul(0.5).add(0.5));
  const cloudCol = mix(vec3(0.12, 0.13, 0.18), vec3(1.0, 0.96, 0.9), day);
  const lit = clamp(dot(d, uSunDir).mul(0.5).add(0.5), 0.0, 1.0);
  const cloudLit = cloudCol.mul(mix(0.3, 1.0, lit)).mul(sunVis.mul(0.7).add(0.3));
  col = mix(col, cloudLit, cloud.mul(smoothstep(0.0, 0.12, d.y)));

  return col;
});

// ============================================================================
//  海面着色（片元阶段）
// ============================================================================
// 海面着色（片元阶段）——构建失败时降级为简单配色，避免整页失败
let vNormal = varying(vec3(0, 1, 0));
let vHeight = varying(float(0));
let oceanColorNode;
try {
  vNormal = varying(oceanNormalFn());
  vHeight = varying(oceanHeightFn());

  oceanColorNode = (() => {
  const N0 = normalize(vNormal);

  // FBM 微扰动（浪面细节）
  const ripple = mx_fractal_noise_float(
    positionWorld.xz.mul(0.06).add(vec2(0.0, uTime.mul(0.03))), 4, 2.0, 0.5
  );
  const N = normalize(N0.add(vec3(ripple.mul(0.05), 0.0, ripple.mul(0.05))));

  const V = normalize(cameraPosition.sub(positionWorld));
  const I = positionWorld.sub(cameraPosition).normalize();
  const R = reflect(I, N);

  const day = smoothstep(-0.05, 0.22, uSunDir.y);
  const skyRefl = skyColor(R);

  // Fresnel（Schlick）
  const fres = float(0.02).add(
    float(1.0).sub(0.02).mul(pow(clamp(float(1.0).sub(dot(N, V)), 0.0, 1.0), 5.0))
  );

  // 水体颜色
  const deep = mix(vec3(0.01, 0.05, 0.09), vec3(0.02, 0.12, 0.20), day);
  const shallow = mix(vec3(0.03, 0.12, 0.16), vec3(0.06, 0.32, 0.36), day);
  const hN = clamp(vHeight.mul(0.12).add(0.5), 0.0, 1.0);
  const water = mix(deep, shallow, hN);

  // 浪尖透光（subsurface）
  const sss = pow(max(hN.sub(0.5), 0.0), 2.0).mul(vec3(0.10, 0.35, 0.42)).mul(day.add(0.25));

  // 太阳闪光（specular glint）
  const spec = pow(max(dot(R, uSunDir), 0.0), 120.0).mul(3.0).mul(smoothstep(-0.02, 0.15, uSunDir.y));

  // 泡沫（FBM + 浪尖）
  const foamN = mx_fractal_noise_float(
    positionWorld.xz.mul(0.02).add(vec2(uTime.mul(0.05), 0.0)), 4, 2.0, 0.5
  ).mul(0.5).add(0.5);
  const crestFoam = smoothstep(0.55, 0.9, hN);
  const foamMask = max(smoothstep(0.62, 0.85, foamN), crestFoam.mul(0.8));
  const foam = vec3(0.9, 0.95, 1.0).mul(foamMask).mul(day.mul(0.7).add(0.3));

  let col = mix(water.add(sss), skyRefl, fres)
    .add(spec.mul(vec3(1.0, 0.95, 0.8)))
    .add(foam);

  // 地平线雾化（与天空地平线无缝衔接）
  const dist = length(cameraPosition.sub(positionWorld));
  const fog = smoothstep(200.0, 1600.0, dist);
  const horizonDir = normalize(vec3(V.x, 0.02, V.z));
  const horizonCol = skyColor(horizonDir);
  col = mix(col, horizonCol, fog);

  return vec4(col, 1.0);
})();
  } catch (e) {
    window.__oceanErr = (e && e.message) ? e.message : String(e);
    console.error('[Ocean] 海面着色器构建失败，已降级：', e);
    oceanColorNode = vec4(vec3(0.03, 0.12, 0.22), 1.0); // 降级：深蓝水面
  }

// ============================================================================
//  场景搭建
// ============================================================================
let renderer, scene, camera, controls, postProcessing, sky;
let rafId = null;
let paused = false;
let currentDPR = 1;
let autoCycle = false; // 昼夜自动循环

// 性能保护
const MAX_DPR = 2;
let frames = 0;
let fpsLast = performance.now();

// 标签页暂停计时
let lastFrame = performance.now();

function init() {
  if (!WebGPU.isAvailable()) {
    showError('当前浏览器不支持 WebGPU，无法渲染海洋。');
    return false;
  }

  try {
    renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true });
  } catch (e) {
    showError('WebGPU 渲染器创建失败：' + (e && e.message ? e.message : e));
    return false;
  }

  try {
    console.log('[Ocean] WebGPU OK, building scene...');
    currentDPR = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    renderer.setPixelRatio(currentDPR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x05070d, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    appEl.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 14000);
    camera.position.set(0, 14, 90);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minDistance = 20;
    controls.maxDistance = 700;
    controls.minPolarAngle = 0.15;
    controls.maxPolarAngle = 1.52; // 不低于海面，避免穿到水下
    controls.autoRotate = true; // 慢速自动漂移（DRIFT 可切换）
    controls.autoRotateSpeed = 0.25;

    // ---- 海面 ----
    const oceanGeo = new THREE.PlaneGeometry(4000, 4000, 512, 512);
    oceanGeo.rotateX(-Math.PI / 2); // 置于 XZ 平面，法线朝上
    const oceanMat = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
    oceanMat.positionNode = oceanPositionFn();
    oceanMat.colorNode = oceanColorNode;
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    scene.add(ocean);

    // ---- 天空穹顶（与海面反射共用 skyColor）----
    const skyGeo = new THREE.SphereGeometry(6000, 32, 16);
    const skyMat = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide, depthWrite: false });
    skyMat.colorNode = skyColor(normalize(positionWorld));
    sky = new THREE.Mesh(skyGeo, skyMat);
    sky.renderOrder = -1;
    scene.add(sky);

    // ---- 后期（可选）：Bloom；失败则自动降级为直接渲染 ----
    const useBloom = new URLSearchParams(location.search).get('bloom') !== '0';
    try {
      postProcessing = new THREE.PostProcessing(renderer);
      const scenePass = pass(scene, camera);
      const scenePassColor = scenePass.getTextureNode();
      const bloomPass = bloom(scenePassColor, 0.85, 0.6, 0.0);
      postProcessing.outputNode = scenePassColor.add(bloomPass);
    } catch (e) {
      console.warn('[Ocean] bloom 初始化失败，将使用直接渲染：', e);
      postProcessing = null;
    }

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    console.log('[Ocean] scene setup complete');
    return true;
  } catch (e) {
    showError('场景搭建失败：' + (e && e.message ? e.message : e));
    return false;
  }
}

function onResize() {
  if (!renderer || !camera) return;
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function onVisibility() {
  if (document.hidden) {
    paused = true;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  } else if (paused) {
    paused = false;
    lastFrame = performance.now();
    fpsLast = performance.now();
    frames = 0;
    animate();
  }
}

// ============================================================================
//  渲染循环
// ============================================================================
async function animate() {
  if (paused) return;
  rafId = requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  uTime.value += dt;
  if (autoCycle) {
    uTimeOfDay.value = (uTimeOfDay.value + dt * 0.012) % 1;
    if (todInput) todInput.value = String(uTimeOfDay.value);
    if (todValEl) todValEl.textContent = uTimeOfDay.value.toFixed(3);
  }
  updateSun(uTimeOfDay.value);
  controls.update();
  if (sky) sky.position.copy(camera.position); // 天空始终以相机为中心

  try {
    if (postProcessing) {
      await postProcessing.renderAsync();
    } else {
      renderer.render(scene, camera);
    }
  } catch (e) {
    console.warn('[Ocean] 渲染异常，降级为直接渲染：', e);
    postProcessing = null;
    renderer.render(scene, camera);
  }

  // FPS 统计 + 自适应降级
  frames++;
  if (now - fpsLast >= 500) {
    const fps = Math.round((frames * 1000) / (now - fpsLast));
    if (fpsEl) fpsEl.textContent = fps + ' FPS';
    frames = 0;
    fpsLast = now;
    if (fps < 28 && currentDPR > 1) {
      currentDPR = 1;
      renderer.setPixelRatio(1);
      onResize();
    }
  }
}

// ============================================================================
//  UI 绑定
// ============================================================================
seaInput.addEventListener('input', () => {
  const v = parseFloat(seaInput.value);
  uSeaState.value = v;
  seaValEl.textContent = v.toFixed(2);
});
todInput.addEventListener('input', () => {
  const v = parseFloat(todInput.value);
  uTimeOfDay.value = v;
  todValEl.textContent = v.toFixed(2);
});
driftToggle.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  driftToggle.classList.toggle('on', controls.autoRotate);
});

// ============================================================================
//  父页面控制指令（postMessage）——站点悬浮面板 / 外部脚本
// ============================================================================
window.addEventListener('message', (e) => {
  const d = e.data;
  if (!d || d.type !== 'ocean-control') return;
  if (typeof d.sea === 'number') {
    uSeaState.value = d.sea;
    if (seaInput) seaInput.value = String(d.sea);
    if (seaValEl) seaValEl.textContent = d.sea.toFixed(2);
  }
  if (typeof d.tod === 'number') {
    uTimeOfDay.value = d.tod;
    if (todInput) todInput.value = String(d.tod);
    if (todValEl) todValEl.textContent = d.tod.toFixed(2);
  }
  if (typeof d.drift === 'boolean') {
    controls.autoRotate = d.drift;
    if (driftToggle) driftToggle.classList.toggle('on', d.drift);
  }
  if (typeof d.autoCycle === 'boolean') autoCycle = d.autoCycle;
});

// 键盘快捷键（仅独立页可用）：[ ] 时间 ±0.02；; ' 海况 ±0.05
window.addEventListener('keydown', (e) => {
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  if (e.key === ']') {
    uTimeOfDay.value = Math.min(1, uTimeOfDay.value + 0.02);
    if (todInput) todInput.value = String(uTimeOfDay.value);
    if (todValEl) todValEl.textContent = uTimeOfDay.value.toFixed(3);
  } else if (e.key === '[') {
    uTimeOfDay.value = Math.max(0, uTimeOfDay.value - 0.02);
    if (todInput) todInput.value = String(uTimeOfDay.value);
    if (todValEl) todValEl.textContent = uTimeOfDay.value.toFixed(3);
  } else if (e.key === ';' || e.key === "'") {
    uSeaState.value = Math.min(1, uSeaState.value + 0.05);
    if (seaInput) seaInput.value = String(uSeaState.value);
    if (seaValEl) seaValEl.textContent = uSeaState.value.toFixed(2);
  }
});

// ============================================================================
//  启动
// ============================================================================
(async function main() {
  if (!init()) return;
  try {
    await renderer.init();
  } catch (e) {
    showError('WebGPU 初始化失败：' + (e && e.message ? e.message : e));
    return;
  }
  // 首帧
  try {
    if (postProcessing) {
      await postProcessing.renderAsync();
    } else {
      renderer.render(scene, camera);
    }
  } catch (e) {
    console.warn('[Ocean] 首帧异常，降级为直接渲染：', e);
    postProcessing = null;
    try {
      renderer.render(scene, camera);
    } catch (e2) {
      showError('首帧渲染失败：' + (e2 && e2.message ? e2.message : e2));
      return;
    }
  }

  // 黑屏自检：读取画布像素，平均亮度过低则切换路径或明确报错
  if (isFrameBlack()) {
    console.warn('[Ocean] 首帧检测到黑屏，尝试切换渲染路径');
    if (postProcessing) {
      postProcessing = null;
      renderer.render(scene, camera);
    }
    if (isFrameBlack()) {
      showError('渲染结果为黑屏：当前浏览器/GPU 环境可能无法运行 WebGPU 着色器，已保留静态海洋背景。');
      return;
    }
  }

  console.log('[Ocean] first frame rendered');
  hideLoading();
  if (isBg) driftToggle.classList.add('on');
  // 直接渲染模式：避免 PostProcessing 的异步 renderAsync 在 rAF 循环中阻塞帧统计/时序
  // （bloom 通过 ?bloom=1 单独启用时再切回）
  postProcessing = null;
  // 通知父页面：动态海洋已可显示
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({ type: 'ocean-ready' }, '*');
    } catch (_) {}
  }
  animate();
})();

// 黑屏自检：将 WebGPU 画布缩绘到 2D canvas 读取平均亮度
function isFrameBlack() {
  try {
    const cv = renderer && renderer.domElement;
    if (!cv || !cv.width || !cv.height) return true;
    const c = document.createElement('canvas');
    c.width = 8;
    c.height = 8;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(cv, 0, 0, 8, 8);
    const d = ctx.getImageData(0, 0, 8, 8).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1] + d[i + 2];
    const avg = sum / ((d.length / 4) * 3);
    return avg < 5; // 平均通道亮度 < 5/255 → 全黑
  } catch (e) {
    return false; // 无法读取时不误判
  }
}

// 模块求值完成的标记（最后一行）
window.__oceanMain = 1;
