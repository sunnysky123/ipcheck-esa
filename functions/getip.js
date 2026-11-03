/**
 * 阿里云 ESA 边缘函数:GET /api/getip
 *
 * 返回客户端 IP、协议版本、User-Agent 与 Geo 地理信息,供前端检测页展示。
 * 入口格式与 ESA Pages 对接,静态资源(dist/)优先命中,未命中的请求进入本函数。
 * 相关文档:https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/api-documentation/
 */

/** 根据 IP 字面量粗略判定协议版本 */
function detectVersion(ip = '') {
  if (ip.includes(':')) return 'IPv6'
  if (ip.includes('.')) return 'IPv4'
  return ''
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,OPTIONS',
      'access-control-allow-headers': '*',
      'cache-control': 'no-store',
    },
  })
}

export default {
  async fetch(request) {
    /* CORS 预检 */
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*' } })
    }

    const url = new URL(request.url)
    if (url.pathname !== '/api/getip') {
      return jsonResponse({ ok: false, error: 'Not Found' }, 404)
    }
    if (request.method !== 'GET') {
      return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405)
    }

    /**
     * ESA 在 request.info 上注入客户端信息(非标准 Request 属性):
     * remote_addr / ip_country_en / ip_region_en / ip_city_en / ip_isp_en 等。
     */
    const info = request.info ?? {}
    const clientIp = info.remote_addr ?? ''

    const data = {
      ok: true,
      client: {
        ip: clientIp,
        version: detectVersion(clientIp),
        userAgent: request.headers?.get?.('user-agent') ?? '',
      },
      geo: {
        country: info.ip_country_en ?? '',
        region: info.ip_region_en ?? '',
        city: info.ip_city_en ?? '',
        isp: info.ip_isp_en ?? '',
      },
      serverTime: new Date().toISOString(),
    }

    return jsonResponse(data)
  },
}
