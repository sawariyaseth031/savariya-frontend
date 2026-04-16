<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Basic info -->
    <div class="bg-white border border-[var(--color-linen)] p-6 space-y-5">
      <h2 class="font-sans text-sm font-medium text-[var(--color-bark)] tracking-wide border-b border-[var(--color-linen)] pb-3">Basic Information</h2>
      <div><label class="admin-label">Product Name *</label>
        <input v-model="form.name" type="text" class="admin-input" placeholder="e.g. Malabar Teak Dining Table" required />
      </div>
      <div>
        <label class="admin-label">Category *</label>
        <select v-model="form.categoryId" class="admin-input admin-select" required>
          <option value="">Select a category…</option>
          <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
        </select>
        <p v-if="!categories?.length" class="font-sans text-xs text-amber-600 mt-1">
          No categories yet — <NuxtLink to="/admin/categories" class="underline">create one first</NuxtLink>.
        </p>
      </div>
      <div><label class="admin-label">Description</label>
        <textarea v-model="form.description" class="admin-input resize-none" rows="4" placeholder="Materials, style, construction details…" />
      </div>
    </div>

    <!-- Pricing -->
    <div class="bg-white border border-[var(--color-linen)] p-6 space-y-4">
      <h2 class="font-sans text-sm font-medium text-[var(--color-bark)] tracking-wide border-b border-[var(--color-linen)] pb-3">Pricing</h2>
      <label class="flex items-center gap-3 cursor-pointer">
        <div @click="form.priceOnRequest = !form.priceOnRequest"
          :class="['w-10 h-6 rounded-full transition-colors relative cursor-pointer', form.priceOnRequest ? 'bg-[var(--color-clay)]' : 'bg-[var(--color-bark)]/20']">
          <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-transform', form.priceOnRequest ? 'translate-x-5' : 'translate-x-1']" />
        </div>
        <span class="font-sans text-sm text-[var(--color-bark)]">Price on request (hide price publicly)</span>
      </label>
      <div v-if="!form.priceOnRequest">
        <label class="admin-label">Price (₹)</label>
        <input v-model.number="form.price" type="number" class="admin-input" placeholder="e.g. 85000" min="0" step="100" />
      </div>
    </div>

    <!-- Details -->
    <div class="bg-white border border-[var(--color-linen)] p-6 space-y-5">
      <h2 class="font-sans text-sm font-medium text-[var(--color-bark)] tracking-wide border-b border-[var(--color-linen)] pb-3">Product Details</h2>
      <div><label class="admin-label">Material / Wood Type</label>
        <input v-model="form.material" type="text" class="admin-input" placeholder="e.g. Solid Malabar Teak, Hand-rubbed Oil Finish" />
      </div>
      <div>
        <label class="admin-label">Dimensions (cm)</label>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <input v-model.number="form.dimensions.width"  type="number" class="admin-input" placeholder="Width"  min="0" step="0.5" />
            <p class="font-sans text-[10px] text-[var(--color-bark)]/40 mt-1">Width</p>
          </div>
          <div>
            <input v-model.number="form.dimensions.height" type="number" class="admin-input" placeholder="Height" min="0" step="0.5" />
            <p class="font-sans text-[10px] text-[var(--color-bark)]/40 mt-1">Height</p>
          </div>
          <div>
            <input v-model.number="form.dimensions.depth"  type="number" class="admin-input" placeholder="Depth"  min="0" step="0.5" />
            <p class="font-sans text-[10px] text-[var(--color-bark)]/40 mt-1">Depth</p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label v-for="t in toggles" :key="t.key" class="flex items-center gap-3 cursor-pointer">
          <div @click="(form as any)[t.key] = !(form as any)[t.key]"
            :class="['w-10 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0', (form as any)[t.key] ? t.onColor : 'bg-[var(--color-bark)]/20']">
            <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-transform', (form as any)[t.key] ? 'translate-x-5' : 'translate-x-1']" />
          </div>
          <span class="font-sans text-sm text-[var(--color-bark)]">{{ (form as any)[t.key] ? t.onLabel : t.offLabel }}</span>
        </label>
      </div>
    </div>

    <!-- Photos -->
    <div class="bg-white border border-[var(--color-linen)] p-6 space-y-4">
      <h2 class="font-sans text-sm font-medium text-[var(--color-bark)] tracking-wide border-b border-[var(--color-linen)] pb-3">Photos</h2>
      <p class="font-sans text-xs text-[var(--color-bark)]/50">First image is the cover. Click × to remove.</p>
      <label :class="['flex items-center justify-center gap-3 border-2 border-dashed border-[var(--color-clay)]/40 hover:border-[var(--color-clay)] transition-colors cursor-pointer p-6', uploading ? 'opacity-50 cursor-not-allowed' : '']">
        <UploadIcon :size="18" class="text-[var(--color-clay)]" />
        <span class="font-sans text-sm text-[var(--color-clay)]">{{ uploading ? 'Uploading…' : 'Click to upload photos' }}</span>
        <input type="file" class="hidden" accept="image/*" multiple @change="handleUpload" :disabled="uploading" />
      </label>
      <div class="flex gap-2">
        <input v-model="urlInput" type="text" class="admin-input flex-1" placeholder="Or paste an image URL and press Enter" @keydown.enter.prevent="addUrl" />
        <button type="button" @click="addUrl" class="btn-outline px-4 py-2 text-sm flex-shrink-0">Add</button>
      </div>
      <div v-if="form.images.length" class="grid grid-cols-3 sm:grid-cols-4 gap-3">
        <div v-for="(img, i) in form.images" :key="i" class="relative group aspect-square">
          <img :src="img.url" :alt="img.altText" class="w-full h-full object-cover" />
          <button type="button" @click="removeImage(i)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <XIcon :size="10" />
          </button>
          <div v-if="i === 0" class="absolute bottom-0 left-0 right-0 bg-[var(--color-clay)] text-[var(--color-sand-light)] font-sans text-[8px] tracking-[0.15em] uppercase text-center py-0.5">Cover</div>
        </div>
      </div>
    </div>

    <!-- Submit -->
    <div class="flex items-center gap-4">
      <button type="submit" class="btn-primary" :disabled="saving">
        <span v-if="saving" class="animate-pulse">Saving…</span>
        <template v-else>{{ isEditing ? 'Save Changes' : 'Create Product' }} <CheckIcon :size="14" /></template>
      </button>
      <NuxtLink to="/admin/products" class="btn-outline">Cancel</NuxtLink>
      <p v-if="saveError" class="font-sans text-xs text-red-600 ml-2">{{ saveError }}</p>
    </div>
  </form>
