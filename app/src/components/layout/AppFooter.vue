<script setup>
/**
 * AppFooter - 页脚
 */
defineOptions({ name: 'AppFooter' })

const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <p class="footer-text">
        🌿 自成岛 · 让每一天都更美好
      </p>
      <p class="footer-copy">
        © {{ year }} Life Hub · 数据来自
        <a href="https://www.themealdb.com/" target="_blank" rel="noopener">TheMealDB</a>、
        <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>、
        <a href="https://restcountries.com/" target="_blank" rel="noopener">RestCountries</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: var(--space-2xl);
  padding: var(--space-xl) 0;
  border-top: 1px solid var(--glass-border-soft);
  background: rgba(5, 8, 22, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.footer-inner {
  text-align: center;
}

.footer-text {
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
}

.footer-copy {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.footer-copy a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.footer-copy a:hover {
  color: var(--text-primary);
  text-decoration: underline;
}
</style>
