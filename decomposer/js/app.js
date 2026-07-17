/**
 * 智能任务拆解 — 前端逻辑
 * API 通信 / DOM 渲染 / localStorage 历史记录
 */

// ═══ 状态 ═══════════════════════════════
const S = {
  subtasks: [],
  originalTask: '',
  loading: false,
  historyId: null,
};

// ═══ DOM 引用 ═══════════════════════════
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const D = {
  input:     $('#taskInput'),
  submitBtn: $('#submitBtn'),
  charHint:  $('#charHint'),
  taskList:  $('#taskList'),
  results:   $('#resultsSection'),
  badge:     $('#resultsBadge'),
  toolbar:   $('#resultsToolbar'),
  skeleton:  $('#skeleton'),
  errorBnr:  $('#errorBanner'),
  errorTxt:  $('#errorText'),
  empty:     $('#emptyState'),
  history:   $('#historyList'),
  statusDot: $('#statusDot'),
  statusLbl: $('#statusLabel'),
  toast:     $('#toastLayer'),
};

// ═══ 主题 ═══════════════════════════════
const THEME_KEY = 'td_theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// ═══ 初始化 ═════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());  // 应用保存的主题
  D.input.addEventListener('input', updateCharCount);
  D.input.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
  });
  checkHealth();
  renderHistory();
});

// ═══ 健康检查 ═══════════════════════════
async function checkHealth() {
  try {
    const r = await fetch('/api/health');
    const d = await r.json();
    if (d.apiConfigured) {
      D.statusDot.className = 'topbar-dot live';
      D.statusLbl.textContent = `SYS_ONLINE · ${d.model}`;
    } else {
      D.statusDot.className = 'topbar-dot dead';
      D.statusLbl.textContent = 'SYS_OFFLINE · 未配置密钥';
    }
  } catch {
    D.statusDot.className = 'topbar-dot dead';
    D.statusLbl.textContent = 'SYS_UNREACHABLE';
  }
}

// ═══ 字符计数 ═══════════════════════════
function updateCharCount() {
  const n = D.input.value.length;
  D.charHint.textContent = `${n} / 2000`;
  D.charHint.className = n > 1800 ? 'char-hint warn' : 'char-hint';
}

