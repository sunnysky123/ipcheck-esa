# ipcheck-esa

基于 **Vue 3 + Vite** 的 IPv6 连通性检测站,部署在阿里云 **ESA(Edge Security Acceleration)Pages**。检测访问网络是否支持 IPv6,并展示公网 IP、协议版本、运营商与地理位置。

## 项目结构

```
├─ index.html                     # 入口 HTML
├─ esa.jsonc                      # ESA Pages 配置(函数入口 + 静态资源目录)
├─ functions/
│  └─ getip.js                    # ESA 边缘函数:GET /api/getip
├─ src/
│  ├─ App.vue                     # 页面骨架(头部 / 卡片 / 页脚)
│  ├─ main.js                     # 应用入口
│  ├─ style.css                   # 设计令牌 + 全局样式
│  ├─ composables/useIpCheck.js   # 检测逻辑(边缘节点接口 + IP 族判定)
│  ├─ composables/useTheme.js     # 亮色/暗色主题切换(默认跟随系统)
│  └─ components/
│     ├─ StatusCard.vue           # IPv6 判定卡片(动态状态球)
│     └─ InfoGrid.vue             # 详情网格:IP / 版本 / 运营商 / 位置…
├─ public/favicon.svg
└─ vite.config.js                 # 内置本地开发用的 /api/getip mock
```

## 检测原理

1. 边缘函数 `/api/getip` 返回访问者 IP 与 Geo 信息。ESA 会将客户端信息注入到 `request.info`(含 `remote_addr`、`ip_country_en`、`ip_region_en`、`ip_city_en`、`ip_isp_en` 等),其中 `remote_addr` 即本次请求实际使用的 IP 族。
2. 前端根据该 IP 族给出判定(已支持 IPv6、暂未启用 IPv4、无法判定三种状态),并展示 IP、运营商与位置信息。

不依赖任何第三方探测 API,服务自身即可完成全部检测。

## 本地开发

```sh
npm install
npm run dev     # http://localhost:5173 (使用 mock 的 /api/getip)
npm run build   # 产物输出到 dist/
```

## 部署指南(阿里云 ESA 控制台)

前提条件:
1. GitHub 账号
2. 阿里云账号,并已开通 ESA

部署步骤:
1. Fork 本仓库到你的 GitHub
2. 进入阿里云 ESA 控制台,创建 Pages 项目
3. 选择"连接 GitHub 仓库"并授权
4. 选择你 Fork 的仓库和分支
5. 配置构建参数(见下表)
6. 完成部署后访问分配域名

### 控制台配置示例

以下是可直接参考的一组配置:

| 配置项 | 值 |
| --- | --- |
| 非生产分支构建 | 关闭 |
| 安装命令 | `npm install` |
| 构建命令 | `npm run build` |
| 根目录 | `/` |
| 静态资源目录 | `dist` |
| 函数文件路径 | `functions` |
| Node.js 版本 | 22.x |
| 环境变量 | 默认不需要 |

`esa.jsonc` 指定了函数入口与静态资源目录:

```jsonc
{
  "name": "ipcheck-esa",
  "entry": "./functions/getip.js",
  "assets": { "directory": "./dist" }
}
```

官方文档:
- https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/build-pages
- https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/api-documentation/
