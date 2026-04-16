<template>
  <div class="min-h-screen flex bg-[#F7F3ED]">
    <AdminSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b border-[var(--color-linen)] px-8 py-4 flex items-center justify-between">
        <div class="font-sans text-sm text-[var(--color-bark)]/50 hidden lg:block">Sawariya Seth Furniture — Admin</div>
        <NuxtLink to="/" target="_blank"
          class="flex items-center gap-2 font-sans text-xs text-[var(--color-clay)] hover:text-[var(--color-bark)] transition-colors">
          <ExternalLinkIcon :size="13" /> View Site
        </NuxtLink>
      </header>
      <main class="flex-1 p-6 lg:p-10 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ExternalLinkIcon } from 'lucide-vue-next'
</script>