// ═══ 提交拆解 ═══════════════════════════
async function handleSubmit() {
  if (S.loading) return;
  const task = D.input.value.trim();

  if (!task)              { toast('请输入任务描述', 'err'); D.input.focus(); return; }
  if (task.length < 2)    { toast('任务描述太短，至少输入2个字符', 'err'); return; }
  if (task.length > 2000) { toast('任务描述过长，最多2000个字符', 'err'); return; }

  setLoading(true);
  hideError();

  try {
    const r = await fetch('/api/decompose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });
    const d = await r.json();
    if (!d.success) throw new Error(d.error || '拆解失败');

    S.subtasks     = d.data.subtasks;
    S.originalTask = d.data.originalTask;
    S.historyId    = Date.now().toString();

    renderTasks();
    saveToHistory(d.data);
    renderHistory();
    toast(`成功拆解为 ${d.data.totalCount} 个子任务`, 'ok');

  } catch (e) {
    showError(e.message);
  } finally {
    setLoading(false);
  }
}

// ═══ 渲染任务列表 ═══════════════════════
function renderTasks() {
  D.empty.style.display    = 'none';
  D.results.style.display  = 'block';
  D.toolbar.style.display  = 'flex';
  D.badge.textContent       = S.subtasks.length;

  D.taskList.innerHTML = S.subtasks.map((t, i) => `
    <div class="task-row" id="row${i}">
      <div class="check-circle" data-act="toggle" data-i="${i}"></div>
      <div class="task-body">
        <div class="task-title">${esc(t.title)}</div>
        <div class="task-desc">${esc(t.description)}</div>
        <input class="edit-title-input" value="${esc(t.title)}" data-i="${i}" data-field="title">
        <textarea class="edit-desc-input" data-i="${i}" data-field="desc" rows="2">${esc(t.description)}</textarea>
        <div class="task-meta">
          <span class="meta-tag ${priTag(t.priority)}">${priLabel(t.priority)}</span>
          <span class="meta-dim">约 ${t.estimatedHours} 小时</span>
          ${t.dependencies?.length ? `<span class="meta-deps">依赖: ${t.dependencies.join(', ')}</span>` : ''}
        </div>
      </div>
      <div class="task-actions">
        <button data-act="edit" data-i="${i}" title="编辑">✎</button>
        <button class="del" data-act="del" data-i="${i}" title="删除">✕</button>
      </div>
    </div>
  `).join('');

  // 事件委托
  D.taskList.onclick = e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const i = +btn.dataset.i;
    if (btn.dataset.act === 'toggle') toggle(i);
    if (btn.dataset.act === 'edit')   toggleEdit(i);
    if (btn.dataset.act === 'del')    del(i);
  };

  D.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══ 任务操作 ═══════════════════════════
function toggle(i) {
  const row  = document.getElementById(`row${i}`);
  const circ = row.querySelector('.check-circle');
  circ.classList.toggle('checked');
  row.classList.toggle('done');
}

function toggleEdit(i) {
  const row = document.getElementById(`row${i}`);
  if (row.classList.contains('editing')) {
    // 保存编辑
    const ti = row.querySelector('.edit-title-input');
    const di = row.querySelector('.edit-desc-input');
    const newTitle = ti.value.trim();
    if (newTitle) {
      S.subtasks[i].title       = newTitle;
      S.subtasks[i].description = di.value.trim() || newTitle;
      row.querySelector('.task-title').textContent = newTitle;
      row.querySelector('.task-desc').textContent  = S.subtasks[i].description;
      updateHistory();
      toast('任务已更新', 'info');
    }
    row.classList.remove('editing');
  } else {
    row.classList.add('editing');
    row.querySelector('.edit-title-input').focus();
  }
}

function del(i) {
  if (!confirm(`确定删除「${S.subtasks[i].title}」吗？`)) return;
  S.subtasks.splice(i, 1);
  if (S.subtasks.length === 0) { clearResults(); return; }
  renderTasks();
  updateHistory();
  toast('任务已删除', 'info');
}

// ═══ 清空结果 ═══════════════════════════
function clearResults() {
  S.subtasks     = [];
  S.originalTask = '';
  S.historyId    = null;
  D.results.style.display  = 'none';
  D.toolbar.style.display  = 'none';
  D.empty.style.display    = '';
  D.input.value = '';
  updateCharCount();
}

// ═══ 加载 / 错误状态 ════════════════════
function setLoading(v) {
  S.loading = v;
  D.skeleton.style.display = v ? '' : 'none';
  D.submitBtn.disabled = v;
  D.submitBtn.textContent = v ? '◈ 拆解中…' : '◈ 执行拆解';
}

function showError(msg) {
  D.errorBnr.style.display = '';
  D.errorTxt.textContent = msg;
}

function hideError() {
  D.errorBnr.style.display = 'none';
}

// ═══ Toast ══════════════════════════════
function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast toast-${type === 'err' ? 'err' : type === 'ok' ? 'ok' : 'info'}`;
  el.textContent = msg;
  D.toast.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; setTimeout(() => el.remove(), 250); }, 3200);
}

// ═══ 历史记录 (localStorage) ════════════
const HK = 'td_history';
const MAX = 20;

function getH() { try { return JSON.parse(localStorage.getItem(HK)) || []; } catch { return []; } }
function setH(v) { localStorage.setItem(HK, JSON.stringify(v)); }

function saveToHistory(data) {
  const h = getH();
  const rec = { id: S.historyId, originalTask: data.originalTask, subtasks: data.subtasks, totalCount: data.totalCount, createdAt: data.createdAt };
  const idx = h.findIndex(x => x.originalTask === data.originalTask);
  if (idx !== -1) h[idx] = rec; else h.unshift(rec);
  if (h.length > MAX) h.length = MAX;
  setH(h);
}

function updateHistory() {
  const h = getH();
  const idx = h.findIndex(x => x.id === S.historyId);
  if (idx !== -1) { h[idx].subtasks = S.subtasks; h[idx].totalCount = S.subtasks.length; setH(h); }
}

function renderHistory() {
  const h = getH();
  if (!h.length) {
    D.history.innerHTML = '<div class="sidebar-empty">暂无历史记录<br>拆解后的任务会显示在这里</div>';
    return;
  }
  D.history.innerHTML = h.map(x => `
    <div class="history-entry" onclick="loadHistory('${x.id}')">
      <div class="history-entry-title">${esc(x.originalTask)}</div>
      <div class="history-entry-foot">
        <span>${x.totalCount} 个子任务</span>
        <span>${fmt(x.createdAt)}</span>
      </div>
    </div>
  `).join('');
}

function loadHistory(id) {
  const rec = getH().find(x => x.id === id);
  if (!rec) return;
  S.subtasks = rec.subtasks; S.originalTask = rec.originalTask; S.historyId = rec.id;
  D.input.value = rec.originalTask; updateCharCount();
  renderTasks(); hideError(); toast('已加载历史记录', 'info');
}

function clearHistory() {
  if (!confirm('确定清空所有历史记录吗？')) return;
  localStorage.removeItem(HK);
  renderHistory();
  toast('历史记录已清空', 'info');
}

// ═══ 导出 ═══════════════════════════════
function exportMarkdown() {
  if (!S.subtasks.length) { toast('没有可导出的任务', 'err'); return; }
  let md = `# 任务拆解结果\n\n**目标：** ${S.originalTask}\n\n---\n\n`;
  S.subtasks.forEach((t, i) => {
    const done = document.getElementById(`row${i}`)?.querySelector('.check-circle')?.classList.contains('checked');
    md += `- [${done ? 'x' : ' '}] **${t.title}**（${priLabel(t.priority)}，约 ${t.estimatedHours}h）\n  ${t.description}\n`;
    if (t.dependencies?.length) md += `  ⤷ 依赖: ${t.dependencies.join(', ')}\n`;
    md += '\n';
  });
  download(`任务拆解_${Date.now()}.md`, md, 'text/markdown');
  toast('Markdown 导出成功', 'ok');
}

function exportJSON() {
  if (!S.subtasks.length) { toast('没有可导出的任务', 'err'); return; }
  download(`任务拆解_${Date.now()}.json`, JSON.stringify({ originalTask: S.originalTask, createdAt: new Date().toISOString(), subtasks: S.subtasks }, null, 2), 'application/json');
  toast('JSON 导出成功', 'ok');
}

function download(name, content, mime) {
  const b = new Blob([content], { type: mime });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a'); a.href = u; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u);
}

// ═══ 工具函数 ═══════════════════════════
function fillExample(text) { D.input.value = text; updateCharCount(); D.input.focus(); }

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function priTag(p) { return p === 'high' ? 'tag-p1' : p === 'medium' ? 'tag-p2' : 'tag-p3'; }
function priLabel(p) { return p === 'high' ? '高优先级' : p === 'medium' ? '中优先级' : '低优先级'; }

function fmt(iso) {
  if (!iso) return '';
  const d = new Date(iso), n = new Date(), diff = n - d;
  if (diff < 6e4) return '刚刚';
  if (diff < 36e5) return `${Math.floor(diff/6e4)} 分钟前`;
  if (diff < 864e5) return `${Math.floor(diff/36e5)} 小时前`;
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
