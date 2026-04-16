export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin') || to.path === '/admin') return
  if (import.meta.server) return

  const token = localStorage.getItem('wc_token')
  if (!token) return navigateTo('/admin')

  try {
    await $fetch(`${useRuntimeConfig().public.apiBase}/api/auth/check`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    localStorage.removeItem('wc_token')
    return navigateTo('/admin')
  }
})
