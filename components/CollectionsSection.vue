<template>
  <section id="collections" class="section bg-[var(--color-warm-white)]">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div>
          <p class="font-sans text-[10px] tracking-[0.28em] uppercase text-[var(--color-clay)] mb-3">Our Work</p>
          <h2 class="font-serif text-[clamp(2.2rem,4.5vw,3.5rem)] text-[var(--color-bark)]">Curated Collections</h2>
          <div class="wood-rule" />
        </div>
        <p class="font-sans text-sm text-[var(--color-bark)]/60 max-w-xs leading-relaxed">
          Built from sustainably sourced teak, sheesham, mango wood, and solid oak.
        </p>
      </div>

      <!-- Skeleton while loading -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div v-for="(w, i) in [7,5,4,4,4]" :key="i"
          :class="`md:col-span-${w} aspect-[4/3] bg-[var(--color-linen)] animate-pulse`" />
      </div>

      <!-- Live data from MongoDB -->
      <div v-else-if="categories?.length" class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <NuxtLink
          v-for="(item, i) in (categories as any[]).slice(0, 5)"
          :key="item._id"
          :to="`/collections/${item.slug}`"
          :class="['group cursor-pointer reveal', i===0?'md:col-span-7':i===1?'md:col-span-5':'md:col-span-4']"
        >
          <div class="relative overflow-hidden aspect-[4/3] img-hover">
            <img v-if="item.coverImage" :src="item.coverImage" :alt="item.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-[var(--color-linen)] flex items-center justify-center">
              <span class="font-serif text-5xl text-[var(--color-clay)]/40">{{ item.name[0] }}</span>
            </div>
            <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style="background:linear-gradient(to top,rgba(28,18,9,0.82) 0%,transparent 60%)">
              <span class="font-sans text-[9px] tracking-[0.25em] uppercase text-[var(--color-clay-light)] mb-1">{{ item.productCount }} pieces</span>
              <span class="font-serif text-xl text-[var(--color-sand-light)]">{{ item.name }}</span>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1C1209]/70 to-transparent group-hover:opacity-0 transition-opacity">
              <span class="font-serif text-lg text-[var(--color-sand-light)]">{{ item.name }}</span>
            </div>
          </div>
          <div class="pt-4 pb-2 flex items-center justify-between">
            <span class="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-clay)]">{{ item.description || 'Collection' }}</span>
            <span class="font-sans text-xs text-[var(--color-bark)]/40">{{ item.productCount }} pieces</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Static fallback when DB is empty -->
      <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <NuxtLink v-for="(item, i) in staticCollections" :key="item.name" to="/collections"
          :class="['group cursor-pointer reveal', i===0?'md:col-span-7':i===1?'md:col-span-5':'md:col-span-4']">
          <div class="relative overflow-hidden aspect-[4/3] img-hover">
            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1C1209]/70 to-transparent">
              <span class="font-serif text-lg text-[var(--color-sand-light)]">{{ item.name }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-14">
        <NuxtLink to="/collections" class="btn-outline">View All Collections <ArrowRightIcon :size="14" /></NuxtLink>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ArrowRightIcon } from 'lucide-vue-next'
import bedImage from '@/assets/savariyasethfurniture_bed.jpeg'
import tvSetImage from '@/assets/savariyasethfurniture_tvset.jpeg'
const { data: categories, pending } = useApiFetch('/api/categories', { query: { featured: 'true', limit: 5 } })
const staticCollections = [
  { name: 'The Heirloom Dining', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80' },
  { name: 'Solid Teak Living',   image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80' },
  {
    name: 'Beds',
    category: 'Bedroom',
    pieces: 8,
    image: bedImage,
  },
  {
    name: 'TV Unit',
    category: 'Living Room',
    pieces: 8,
    image: tvSetImage, // ✅ your local asset
  },
  { name: 'Studio Beds',         image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
  // { name: 'Sheesham Storage',    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  // { name: 'Oak Office',          image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
]
useScrollReveal()
</script>
