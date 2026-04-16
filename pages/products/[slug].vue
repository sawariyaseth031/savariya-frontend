<template>
  <main class="pt-20">
    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <div class="font-serif text-2xl text-[var(--color-clay)] animate-pulse">Loading…</div>
    </div>
    <template v-else-if="product">
      <div class="bg-[var(--color-linen)] py-4">
        <div class="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-3 flex-wrap">
          <NuxtLink to="/" class="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-clay)] hover:text-[var(--color-bark)] transition-colors">Home</NuxtLink>
          <span class="text-[var(--color-bark)]/30 text-xs">›</span>
          <NuxtLink to="/collections" class="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-clay)] hover:text-[var(--color-bark)] transition-colors">Collections</NuxtLink>
          <span class="text-[var(--color-bark)]/30 text-xs">›</span>
          <NuxtLink :to="`/collections/${(product as any).categorySlug}`" class="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-clay)] hover:text-[var(--color-bark)] transition-colors">{{ (product as any).categoryName }}</NuxtLink>
          <span class="text-[var(--color-bark)]/30 text-xs">›</span>
          <span class="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-bark)]/60 truncate max-w-[160px]">{{ (product as any).name }}</span>
        </div>
      </div>

      <div class="section bg-[var(--color-warm-white)]">
        <div class="max-w-7xl mx-auto px-6 lg:px-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <!-- Image gallery -->
            <div>
              <div class="aspect-[4/3] overflow-hidden bg-[var(--color-linen)] mb-3">
                <img v-if="activeImage" :src="activeImage.url" :alt="activeImage.altText || (product as any).name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="font-serif text-8xl text-[var(--color-clay)]/20">{{ (product as any).name[0] }}</span>
                </div>
              </div>
              <div v-if="(product as any).images?.length > 1" class="flex gap-2 overflow-x-auto pb-1">
                <button v-for="(img, i) in (product as any).images" :key="i" @click="activeIndex = i"
                  :class="['flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors', activeIndex === i ? 'border-[var(--color-clay)]' : 'border-transparent hover:border-[var(--color-clay)]/40']">
                  <img :src="img.url" :alt="img.altText || (product as any).name" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <!-- Product info -->
            <div>
              <div class="flex items-center gap-3 mb-3 flex-wrap">
                <NuxtLink :to="`/collections/${(product as any).categorySlug}`"
                  class="font-sans text-[10px] tracking-[0.22em] uppercase text-[var(--color-clay)] hover:text-[var(--color-bark)] transition-colors">{{ (product as any).categoryName }}</NuxtLink>
                <span v-if="(product as any).customOrder" class="font-sans text-[8px] tracking-[0.2em] uppercase bg-[var(--color-bark)] text-[var(--color-sand-light)] px-2 py-1">Custom Available</span>
                <span v-if="(product as any).featured" class="font-sans text-[8px] tracking-[0.2em] uppercase bg-[var(--color-clay)] text-[var(--color-sand-light)] px-2 py-1">Featured</span>
              </div>
              <h1 class="font-serif text-[clamp(1.8rem,4vw,3rem)] text-[var(--color-bark)] leading-tight mb-4">{{ (product as any).name }}</h1>
              <div class="mb-6 pb-6 border-b border-[var(--color-linen)]">
                <span v-if="(product as any).priceOnRequest" class="font-serif text-xl text-[var(--color-bark)]/70 italic">Price on request</span>
                <span v-else-if="(product as any).price" class="font-serif text-3xl text-[var(--color-bark)]">₹{{ Number((product as any).price).toLocaleString('en-IN') }}</span>
                <span v-else class="font-serif text-xl text-[var(--color-bark)]/70 italic">Price on request</span>
              </div>
              <p v-if="(product as any).description" class="font-sans text-sm text-[var(--color-bark)]/65 leading-relaxed mb-8">{{ (product as any).description }}</p>
              <div class="space-y-3 mb-8">
                <div v-if="(product as any).material" class="flex items-start gap-4">
                  <span class="font-sans text-[10px] tracking-[0.18em] uppercase text-[var(--color-clay)] w-24 pt-0.5 flex-shrink-0">Material</span>
                  <span class="font-sans text-sm text-[var(--color-bark)]">{{ (product as any).material }}</span>
                </div>
                <div v-if="hasDimensions" class="flex items-start gap-4">
                  <span class="font-sans text-[10px] tracking-[0.18em] uppercase text-[var(--color-clay)] w-24 pt-0.5 flex-shrink-0">Dimensions</span>
                  <span class="font-sans text-sm text-[var(--color-bark)]">{{ dimensionString }}</span>
                </div>
                <div class="flex items-start gap-4">
                  <span class="font-sans text-[10px] tracking-[0.18em] uppercase text-[var(--color-clay)] w-24 pt-0.5 flex-shrink-0">Availability</span>
                  <span :class="['font-sans text-sm', (product as any).inStock ? 'text-[var(--color-moss)]' : 'text-red-500']">{{ (product as any).inStock ? 'In Stock' : 'Made to Order' }}</span>
                </div>
              </div>
              <div class="space-y-3">
                <button @click="showEnquiry = !showEnquiry" class="btn-primary w-full justify-center">
                  {{ showEnquiry ? 'Close Enquiry Form' : 'Enquire About This Piece' }}
                  <component :is="showEnquiry ? ChevronUpIcon : ArrowRightIcon" :size="14" />
                </button>
                <NuxtLink to="/#showroom" class="btn-outline w-full justify-center">Visit Showroom to See It In Person</NuxtLink>
              </div>
              <Transition name="slide-down">
                <div v-if="showEnquiry" class="mt-6 bg-[var(--color-sand-light)] border border-[var(--color-linen)] p-6">
                  <div v-if="submitted" class="text-center py-8">
                    <CheckCircleIcon :size="28" class="text-[var(--color-moss)] mx-auto mb-3" />
                    <p class="font-serif text-lg text-[var(--color-bark)] mb-1">Enquiry Sent!</p>
                    <p class="font-sans text-xs text-[var(--color-bark)]/60">We'll be in touch within one business day.</p>
                  </div>
                  <form v-else @submit.prevent="submit" class="space-y-4">
                    <div class="grid grid-cols-2 gap-3">
                      <div><label class="form-label">First Name *</label><input v-model="form.firstName" type="text" class="form-input" required placeholder="Priya" /></div>
                      <div><label class="form-label">Phone</label><input v-model="form.phone" type="tel" class="form-input" placeholder="+91 98765…" /></div>
                    </div>
                    <div><label class="form-label">Email *</label><input v-model="form.email" type="email" class="form-input" required placeholder="you@example.com" /></div>
                    <div><label class="form-label">Message</label><textarea v-model="form.message" class="form-input resize-none" rows="3" placeholder="Any specific requirements, finish preferences…" /></div>
                    <p v-if="error" class="font-sans text-xs text-red-600">{{ error }}</p>
                    <button type="submit" class="btn-primary w-full justify-center" :disabled="loading">
                      <span v-if="loading" class="animate-pulse">Sending…</span>
                      <template v-else>Send Enquiry <SendIcon :size="13" /></template>
                    </button>
                  </form>
                </div>
              </Transition>
              <div class="mt-8 pt-8 border-t border-[var(--color-linen)] grid grid-cols-3 gap-4 text-center">
                <div v-for="g in guarantees" :key="g.label">
                  <component :is="g.icon" :size="18" class="text-[var(--color-clay)] mx-auto mb-1.5" />
                  <p class="font-sans text-[9px] tracking-[0.12em] uppercase text-[var(--color-bark)]/60">{{ g.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="(product as any).related?.length" class="section bg-[var(--color-linen)]">
        <div class="max-w-7xl mx-auto px-6 lg:px-10">
          <p class="font-sans text-[10px] tracking-[0.28em] uppercase text-[var(--color-clay)] mb-3">You Might Also Like</p>
          <h2 class="font-serif text-2xl text-[var(--color-bark)] mb-8">From the Same Collection</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ProductCard v-for="p in (product as any).related" :key="p._id" :product="p" />
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
<script setup lang="ts">
import { ArrowRightIcon, ChevronUpIcon, SendIcon, CheckCircleIcon, ShieldCheckIcon, LeafIcon, TruckIcon } from 'lucide-vue-next'
const route = useRoute()
const { data: product, pending } = useApiFetch(() => `/api/products/${route.params.slug}`)
const activeIndex  = ref(0)
const showEnquiry  = ref(false)
const activeImage  = computed(() => (product.value as any)?.images?.[activeIndex.value] || null)
const hasDimensions = computed(() => { const d = (product.value as any)?.dimensions; return d?.width || d?.height || d?.depth })
const dimensionString = computed(() => {
  const d = (product.value as any)?.dimensions
  if (!d) return ''
  return [d.width && `W ${d.width}cm`, d.height && `H ${d.height}cm`, d.depth && `D ${d.depth}cm`].filter(Boolean).join(' × ')
})
const { form, submitted, loading, error, submit } = useEnquiry('Product Enquiry')
watch(product, (p: any) => { if (p) { form.product = p.name; form.interest = `${p.name} — ${p.categoryName}` } }, { immediate: true })
const guarantees = [
  { label: 'Lifetime Guarantee', icon: ShieldCheckIcon },
  { label: 'Sustainably Sourced', icon: LeafIcon },
  { label: 'Free Delivery, Pune', icon: TruckIcon },
]
useSeoMeta({ title: computed(() => `${(product.value as any)?.name || 'Product'} — Sawariya Seth Furniture`) })
useScrollReveal()
</script>
<style scoped>
.form-label { display:block; font-family:var(--font-sans); font-size:.6875rem; letter-spacing:.15em; text-transform:uppercase; color:var(--color-bark); opacity:.6; margin-bottom:.4rem; }
.form-input  { width:100%; font-family:var(--font-sans); font-size:.875rem; color:var(--color-bark); background:#fff; border:1px solid rgba(44,26,14,.18); padding:.6rem .875rem; outline:none; transition:border-color .2s; appearance:none; }
.form-input:focus { border-color:var(--color-clay); } .form-input::placeholder { color:rgba(44,26,14,.28); }
.slide-down-enter-active, .slide-down-leave-active { transition:all .35s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity:0; transform:translateY(-10px); }
</style>
