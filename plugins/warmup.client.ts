/**
 * Backend warm-up plugin
 *
 * Fires a lightweight ping to the Express backend the instant the Nuxt app
 * boots in the browser. This wakes the Render instance immediately, so by
 * the time a visitor clicks any link, the backend is already awake.
 *
 * Works alongside UptimeRobot as a belt-and-suspenders approach.
 * Never blocks rendering — completely fire-and-forget.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  fetch(`${config.public.apiBase}/api/health`, {
    signal: AbortSignal.timeout(10_000),
  }).catch(() => {
    // Silently ignore — best-effort only
  })
})
