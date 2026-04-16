<template>
  <div class="w-full max-w-md">
    <div class="bg-white border border-[var(--color-linen)] p-10">
      <div class="text-center mb-8">
        <div class="font-serif text-3xl text-[var(--color-bark)] mb-1">Sawariya Seth Furniture</div>
        <div class="font-sans text-[9px] tracking-[0.28em] uppercase text-[var(--color-clay)]">Admin Dashboard</div>
      </div>
      <form @submit.prevent="login(password)" class="space-y-5" novalidate>
        <div>
          <label class="admin-label">Password</label>
          <input v-model="password" type="password" class="admin-input" placeholder="Enter admin password"
            autocomplete="current-password" required autofocus />
        </div>
        <p v-if="error" class="font-sans text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{{ error }}</p>
        <button type="submit" class="btn-primary w-full justify-center" :disabled="loading">
          <span v-if="loading" class="animate-pulse">Signing in…</span>
          <template v-else>Sign In <ArrowRightIcon :size="14" /></template>
        </button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRightIcon } from 'lucide-vue-next'
definePageMeta({ layout: 'admin-auth' })
const password = ref('')
const { login, loading, error, checkAuth } = useAuth()
onMounted(async () => { if (await checkAuth()) await navigateTo('/admin/dashboard') })
</script>
<style scoped>
.admin-label { display:block; font-family:var(--font-sans); font-size:.75rem; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:var(--color-bark); opacity:.65; margin-bottom:.375rem; }
.admin-input { width:100%; font-family:var(--font-sans); font-size:.9rem; color:var(--color-bark); background:#fff; border:1px solid rgba(44,26,14,.2); padding:.65rem .875rem; outline:none; border-radius:2px; transition:border-color .2s; }
.admin-input:focus { border-color:var(--color-clay); }
</style>
