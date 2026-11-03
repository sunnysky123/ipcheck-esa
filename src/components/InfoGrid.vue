<script setup>
import { computed, ref } from 'vue'
import { copyText } from '../utils/clipboard'
import { parseUA } from '../utils/ua'

const props = defineProps({
  data: { type: Object, required: true },
  accessLabel: { type: String, default: '—' },
})

const locationText = computed(() =>
  [props.data.country, props.data.region, props.data.city].filter(Boolean).join(' · ') || '—'
)

const ua = computed(() => parseUA(props.data.userAgent))

const versionTone = computed(() => (props.data.version === 'IPv6' ? 'v6' : 'v4'))

const copied = ref(false)
let copyTimer = null
async function copyIp() {
  const ip = props.data.ip
  if (!ip) return
  if (await copyText(ip)) {
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1600)
  }
}
</script>

<template>
  <section class="grid">
    <!-- 公网 IP -->
    <div class="cell" style="animation-delay: 0.05s; --tone: var(--accent); --tone-bg: rgba(91, 140, 255, 0.13)">
      <div class="cell-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.8 2.6 4.2 5.3 4.2 8.5s-1.4 5.9-4.2 8.5c-2.8-2.6-4.2-5.3-4.2-8.5S9.2 6.1 12 3.5z" />
        </svg>
      </div>
      <div class="cell-body">
        <div class="cell-label">公网 IP</div>
        <div class="ip-line">
          <code class="ip">{{ data.ip || '—' }}</code>
          <button v-if="data.ip" class="btn-copy" @click="copyIp">
            <svg v-if="copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 12.6 10 17l8.5-9.6" /></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5.5 15h-.7A1.8 1.8 0 0 1 3 13.2V4.8A1.8 1.8 0 0 1 4.8 3h8.4A1.8 1.8 0 0 1 15 4.8v.7" /></svg>
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
      </div>
    </div>

    <!-- IP 协议版本 -->
    <div class="cell" style="animation-delay: 0.1s; --tone: var(--accent-2); --tone-bg: rgba(139, 92, 246, 0.13)">
      <div class="cell-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <rect x="7" y="7" width="10" height="10" rx="2.5" />
          <path d="M10.2 7V4.4M13.8 7V4.4M10.2 19.6V17M13.8 19.6V17M7 10.2H4.4M7 13.8H4.4M19.6 10.2H17M19.6 13.8H17" />
        </svg>
      </div>
      <div class="cell-body">
        <div class="cell-label">IP 协议版本</div>
        <span v-if="data.version" class="family" :class="versionTone">{{ data.version }}</span>
        <div v-else class="cell-value">—</div>
      </div>
    </div>

    <!-- 运营商 -->
    <div class="cell" style="animation-delay: 0.15s; --tone: var(--ok); --tone-bg: rgba(52, 211, 153, 0.13)">
      <div class="cell-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="9" r="2.4" />
          <path d="M8.5 5.8a5 5 0 0 0 0 6.4M15.5 5.8a5 5 0 0 1 0 6.4M6 3.4a8.6 8.6 0 0 0 0 11.2M18 3.4a8.6 8.6 0 0 1 0 11.2M12 11.5V20.5" />
        </svg>
      </div>
      <div class="cell-body">
        <div class="cell-label">运营商</div>
        <div class="cell-value">{{ data.isp || '—' }}</div>
      </div>
    </div>

    <!-- 地理位置 -->
    <div class="cell" style="animation-delay: 0.2s; --tone: #f59e0b; --tone-bg: rgba(245, 158, 11, 0.13)">
      <div class="cell-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21s-6.5-5.4-6.5-10a6.5 6.5 0 0 1 13 0c0 4.6-6.5 10-6.5 10z" />
          <circle cx="12" cy="10.6" r="2.3" />
        </svg>
      </div>
      <div class="cell-body">
        <div class="cell-label">地理位置</div>
        <div class="cell-value">{{ locationText }}</div>
      </div>
    </div>

    <!-- 接入网络 -->
    <div class="cell" style="animation-delay: 0.25s; --tone: #22d3ee; --tone-bg: rgba(34, 211, 238, 0.13)">
      <div class="cell-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4.5 9.6a11.5 11.5 0 0 1 15 0M7 12.6a7.6 7.6 0 0 1 10 0M9.6 15.6a3.9 3.9 0 0 1 4.8 0" />
          <circle cx="12" cy="18.3" r="1" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div class="cell-body">
        <div class="cell-label">接入网络</div>
        <div class="cell-value">{{ accessLabel }}</div>
        <div v-if="data.ms > 0" class="cell-sub">边缘节点响应 {{ data.ms }} ms</div>
      </div>
    </div>

    <!-- 浏览器环境 -->
    <div class="cell" style="animation-delay: 0.3s; --tone: #f472b6; --tone-bg: rgba(244, 114, 182, 0.13)">
      <div class="cell-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3.5" y="5" width="17" height="11" rx="2.2" />
          <path d="M9 19.5h6M12 16v3.5" />
        </svg>
      </div>
      <div class="cell-body">
        <div class="cell-label">浏览器环境</div>
        <div class="cell-value">{{ ua.browser }}</div>
        <div class="cell-sub">{{ ua.os }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
@media (min-width: 760px) {
  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.cell {
  min-width: 0;
  display: flex;
  gap: 13px;
  align-items: flex-start;
  padding: 16px 17px;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  animation: fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.cell:hover {
  border-color: var(--border-strong);
  background: var(--surface-2);
  transform: translateY(-2px);
}

.cell-icon {
  width: 34px;
  height: 34px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: var(--tone, var(--accent));
  background: var(--tone-bg, rgba(91, 140, 255, 0.13));
}
.cell-icon svg { width: 19px; height: 19px; }

.cell-body { min-width: 0; padding-top: 1px; }
.cell-label {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 7px;
}
.cell-value {
  font-size: 14.5px;
  line-height: 1.45;
  color: var(--text-1);
  word-break: break-word;
}
.cell-sub {
  margin-top: 3px;
  font-size: 12px;
  color: var(--text-3);
}

.ip-line {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
}
.ip {
  font: 600 14px/1.4 var(--font-mono);
  color: var(--ip);
  word-break: break-all;
}
.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font: 500 11.5px/1 var(--font-sans);
  color: var(--text-2);
  background: transparent;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.18s, border-color 0.18s;
}
.btn-copy:hover { color: var(--text-1); border-color: var(--border-strong); }
.btn-copy svg { width: 12px; height: 12px; }

.family {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font: 600 12.5px/1 var(--font-mono);
  border-radius: 999px;
}
.family.v6 {
  color: var(--ok);
  background: var(--ok-soft);
  box-shadow: inset 0 0 0 1px rgba(52, 211, 153, 0.35);
}
.family.v4 {
  color: var(--v4);
  background: rgba(91, 140, 255, 0.13);
  box-shadow: inset 0 0 0 1px rgba(91, 140, 255, 0.35);
}
</style>
