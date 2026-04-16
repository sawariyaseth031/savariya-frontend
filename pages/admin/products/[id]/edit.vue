<template>
  <div class="max-w-3xl">
    <div class="flex items-center gap-3 mb-8">
      <NuxtLink to="/admin/products" class="text-[var(--color-bark)]/40 hover:text-[var(--color-clay)] transition-colors"><ArrowLeftIcon :size="18" /></NuxtLink>
      <div>
        <h1 class="font-serif text-3xl text-[var(--color-bark)]">Edit Product</h1>
        <p v-if="product" class="font-sans text-sm text-[var(--color-bark)]/50">{{ product.name }}</p>
      </div>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 5" :key="n" class="h-12 bg-[var(--color-linen)] animate-pulse" />
    </div>
    <AdminProductForm v-else-if="product" :categories="categories" :initial="product" @saved="onSaved" />
  </div>
</template>
<script setup lang="ts">
import { ArrowLeftIcon } from 'lucide-vue-next'
definePageMeta({ layout: 'admin', middleware: 'admin' })
const route = useRoute(); const router = useRouter()
const { adminGet } = useApi()
const product = ref<any>(null); const categories = ref<any[]>([]); const loading = ref(true)
onMounted(async () => {
  try {
    [product.value, categories.value] = await Promise.all([
      adminGet(`/api/products/admin/${route.params.id}`),
      adminGet('/api/categories/admin/all'),
    ])
  } finally { loading.value = false }
})
const onSaved = () => router.push('/admin/products')
</script>
