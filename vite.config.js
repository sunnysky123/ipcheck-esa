import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 本地开发模拟边缘函数:替换部署后由阿里云 ESA 函数承接的 /api/getip 接口,
 * 让 `npm run dev` 无需 ESA 运行环境即可调试页面。
 */
function edgeFunctionMock() {
  return {
    name: 'edge-function-mock',
    configureServer(server) {
      server.middlewares.use('/api/getip', (req, res) => {
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.setHeader('cache-control', 'no-store')
        res.end(JSON.stringify({
          ok: true,
          client: {
            ip: '2402:4e00:1a2b:9d00::2026',
            version: 'IPv6',
            userAgent: req.headers['user-agent'] ?? '',
          },
          geo: {
            country: 'China',
            region: 'Guangdong',
            city: 'Shenzhen',
            isp: 'Tencent Cloud',
          },
          serverTime: new Date().toISOString(),
        }))
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), edgeFunctionMock()],
})
