<template>
  <div class="max-w-3xl">
    <div class="flex items-center gap-3 mb-8">
      <NuxtLink to="/admin/products" class="text-[var(--color-bark)]/40 hover:text-[var(--color-clay)] transition-colors"><ArrowLeftIcon :size="18" /></NuxtLink>
      <div>
        <h1 class="font-serif text-3xl text-[var(--color-bark)]">Add New Product</h1>
        <p class="font-sans text-sm text-[var(--color-bark)]/50">Fill in the details below and upload photos.</p>
      </div>
    </div>
    <AdminProductForm :categories="categories" @saved="onSaved" />
  </div>
</template>
<script setup lang="ts">
import { ArrowLeftIcon } from 'lucide-vue-next'
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { adminGet } = useApi()
const categories = ref<any[]>([])
const router = useRouter()
onMounted(async () => { try { categories.value = await adminGet('/api/categories/admin/all') } catch {} })
const onSaved = () => router.push('/admin/products')
</script>
