<script setup>
/**
 * SplashScreen — 自成岛风格登录界面
 */
import { ref, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'SplashScreen' })
const emit = defineEmits(['enter'])

const leaving = ref(false)
let timer = null

function handleLogin() {
  leaving.value = true
  setTimeout(() => emit('enter'), 600)
}

onMounted(() => {
  const tabs = document.querySelectorAll('.login-tab')
  const secPw = document.getElementById('section-password')
  const secSms = document.getElementById('section-sms')
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'))
    t.classList.add('active')
    const tg = t.dataset.tab
    secPw.classList.toggle('active', tg === 'password')
    secSms.classList.toggle('active', tg === 'sms')
  }))

  const toast = document.getElementById('toast')
  let tt
  function toastMsg(msg) {
    clearTimeout(tt)
    toast.textContent = msg
    toast.classList.add('show')
    tt = setTimeout(() => toast.classList.remove('show'), 2400)
  }

  const phone = document.getElementById('phoneInput')
  const pass = document.getElementById('passInput')
  const btnPw = document.getElementById('submitPassword')
  const phoneSms = document.getElementById('phoneInputSms')
  const code = document.getElementById('codeInput')
  const sendBtn = document.getElementById('sendCodeBtn')
  const btnSms = document.getElementById('submitSms')

  let secs = 0
  function vPhone(p) { return /^1[3-9]\d{9}$/.test(p) }

  btnPw.addEventListener('click', () => {
    const p = phone.value.trim(), pw = pass.value.trim()
    if (!p) return toastMsg('请输入手机号')
    if (!vPhone(p)) return toastMsg('请输入正确的手机号')
    if (!pw || pw.length < 6) return toastMsg('密码至少6位')
    btnPw.classList.add('loading')
    setTimeout(() => {
      btnPw.classList.remove('loading')
      toastMsg('欢迎回来 ✦')
      setTimeout(() => handleLogin(), 800)
    }, 1200)
  })

  sendBtn.addEventListener('click', () => {
    const p = phoneSms.value.trim()
    if (!p || !vPhone(p)) return toastMsg('请输入正确的手机号')
    if (timer) return
    secs = 60; sendBtn.classList.add('counting'); sendBtn.textContent = `${secs}s`
    timer = setInterval(() => {
      secs--
      if (secs <= 0) { clearInterval(timer); timer = null; sendBtn.classList.remove('counting'); sendBtn.textContent = '获取验证码' }
      else sendBtn.textContent = `${secs}s`
    }, 1000)
    toastMsg('验证码已发送')
  })

  btnSms.addEventListener('click', () => {
    const p = phoneSms.value.trim(), cd = code.value.trim()
    if (!p || !vPhone(p) || !cd || cd.length < 4) return toastMsg('请完善信息')
    btnSms.classList.add('loading')
    setTimeout(() => {
      btnSms.classList.remove('loading')
      toastMsg('欢迎回来 ✦')
      setTimeout(() => handleLogin(), 800)
    }, 1200)
  })

  document.getElementById('registerLink')?.addEventListener('click', () => toastMsg('注册功能即将开放'))
  document.getElementById('forgotLink')?.addEventListener('click', () => toastMsg('找回密码功能即将开放'))

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (secPw?.classList.contains('active')) btnPw?.click()
      else btnSms?.click()
    }
  })
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="splash-overlay" :class="{ leaving }">
    <div class="clouds-distant">
      <div class="dcloud" /><div class="dcloud" /><div class="dcloud" />
    </div>

    <!-- Logo 巨幅居中弹入 -->
    <div class="page-logo">
      <div class="logo-main">自成岛</div>
      <div class="logo-sub">构建独属于自己的成长小岛，收纳旅行、美食、爱好、学习</div>
      <div class="logo-en">ZICHENG ISLAND</div>
    </div>

    <!-- Login Card -->
    <div class="overlay">
      <div class="login-card">
        <div class="quest-tag"><span class="tag-line"></span>新的旅程<span class="tag-line"></span></div>
        <div class="quest-title">登岛 · 开始探索</div>
        <div class="quest-subtitle">在自成岛，收藏每一段慢慢生长的自己</div>

        <div class="login-tabs">
          <button class="login-tab active" data-tab="password">密码登录</button>
          <button class="login-tab" data-tab="sms">验证码登录</button>
        </div>

        <div class="form-section active" id="section-password">
          <div class="input-group">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
            <input type="tel" class="form-input" id="phoneInput" placeholder="手机号" maxlength="11" autocomplete="tel">
          </div>
          <div class="input-group">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1.5"/></svg>
            <input type="password" class="form-input" id="passInput" placeholder="密码" autocomplete="current-password">
          </div>
          <button class="submit-btn" id="submitPassword"><span class="btn-text">开 始 探 索</span><span class="btn-loader"><span class="dot-spinner"></span></span></button>
        </div>

        <div class="form-section" id="section-sms">
          <div class="input-group">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
            <input type="tel" class="form-input" id="phoneInputSms" placeholder="手机号" maxlength="11" autocomplete="tel">
          </div>
          <div class="sms-row">
            <div class="input-group"><input type="text" class="form-input" id="codeInput" placeholder="验证码" maxlength="6" autocomplete="off"></div>
            <button class="sms-btn" id="sendCodeBtn">获取验证码</button>
          </div>
          <button class="submit-btn" id="submitSms"><span class="btn-text">开 始 探 索</span><span class="btn-loader"><span class="dot-spinner"></span></span></button>
        </div>

        <div class="form-footer">
          <a id="registerLink">注册账号</a>
          <span class="divider"></span>
          <a id="forgotLink">忘记密码</a>
        </div>
      </div>
    </div>

    <div class="page-footer">© 2026 自成岛 · 收藏每一段慢慢生长的自己</div>
    <div class="toast" id="toast"></div>
  </div>
