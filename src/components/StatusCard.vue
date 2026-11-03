<script setup>
import { computed } from 'vue'

const props = defineProps({
  phase: { type: String, default: 'loading' },
  verdict: { type: String, default: 'unknown' },
  errorText: { type: String, default: '' },
})

defineEmits(['refresh'])

const CONTENT = {
  supported: {
    tone: 'ok',
    icon: 'check',
    title: '你的网络已支持 IPv6',
    desc: '本次访问经 IPv6 通道完成,你的网络可以通过 IPv6 正常访问本站。',
  },
  unsupported: {
    tone: 'warn',
    icon: 'slash',
    title: '你的网络暂未启用 IPv6',
    desc: '本次访问经 IPv4 通道完成,浏览器未选中 IPv6 优先访问本站。',
  },
  unknown: {
    tone: 'neutral',
    icon: 'quest',
    title: '暂时无法判定',
    desc: '未能获取本次访问使用的 IP 族,建议稍后点击「重测」再试一次。',
  },
}

const content = computed(() => {
  if (props.phase === 'loading') {
    return {
      tone: 'neutral',
      icon: 'quest',
      title: '正在检测网络环境…',
      desc: '正在请求边缘节点信息,以确定本次访问使用的 IP 族。',
    }
  }
  if (props.phase === 'error') {
    return {
      tone: 'neutral',
      icon: 'quest',
      title: '检测服务暂时不可用',
      desc: props.errorText || '请检查网络连接后点击「重测」。',
    }
  }
  return CONTENT[props.verdict] ?? CONTENT.unknown
})
</script>

<template>
  <section class="card status-card">
    <button
      class="btn-ghost btn-refresh"
      :disabled="phase === 'loading'"
      @click="$emit('refresh')"
    >
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 12a8 8 0 1 1-2.4-5.7M20 4.5V10h-5.5" />
      </svg>
      重测
    </button>

    <div class="orb-shell">
      <div v-if="phase === 'loading'" class="ring" aria-hidden="true"></div>
      <div class="orb" :class="`is-${content.tone}`">
        <svg v-if="content.icon === 'check'" class="ico-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5.5 12.6 10 17l8.5-9.6" />
        </svg>
        <svg v-else-if="content.icon === 'slash'" class="ico-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="8.6" />
          <path d="M6.8 6.8l10.4 10.4" />
        </svg>
        <span v-else class="orb-q">?</span>
      </div>
    </div>

    <h2 class="verdict-title">{{ content.title }}</h2>
    <p class="verdict-desc">{{ content.desc }}</p>
  </section>
</template>

<style scoped>
.status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 46px 24px 30px;
}
.status-card:has(.btn-refresh) { padding-right: 24px; }

.btn-refresh {
  position: absolute;
  top: 16px;
  right: 16px;
}
.btn-refresh .ico { width: 14px; height: 14px; }

.orb-shell {
  position: relative;
  width: 104px;
  height: 104px;
}
.ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0deg 40deg, var(--accent) 120deg, transparent 190deg);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px));
  animation: spin 1.1s linear infinite;
  opacity: 0.9;
}

.orb {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text-2);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03));
  box-shadow: inset 0 0 0 1px var(--border);
}
.orb.is-ok {
  color: var(--ok);
  background: linear-gradient(145deg, rgba(52, 211, 153, 0.26), rgba(16, 185, 129, 0.07));
  box-shadow: inset 0 0 0 1px rgba(52, 211, 153, 0.45), 0 14px 46px -10px rgba(16, 185, 129, 0.4);
}
.orb.is-warn {
  color: var(--warn);
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.22), rgba(217, 119, 6, 0.06));
  box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.4), 0 14px 46px -10px rgba(245, 158, 11, 0.35);
}
.ico-lg { width: 46px; height: 46px; }
.orb-q {
  font: 700 40px/1 var(--font-mono);
  opacity: 0.75;
}

.verdict-title {
  margin-top: 6px;
  font-size: clamp(21px, 3.6vw, 26px);
  font-weight: 700;
  letter-spacing: 0.3px;
}
.verdict-desc {
  max-width: 46ch;
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-2);
}
</style>
