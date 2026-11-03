<script setup>
import { computed, onMounted } from 'vue'
import StatusCard from './components/StatusCard.vue'
import InfoGrid from './components/InfoGrid.vue'
import { useIpCheck } from './composables/useIpCheck'
import { useTheme } from './composables/useTheme'

const { phase, errorText, verdict, server, load } = useIpCheck()
const { theme, toggle } = useTheme()

onMounted(load)

const accessLabel = computed(() => {
  if (server.version === 'IPv6') return 'IPv6 优先'
  if (server.version === 'IPv4') return 'IPv4 优先'
  return '—'
})
</script>

<template>
  <div class="page">
    <header class="hero">
      <div class="brand">
        <span class="brand-mark">v6</span>
        <div class="brand-text">
          <h1>IPv6 连通性检测</h1>
          <p>检测你的网络对 IPv6 的支持情况,并展示公网 IP 与归属信息</p>
        </div>
      </div>
      <button
        class="icon-btn theme-btn"
        :title="theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
        @click="toggle"
      >
        <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z" />
        </svg>
      </button>
    </header>

    <main>
      <StatusCard
        :phase="phase"
        :verdict="verdict"
        :error-text="errorText"
        @refresh="load"
      />
      <InfoGrid v-if="phase !== 'loading'" :data="server" :access-label="accessLabel" />
    </main>

    <footer class="foot">
      <p>数据仅用于本次展示,不做任何存储</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  max-width: 880px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: clamp(30px, 6vw, 58px) 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.theme-btn { flex: none; }
.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}
.brand-mark {
  width: 54px;
  height: 54px;
  flex: none;
  display: grid;
  place-items: center;
  font: 700 17px/1 var(--font-mono);
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-radius: 15px;
  box-shadow: 0 12px 32px -10px rgba(91, 140, 255, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}
.brand-text h1 {
  font-size: clamp(21px, 3.6vw, 27px);
  font-weight: 700;
  letter-spacing: 0.4px;
}
.brand-text p {
  margin-top: 6px;
  font-size: 13.5px;
  color: var(--text-2);
}

main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.foot {
  margin-top: auto;
  padding-top: 10px;
  text-align: center;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-3);
}
</style>
