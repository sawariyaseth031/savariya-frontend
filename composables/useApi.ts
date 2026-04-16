/**
 * useApi — wraps $fetch pointing at the Express backend.
 * Includes retry logic for Render cold-start resilience.
 */
export function useApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  const getToken = (): string | null => {
    if (import.meta.server) return null
    return localStorage.getItem('wc_token')
  }

  const authHeaders = (): Record<string, string> => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Retry once on network/server error — handles Render cold starts
  async function fetchWithRetry<T>(url: string, opts: Record<string, any> = {}, retries = 1): Promise<T> {
    try {
      return await $fetch<T>(url, opts)
    } catch (err: any) {
      if (retries > 0 && (!err?.status || err?.status >= 500)) {
        await new Promise(r => setTimeout(r, 2000))
        return fetchWithRetry<T>(url, opts, retries - 1)
      }
      throw err
    }
  }

  const get  = <T = any>(path: string, opts: Record<string, any> = {}) =>
    fetchWithRetry<T>(`${base}${path}`, { ...opts, method: 'GET' })

  const post  = <T = any>(path: string, body: any, opts: Record<string, any> = {}) =>
    $fetch<T>(`${base}${path}`, { ...opts, method: 'POST', body })

  const patch = <T = any>(path: string, body: any, opts: Record<string, any> = {}) =>
    $fetch<T>(`${base}${path}`, { ...opts, method: 'PATCH', body })

  const del   = <T = any>(path: string, opts: Record<string, any> = {}) =>
    $fetch<T>(`${base}${path}`, { ...opts, method: 'DELETE' })

  const adminGet  = <T = any>(path: string) =>
    fetchWithRetry<T>(`${base}${path}`, { method: 'GET', headers: authHeaders() })

  const adminPost  = <T = any>(path: string, body: any) =>
    $fetch<T>(`${base}${path}`, { method: 'POST', body, headers: authHeaders() })

  const adminPatch = <T = any>(path: string, body: any) =>
    $fetch<T>(`${base}${path}`, { method: 'PATCH', body, headers: authHeaders() })

  const adminDel   = <T = any>(path: string) =>
    $fetch<T>(`${base}${path}`, { method: 'DELETE', headers: authHeaders() })

  const adminUpload = async (file: File): Promise<{ url: string; fileId: string }> => {
    const form = new FormData()
    form.append('file', file)
    return $fetch(`${base}/api/files/upload`, { method: 'POST', body: form, headers: authHeaders() })
  }

  return { get, post, patch, del, adminGet, adminPost, adminPatch, adminDel, adminUpload, base }
}

/**
 * useApiFetch — reactive useFetch wrapper (SSR-compatible).
 * Use in <script setup> for page-level data that needs hydration.
 */
export function useApiFetch<T = any>(path: string | (() => string), opts: Record<string, any> = {}) {
  const config = useRuntimeConfig()
  const base = config.public.apiBase
  const url = typeof path === 'function'
    ? computed(() => `${base}${path()}`)
    : `${base}${path}`
  return useFetch<T>(url as any, { dedupe: 'defer', ...opts })
}
