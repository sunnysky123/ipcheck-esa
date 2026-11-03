/** 从 User-Agent 中识别浏览器与操作系统(仅用于展示,弱依赖于定期更新) */
export function parseUA(raw = '') {
  const s = String(raw)
  let browser = '未知浏览器'
  if (/edg\//i.test(s)) browser = 'Microsoft Edge'
  else if (/opr\//i.test(s) || /opera/i.test(s)) browser = 'Opera'
  else if (/firefox\//i.test(s)) browser = 'Firefox'
  else if (/chrome\//i.test(s)) browser = 'Chrome'
  else if (/safari\//i.test(s)) browser = 'Safari'

  let os = '未知系统'
  if (/windows/i.test(s)) os = 'Windows'
  else if (/android/i.test(s)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(s)) os = 'iOS'
  else if (/mac os x/i.test(s)) os = 'macOS'
  else if (/linux/i.test(s)) os = 'Linux'

  return { browser, os }
}
