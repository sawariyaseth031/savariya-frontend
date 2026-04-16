export function useEnquiry(defaultInterest = '') {
  const { post } = useApi()

  const form = reactive({
    firstName: '', lastName: '', email: '', phone: '',
    interest: defaultInterest, product: '', message: '',
  })
  const submitted = ref(false)
  const loading   = ref(false)
  const error     = ref<string | null>(null)

  const reset = () => {
    Object.assign(form, {
      firstName: '', lastName: '', email: '', phone: '',
      interest: defaultInterest, product: '', message: '',
    })
    submitted.value = false
    error.value = null
  }

  const submit = async () => {
    loading.value = true
    error.value = null
    try {
      await post('/api/enquiries', form)
      submitted.value = true
    } catch (e: any) {
      error.value = e?.data?.error || 'Something went wrong. Please call us directly.'
    } finally { loading.value = false }
  }

  return { form, submitted, loading, error, submit, reset }
}