</template>

<style scoped>
.splash-overlay {
  position: fixed; inset: 0; z-index: 9999;
  overflow: hidden;
  transition: opacity 0.6s ease;
  font-family: 'PingFang SC','Hiragino Sans GB','Microsoft YaHei',system-ui,-apple-system,sans-serif;
  color: #3d3832;
}
.splash-overlay.leaving { opacity: 0; pointer-events: none; }

.bg-light, .bg-light2 { display: none; }

.clouds-distant { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
.dcloud { position: absolute; border-radius: 50%; filter: blur(30px); background: rgba(255,255,255,0.5); animation: dcloudDrift var(--dcd, 70s) linear infinite; }
.dcloud:nth-child(1) { width: 300px; height: 60px; top: 8%; left: -10%; --dcd: 65s; }
.dcloud:nth-child(2) { width: 250px; height: 50px; top: 14%; left: 55%; --dcd: 55s; animation-delay: -20s; }
.dcloud:nth-child(3) { width: 280px; height: 55px; top: 5%; left: 80%; --dcd: 60s; animation-delay: -35s; }
@keyframes dcloudDrift { from { transform: translateX(0); } to { transform: translateX(calc(110vw + 400px)); } }

/* Logo — 居中 */
.page-logo {
  position: fixed;
  top: 36%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  pointer-events: none;
  animation: logoBounceIn 0.9s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.page-logo .logo-main {
  font-family: 'Noto Serif SC','Source Han Serif SC',serif;
  font-size: 8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1;
  color: #3d3832;
  text-shadow: 0 4px 40px rgba(255,255,255,0.5), 0 2px 60px rgba(200,180,160,0.2);
}
.page-logo .logo-sub {
  font-size: 1rem;
  letter-spacing: 0.06em;
  color: #8a8078;
  margin-top: 16px;
  font-weight: 400;
  line-height: 1.6;
  animation: fadeUp 0.6s 0.6s ease both;
}
.page-logo .logo-en {
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  color: #b8b0a6;
  margin-top: 16px;
  opacity: 0.6;
}
@keyframes logoBounceIn {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
  50% { transform: translate(-50%, -50%) scale(1.08); }
  80% { transform: translate(-50%, -50%) scale(0.96); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Login Card — 右侧居中 */
.overlay { position: fixed; inset: 0; z-index: 10; display: flex; align-items: center; justify-content: flex-end; padding-right: max(5vw, 30px); pointer-events: none; }
.login-card {
  pointer-events: auto; width: 380px;
  background: rgba(255,255,255,0.78); backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(200,190,175,0.4); border-radius: 16px;
  padding: 36px 32px 30px;
  box-shadow: 0 2px 24px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.5);
  animation: cardIn 0.8s 0.15s cubic-bezier(0.22,0.61,0.36,1) both;
}
@keyframes cardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.login-card::before { content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 1px; background: linear-gradient(90deg, transparent, #c4a882, transparent); opacity: 0.5; }
.quest-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 0.66rem; letter-spacing: 0.12em; color: #a08058; margin-bottom: 10px; }
.quest-tag .tag-line { width: 16px; height: 1px; background: #c4a882; opacity: 0.6; }
.quest-title { font-family: 'Noto Serif SC',serif; font-size: 1.5rem; font-weight: 500; letter-spacing: 0.06em; color: #3d3832; margin-bottom: 3px; }
.quest-subtitle { font-size: 0.74rem; color: #787268; letter-spacing: 0.04em; }

.login-tabs { display: flex; gap: 0; margin-bottom: 22px; border-bottom: 1px solid rgba(200,190,175,0.3); }
.login-tab { flex: 1; text-align: center; padding: 10px 0; font-size: 0.78rem; color: #787268; cursor: pointer; background: none; border: none; position: relative; letter-spacing: 0.05em; font-family: inherit; transition: color 0.3s; }
.login-tab.active { color: #3d3832; font-weight: 500; }
.login-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%); width: 40px; height: 2px; border-radius: 1px; background: #c4a882; }

.form-section { display: none; }
.form-section.active { display: block; animation: secIn 0.3s ease; }
@keyframes secIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.input-group { position: relative; margin-bottom: 14px; transition: transform 0.25s ease; }
.input-group:hover { transform: translateY(-1px); }
.input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; opacity: 0.28; pointer-events: none; color: #a08058; }
.input-group:focus-within .input-icon { opacity: 0.5; }
.form-input { width: 100%; height: 46px; padding: 0 12px 0 40px; border: 1px solid rgba(200,190,175,0.45); border-radius: 8px; background: rgba(255,255,255,0.65); font-size: 0.84rem; font-family: inherit; color: #3d3832; outline: none; transition: all 0.3s ease; box-sizing: border-box; }
.form-input::placeholder { color: rgba(170,160,148,0.5); }
.form-input:focus { border-color: rgba(180,150,120,0.5); box-shadow: 0 0 0 3px rgba(200,170,140,0.08); background: rgba(255,255,255,0.9); }
.sms-row { display: flex; gap: 8px; }
.sms-row .input-group { flex: 1; }
.sms-row .form-input { padding-left: 12px; }
.sms-btn { flex-shrink: 0; height: 46px; padding: 0 14px; border: 1px solid rgba(200,180,160,0.35); border-radius: 8px; background: rgba(250,245,238,0.7); color: #a08058; font-size: 0.72rem; cursor: pointer; font-family: inherit; letter-spacing: 0.04em; transition: all 0.3s; white-space: nowrap; }
.sms-btn:hover { background: rgba(240,230,215,0.8); border-color: rgba(180,150,120,0.5); }
.sms-btn.counting { color: #a8a098; border-color: rgba(200,190,175,0.2); pointer-events: none; }
.submit-btn { width: 100%; height: 48px; border: none; border-radius: 8px; background: linear-gradient(135deg, #b89870 0%, #c8ad85 40%, #d4bf9a 70%, #c8ad85 100%); background-size: 200% 100%; color: #fff; font-size: 0.88rem; font-weight: 500; font-family: inherit; letter-spacing: 0.1em; cursor: pointer; position: relative; overflow: hidden; transition: all 0.4s ease; margin-top: 6px; }
.submit-btn:hover { background-position: 100% 0; box-shadow: 0 6px 24px rgba(170,140,110,0.3); transform: translateY(-1px); }
.submit-btn:active { transform: scale(0.98); }
.submit-btn.loading { pointer-events: none; opacity: 0.7; }
.submit-btn .btn-text { transition: opacity 0.3s; }
.submit-btn .btn-loader { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; }
.submit-btn.loading .btn-text { opacity: 0; }
.submit-btn.loading .btn-loader { opacity: 1; }
.dot-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.form-footer { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 18px; font-size: 0.72rem; }
.form-footer a { color: #787268; text-decoration: none; letter-spacing: 0.04em; cursor: pointer; transition: color 0.3s; }
.form-footer a:hover { color: #a08058; }
.form-footer .divider { width: 1px; height: 9px; background: rgba(200,190,175,0.35); }

.toast { position: fixed; top: 26px; left: 50%; transform: translateX(-50%) translateY(-120px); z-index: 999; padding: 11px 26px; border-radius: 20px; background: rgba(60,52,44,0.9); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.12); color: #f5f0e8; font-size: 0.76rem; letter-spacing: 0.05em; pointer-events: none; font-family: inherit; transition: transform 0.4s cubic-bezier(0.22,0.61,0.36,1); }
.toast.show { transform: translateX(-50%) translateY(0); }

.page-footer { position: fixed; bottom: 14px; left: 50%; transform: translateX(-50%); z-index: 10; font-size: 0.62rem; color: #a8a098; letter-spacing: 0.06em; pointer-events: none; }

@media (max-width: 900px) {
  .page-logo { top: 30%; }
  .page-logo .logo-main { font-size: 4.5rem; }
  .page-logo .logo-sub { font-size: 0.85rem; }
  .overlay { justify-content: center; align-items: flex-end; padding-right: 0; padding-bottom: 4%; }
  .login-card { width: 90vw; max-width: 360px; padding: 28px 22px 24px; }
}
@media (max-width: 520px) {
  .page-logo { top: 25%; }
  .page-logo .logo-main { font-size: 2.8rem; }
  .page-logo .logo-sub { font-size: 0.7rem; margin-top: 10px; }
  .page-logo .logo-en { font-size: 0.55rem; margin-top: 10px; }
  .overlay { padding-bottom: 6%; }
  .login-card { width: 90vw; padding: 22px 16px 20px; }
}
</style>
