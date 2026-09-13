/**
 * 只接受同源请求。
 * 浏览器对 POST 一定会带 Origin，所以这里要求它必须存在且匹配——
 * 只要放过缺失的情况，curl 不带这个头就能绕过去。
 */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false

  // Vercel 等平台会把原始域名放在 x-forwarded-host
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
