<script setup>
/**
 * OceanBackground — 程序化 WebGPU 海洋背景 + 站点悬浮控制面板
 * 1. 以全屏 iframe 嵌入 ocean/index.html（?bg=1 隐藏内置控件，仅作漂移背景）
 * 2. 组件自身保留静态海洋兜底图，iframe 默认透明；WebGPU 成功渲染首帧后
 *    postMessage 通知父页面淡入；6 秒未就绪则保持兜底图，避免黑屏
 * 3. 悬浮面板（z-index 高于内容、低于播放器）通过 postMessage 实时控制：
 *    SEA STATE / TIME OF DAY / DRIFT / 昼夜自动循环
 */
import { ref, onMounted, onUnmounted } from 'vue';

const iframe = ref(null);
const ready = ref(false);
const open = ref(false);
const sea = ref(0.6);
const tod = ref(0.3);
const drift = ref(true);
const autoCycle = ref(false);
let timer = null;

function send(payload) {
  const w = iframe.value?.contentWindow;
  if (w) w.postMessage({ type: 'ocean-control', ...payload }, '*');
}
function onSea(e) { sea.value = parseFloat(e.target.value); send({ sea: sea.value }); }
function onTod(e) { tod.value = parseFloat(e.target.value); send({ tod: tod.value }); }
function onDrift() { drift.value = !drift.value; send({ drift: drift.value }); }
function onAuto() { autoCycle.value = !autoCycle.value; send({ autoCycle: autoCycle.value }); }

function onMessage(e) {
  if (e.source !== iframe.value?.contentWindow) return;
  if (e.data?.type === 'ocean-ready') {
    ready.value = true;
    clearTimeout(timer);
    window.removeEventListener('message', onMessage);
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage);
  timer = setTimeout(() => { ready.value = false; }, 6000);
});
onUnmounted(() => {
  window.removeEventListener('message', onMessage);
  clearTimeout(timer);
});
</script>

<template>
  <div class="ocean-background">
    <iframe
      ref="iframe"
      src="/ocean/index.html?bg=1"
      title="Procedural Ocean Background"
      :class="{ ready }"
    ></iframe>
  </div>

  <!-- 悬浮海洋控制面板（独立于背景层，位于站点 UI 之上） -->
  <div v-if="ready" class="ocean-controls">
    <button
      class="oc-toggle"
      :title="open ? '收起海洋设置' : '海洋设置'"
      @click="open = !open"
    >
      <span class="oc-icon">🌊</span>
      <span class="oc-toggle-label">{{ open ? '收起' : '海洋' }}</span>
    </button>

    <div v-if="open" class="oc-panel">
      <div class="oc-title">海洋设置</div>

      <div class="oc-row">
        <label class="oc-label">SEA STATE <span class="oc-val">{{ sea.toFixed(2) }}</span></label>
        <input type="range" min="0" max="1" step="0.01" :value="sea" @input="onSea" />
      </div>

      <div class="oc-row">
        <label class="oc-label">TIME OF DAY <span class="oc-val">{{ tod.toFixed(2) }}</span></label>
        <input type="range" min="0" max="1" step="0.001" :value="tod" @input="onTod" />
      </div>

      <div class="oc-row oc-switch">
        <span>DRIFT 自动漂移</span>
        <button class="oc-toggle-btn" :class="{ on: drift }" @click="onDrift" type="button"></button>
      </div>

      <div class="oc-row oc-switch">
        <span>昼夜自动循环</span>
        <button class="oc-toggle-btn" :class="{ on: autoCycle }" @click="onAuto" type="button"></button>
      </div>

      <div class="oc-tip">开启循环后海面会随时间从清晨渐变到深夜</div>
    </div>
  </div>
</template>

<style scoped>
.ocean-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: #05070d url('/ocean/ocean-fallback.png') center / cover no-repeat;
}

.ocean-background iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  transition: opacity 1.4s ease;
  background: transparent;
}

.ocean-background iframe.ready {
  opacity: 1;
}

/* ===== 悬浮控制面板（左上角） ===== */
.ocean-controls {
  position: fixed;
  left: 18px;
  top: 18px;
  z-index: 120;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  pointer-events: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  user-select: none;
}

.oc-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(15, 22, 38, 0.55);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  color: #eaf3ff;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  transition: all 0.2s;
}
.oc-toggle:hover {
  background: rgba(30, 45, 72, 0.65);
  transform: translateY(-1px);
}
.oc-icon { font-size: 1rem; }

.oc-panel {
  width: 236px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(13, 20, 36, 0.62);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  color: #eaf3ff;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
}

.oc-title {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  opacity: 0.85;
  margin-bottom: 12px;
}

.oc-row { margin-bottom: 13px; }
.oc-row:last-child { margin-bottom: 0; }

.oc-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  opacity: 0.85;
  margin-bottom: 6px;
}
.oc-val {
  font-variant-numeric: tabular-nums;
  color: #7fd4ff;
}

.oc-row input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.16);
  outline: none;
  cursor: pointer;
}
.oc-row input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #7fd4ff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(127, 212, 255, 0.6);
}
.oc-row input[type='range']::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border: none;
  border-radius: 50%;
  background: #7fd4ff;
  cursor: pointer;
}

.oc-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.74rem;
  opacity: 0.9;
}

.oc-toggle-btn {
  position: relative;
  width: 40px;
  height: 21px;
  border-radius: 21px;
  border: none;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  transition: background 0.2s;
}
.oc-toggle-btn::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}
.oc-toggle-btn.on {
  background: rgba(127, 212, 255, 0.6);
}
.oc-toggle-btn.on::after {
  transform: translateX(19px);
}

.oc-tip {
  margin-top: 10px;
  font-size: 0.66rem;
  opacity: 0.5;
  line-height: 1.5;
}
</style>
