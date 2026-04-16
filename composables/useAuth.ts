export function useAuth() {
  const router = useRouter()
  const config = useRuntimeConfig()
  const { post } = useApi()

  const token    = ref<string | null>(null)
  const loading  = ref(false)
  const error    = ref('')

  onMounted(() => { token.value = localStorage.getItem('wc_token') })

  const isAuthenticated = computed(() => !!token.value)

  const login = async (password: string) => {
    loading.value = true
    error.value = ''
    try {
      const res = await post<{ token: string }>('/api/auth/login', { password })
      token.value = res.token
      localStorage.setItem('wc_token', res.token)
      await router.push('/admin/dashboard')
    } catch (e: any) {
      error.value = e?.data?.error || 'Incorrect password'
    } finally { loading.value = false }
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('wc_token')
    router.push('/admin')
  }

  const checkAuth = async (): Promise<boolean> => {
    const t = localStorage.getItem('wc_token')
    if (!t) return false
    try {
      await $fetch(`${config.public.apiBase}/api/auth/check`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      return true
    } catch {
      localStorage.removeItem('wc_token')
      return false
    }
  }

  return { token, isAuthenticated, loading, error, login, logout, checkAuth }
}

export function useImageUpload() {
  const { adminUpload } = useApi()
  const uploading   = ref(false)
  const uploadError = ref<string | null>(null)

  const uploadImage = async (file: File): Promise<string | null> => {
    uploading.value = true
    uploadError.value = null
    try {
      const res = await adminUpload(file)
      return res.url
    } catch (e: any) {
      uploadError.value = e?.data?.error || 'Upload failed'
      return null
    } finally { uploading.value = false }
  }

  return { uploading, uploadError, uploadImage }
}