</template>
<script setup lang="ts">
import { UploadIcon, XIcon, CheckIcon } from 'lucide-vue-next'
const props = defineProps<{ categories: any[]; initial?: any }>()
const emit  = defineEmits<{ saved: [product: any] }>()
const isEditing = computed(() => !!props.initial?._id)
const { uploading, uploadImage } = useImageUpload()
const { adminPost, adminPatch } = useApi()
const saving   = ref(false)
const saveError = ref('')
const urlInput = ref('')

const form = reactive({
  name: '', categoryId: '', description: '',
  price: null as number | null, priceOnRequest: false, material: '',
  dimensions: { width: null as number | null, height: null as number | null, depth: null as number | null },
  customOrder: false, featured: false, inStock: true, sortOrder: 0,
  images: [] as { url: string; altText: string }[],
})

const toggles = [
  { key: 'customOrder', onLabel: 'Custom order available', offLabel: 'Custom order available', onColor: 'bg-[var(--color-clay)]' },
  { key: 'featured',    onLabel: 'Featured product',       offLabel: 'Featured product',       onColor: 'bg-[var(--color-clay)]' },
  { key: 'inStock',     onLabel: 'In Stock',               offLabel: 'Made to Order',          onColor: 'bg-[var(--color-moss)]' },
]

watch(() => props.initial, (v) => {
  if (!v) return
  Object.assign(form, {
    name: v.name, categoryId: v.categoryId?._id || v.categoryId,
    description: v.description, price: v.price, priceOnRequest: !!v.priceOnRequest,
    material: v.material,
    dimensions: { width: v.dimensions?.width || null, height: v.dimensions?.height || null, depth: v.dimensions?.depth || null },
    customOrder: !!v.customOrder, featured: !!v.featured, inStock: !!v.inStock, sortOrder: v.sortOrder || 0,
    images: (v.images || []).map((i: any) => ({ url: i.url, altText: i.altText || '' })),
  })
}, { immediate: true })

const handleUpload = async (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  for (const file of files) {
    const url = await uploadImage(file)
    if (url) form.images.push({ url, altText: form.name })
  }
}
const addUrl     = () => { if (!urlInput.value.trim()) return; form.images.push({ url: urlInput.value.trim(), altText: form.name }); urlInput.value = '' }
const removeImage = (i: number) => form.images.splice(i, 1)

const handleSubmit = async () => {
  if (!form.name || !form.categoryId) { saveError.value = 'Name and category are required.'; return }
  saving.value = true; saveError.value = ''
  try {
    const result = isEditing.value
      ? await adminPatch(`/api/products/admin/${props.initial._id}`, form)
      : await adminPost('/api/products/admin', form)
    emit('saved', result)
  } catch (e: any) {
    saveError.value = e?.data?.error || 'Failed to save. Please try again.'
  } finally { saving.value = false }
}
</script>
<style scoped>
.admin-label { display:block; font-family:var(--font-sans); font-size:.75rem; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:var(--color-bark); opacity:.65; margin-bottom:.375rem; }
.admin-input { width:100%; font-family:var(--font-sans); font-size:.9rem; color:var(--color-bark); background:#fff; border:1px solid rgba(44,26,14,.2); padding:.65rem .875rem; outline:none; border-radius:2px; transition:border-color .2s; }
.admin-input:focus { border-color:var(--color-clay); }
.admin-input::placeholder { color:rgba(44,26,14,.3); }
.admin-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C4845A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right .875rem center; padding-right:2.5rem; }
</style>
