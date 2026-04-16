<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-3xl text-[var(--color-bark)] mb-1">Products</h1>
        <p class="font-sans text-sm text-[var(--color-bark)]/50">{{ products.length }} products across all categories</p>
      </div>
      <NuxtLink to="/admin/products/new" class="btn-primary text-sm py-3 px-5"><PlusIcon :size="14" /> Add Product</NuxtLink>
    </div>
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <SearchIcon :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-clay)]" />
        <input v-model="search" type="text" placeholder="Search products…" class="admin-input pl-9" />
      </div>
      <select v-model="filterCat" class="admin-input admin-select w-full sm:w-56">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
      </select>
    </div>
    <div v-if="loading" class="space-y-3"><div v-for="n in 5" :key="n" class="h-16 bg-[var(--color-linen)] animate-pulse" /></div>
    <div v-else-if="!filteredProducts.length" class="text-center py-20 bg-white border border-[var(--color-linen)]">
      <PackageIcon :size="32" class="text-[var(--color-clay)]/40 mx-auto mb-4" />
      <p class="font-serif text-xl text-[var(--color-bark)] mb-2">{{ search || filterCat ? 'No products match your filters' : 'No products yet' }}</p>
      <NuxtLink v-if="!search && !filterCat" to="/admin/products/new" class="btn-primary mt-4 inline-flex">Add First Product</NuxtLink>
      <button v-else @click="search = ''; filterCat = ''" class="btn-outline mt-4">Clear Filters</button>
    </div>
    <div v-else class="bg-white border border-[var(--color-linen)] overflow-hidden">
      <table class="w-full">
        <thead class="bg-[var(--color-linen)]/50">
          <tr>
            <th class="font-sans text-[10px] tracking-[0.15em] uppercase text-[var(--color-bark)]/50 text-left px-4 py-3">Product</th>
            <th class="font-sans text-[10px] tracking-[0.15em] uppercase text-[var(--color-bark)]/50 text-left px-4 py-3 hidden md:table-cell">Category</th>
            <th class="font-sans text-[10px] tracking-[0.15em] uppercase text-[var(--color-bark)]/50 text-left px-4 py-3 hidden sm:table-cell">Price</th>
            <th class="font-sans text-[10px] tracking-[0.15em] uppercase text-[var(--color-bark)]/50 text-right px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredProducts" :key="p._id" class="border-t border-[var(--color-linen)]/60 hover:bg-[var(--color-linen)]/20 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex-shrink-0 overflow-hidden bg-[var(--color-linen)]">
                  <img v-if="p.coverImage" :src="p.coverImage" :alt="p.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center"><span class="font-serif text-base text-[var(--color-clay)]/30">{{ p.name[0] }}</span></div>
                </div>
                <div>
                  <p class="font-sans text-sm font-medium text-[var(--color-bark)]">{{ p.name }}</p>
                  <div class="flex items-center gap-1 mt-0.5">
                    <span v-if="p.featured" class="font-sans text-[8px] tracking-[0.12em] uppercase bg-[var(--color-clay)] text-[var(--color-sand-light)] px-1.5 py-0.5">Featured</span>
                    <span v-if="p.customOrder" class="font-sans text-[8px] tracking-[0.12em] uppercase bg-[var(--color-bark)] text-[var(--color-sand-light)] px-1.5 py-0.5">Custom</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 hidden md:table-cell"><span class="font-sans text-xs text-[var(--color-bark)]/60">{{ p.categoryName }}</span></td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span v-if="p.priceOnRequest" class="font-sans text-xs text-[var(--color-bark)]/50 italic">On request</span>
              <span v-else class="font-sans text-sm text-[var(--color-bark)]">₹{{ Number(p.price).toLocaleString('en-IN') }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <NuxtLink :to="`/products/${p.slug}`" target="_blank" class="p-2 text-[var(--color-bark)]/40 hover:text-[var(--color-clay)] transition-colors"><ExternalLinkIcon :size="14" /></NuxtLink>
                <NuxtLink :to="`/admin/products/${p._id}/edit`" class="p-2 text-[var(--color-bark)]/40 hover:text-[var(--color-clay)] transition-colors"><PencilIcon :size="14" /></NuxtLink>
                <button @click="confirmDelete(p)" class="p-2 text-[var(--color-bark)]/40 hover:text-red-500 transition-colors"><TrashIcon :size="14" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bark)]/60 px-4">
      <div class="bg-white w-full max-w-sm p-8 text-center">
        <TrashIcon :size="28" class="text-red-400 mx-auto mb-4" />
        <h3 class="font-serif text-xl text-[var(--color-bark)] mb-2">Delete "{{ deleteTarget.name }}"?</h3>
        <p class="font-sans text-sm text-[var(--color-bark)]/60 mb-6">All images will also be removed. This cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button @click="doDelete" class="btn-primary text-sm" style="background:#ef4444;border-color:#ef4444;" :disabled="deleting">{{ deleting ? 'Deleting…' : 'Yes, Delete' }}</button>
          <button @click="deleteTarget = null" class="btn-outline text-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon, PackageIcon, ExternalLinkIcon } from 'lucide-vue-next'
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { adminGet, adminDel } = useApi()
const products = ref<any[]>([]); const categories = ref<any[]>([])
const loading = ref(true); const search = ref(''); const filterCat = ref('')
const deleteTarget = ref<any>(null); const deleting = ref(false)

const load = async () => {
  loading.value = true
  try { [products.value, categories.value] = await Promise.all([adminGet('/api/products/admin/all'), adminGet('/api/categories/admin/all')]) }
  finally { loading.value = false }
}
onMounted(load)

const filteredProducts = computed(() => {
  let list = [...products.value]
  if (search.value) { const q = search.value.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q) || (p.material || '').toLowerCase().includes(q)) }
  if (filterCat.value) list = list.filter(p => (p.categoryId?._id || p.categoryId) === filterCat.value)
  return list
})
const confirmDelete = (p: any) => { deleteTarget.value = p }
const doDelete = async () => {
  deleting.value = true
  try { await adminDel(`/api/products/admin/${deleteTarget.value._id}`); await load(); deleteTarget.value = null }
  finally { deleting.value = false }
}
</script>
<style scoped>
.admin-input { width:100%; font-family:var(--font-sans); font-size:.9rem; color:var(--color-bark); background:#fff; border:1px solid rgba(44,26,14,.2); padding:.65rem .875rem; outline:none; border-radius:2px; transition:border-color .2s; }
.admin-input:focus { border-color:var(--color-clay); }
.admin-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C4845A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right .875rem center; padding-right:2.5rem; }
</style>
