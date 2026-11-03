import { reactive, ref } from 'vue'

const API_TIMEOUT = 8000

/** 统一提供超时能力的 fetch,避免接口异常时页面长时间挂起 */
function fetchWithTimeout(url, ms) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(new Error('timeout')), ms)
  return fetch(url, { signal: ctrl.signal, cache: 'no-store' })
    .finally(() => clearTimeout(timer))
}

function detectVersion(ip = '') {
  if (ip.includes(':')) return 'IPv6'
  if (ip.includes('.')) return 'IPv4'
  return ''
}

export function useIpCheck() {
  /** loading | ready | error */
  const phase = ref('loading')
  const errorText = ref('')
  /** supported | unsupported | unknown */
  const verdict = ref('unknown')

  const server = reactive({
    ip: '',
    version: '',
    userAgent: '',
    isp: '',
    country: '',
    region: '',
    city: '',
    ms: 0,
  })

  function resetServer() {
    Object.assign(server, { ip: '', version: '', userAgent: '', isp: '', country: '', region: '', city: '', ms: 0 })
  }

  /**
   * 判定依据是边缘节点接收到的请求所使用的 IP 族:
   * 该族即浏览器为访问本站实际选中的传输通道。
   * - IPv6 应答 → 支持;IPv4 应答 → 暂未启用;未知 → 无法判定
   */
  function computeVerdict() {
    if (server.version === 'IPv6') verdict.value = 'supported'
    else if (server.version === 'IPv4') verdict.value = 'unsupported'
    else verdict.value = 'unknown'
  }

  async function load() {
    resetServer()
    phase.value = 'loading'
    errorText.value = ''

    const started = performance.now()
    try {
      const res = await fetchWithTimeout('/api/getip', API_TIMEOUT)
      if (!res.ok) throw new Error(`接口响应异常 (${res.status})`)
      const data = await res.json()
      // 兼容新版结构 client/geo 与旧版扁平结构
      const cli = data.client ?? data
      const geo = data.geo ?? data
      server.ip = cli.ip ?? ''
      server.version = cli.version ?? detectVersion(server.ip)
      server.userAgent = cli.userAgent ?? ''
      server.country = geo.country ?? geo.country_en ?? ''
      server.region = geo.region ?? geo.region_en ?? ''
      server.city = geo.city ?? geo.city_en ?? ''
      server.isp = geo.isp ?? ''
      server.ms = Math.round(performance.now() - started)
      phase.value = 'ready'
    } catch (err) {
      phase.value = 'error'
      errorText.value = err?.name === 'AbortError' || err?.message === 'timeout'
        ? '检测超时,请检查网络后重试'
        : (err?.message || '无法连接检测服务')
    }
    computeVerdict()
  }

  return { phase, errorText, verdict, server, load }
}
