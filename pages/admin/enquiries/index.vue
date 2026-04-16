<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-3xl text-[var(--color-bark)] mb-1">Enquiries</h1>
        <p class="font-sans text-sm text-[var(--color-bark)]/50">{{ enquiries.length }} total · <span class="text-[var(--color-clay)] font-medium">{{ unread }} unread</span></p>
      </div>
      <button v-if="unread > 0" @click="markAllRead" class="btn-outline text-sm py-2 px-4">Mark All as Read</button>
    </div>
    <div v-if="loading" class="space-y-3"><div v-for="n in 5" :key="n" class="h-20 bg-[var(--color-linen)] animate-pulse" /></div>
    <div v-else-if="!enquiries.length" class="text-center py-24 bg-white border border-[var(--color-linen)]">
      <MailIcon :size="32" class="text-[var(--color-clay)]/40 mx-auto mb-4" />
      <p class="font-serif text-xl text-[var(--color-bark)] mb-2">No enquiries yet</p>
      <p class="font-sans text-sm text-[var(--color-bark)]/50">Submissions from your website contact form will appear here.</p>
    </div>
    <div v-else class="space-y-2">
      <div v-for="enq in enquiries" :key="enq._id"
        :class="['bg-white border transition-colors', !enq.read ? 'border-[var(--color-clay)]/50 border-l-4' : 'border-[var(--color-linen)]']">
        <div class="flex items-center gap-4 p-4 cursor-pointer hover:bg-[var(--color-linen)]/30 transition-colors" @click="toggle(enq._id)">
          <div :class="['w-2 h-2 rounded-full flex-shrink-0', !enq.read ? 'bg-[var(--color-clay)]' : 'bg-transparent']" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <span class="font-sans text-sm font-medium text-[var(--color-bark)]">{{ enq.firstName }} {{ enq.lastName }}</span>
              <span v-if="enq.interest || enq.product" class="font-sans text-[10px] tracking-[0.12em] uppercase bg-[var(--color-linen)] text-[var(--color-clay)] px-2 py-0.5">{{ enq.product || enq.interest }}</span>
            </div>
            <div class="flex items-center gap-4 mt-0.5">
              <a :href="`mailto:${enq.email}`" class="font-sans text-xs text-[var(--color-clay)] hover:underline" @click.stop>{{ enq.email }}</a>
              <span v-if="enq.phone" class="font-sans text-xs text-[var(--color-bark)]/50">{{ enq.phone }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3 flex-shrink-0">
            <span class="font-sans text-xs text-[var(--color-bark)]/40">{{ formatDate(enq.createdAt) }}</span>
            <ChevronDownIcon :size="14" :class="['text-[var(--color-bark)]/40 transition-transform', expanded === enq._id ? 'rotate-180' : '']" />
          </div>
        </div>
        <div v-if="expanded === enq._id" class="border-t border-[var(--color-linen)] px-6 py-5">
          <p v-if="enq.message" class="font-sans text-sm text-[var(--color-bark)]/75 leading-relaxed mb-5 whitespace-pre-wrap">{{ enq.message }}</p>
          <p v-else class="font-sans text-sm text-[var(--color-bark)]/40 italic mb-5">No message provided.</p>
          <div class="flex items-center gap-3 flex-wrap">
            <a :href="`mailto:${enq.email}?subject=Re: your enquiry about ${enq.product || enq.interest}`" class="btn-primary text-xs py-2 px-4">Reply via Email <MailIcon :size="12" /></a>
            <button @click="toggleRead(enq)" class="btn-outline text-xs py-2 px-4">{{ enq.read ? 'Mark as Unread' : 'Mark as Read' }}</button>
            <button @click="deleteEnquiry(enq)" class="font-sans text-xs text-red-400 hover:text-red-600 transition-colors ml-auto">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MailIcon, ChevronDownIcon } from 'lucide-vue-next'
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { adminGet, adminPatch, adminDel } = useApi()
const enquiries = ref<any[]>([]); const loading = ref(true); const expanded = ref<string | null>(null)
const unread = computed(() => enquiries.value.filter(e => !e.read).length)

const load = async () => { loading.value = true; try { enquiries.value = await adminGet('/api/enquiries/admin') } finally { loading.value = false } }
onMounted(load)

const toggle = async (id: string) => {
  if (expanded.value === id) { expanded.value = null; return }
  expanded.value = id
  const enq = enquiries.value.find(e => e._id === id)
  if (enq && !enq.read) await toggleRead(enq)
}
const toggleRead = async (enq: any) => {
  const updated = await adminPatch(`/api/enquiries/admin/${enq._id}`, { read: !enq.read })
  const idx = enquiries.value.findIndex(e => e._id === enq._id)
  if (idx !== -1) enquiries.value[idx] = updated
}
const markAllRead = async () => {
  await Promise.all(enquiries.value.filter(e => !e.read).map(e => adminPatch(`/api/enquiries/admin/${e._id}`, { read: true })))
  await load()
}
const deleteEnquiry = async (enq: any) => {
  if (!confirm(`Delete enquiry from ${enq.firstName}?`)) return
  await adminDel(`/api/enquiries/admin/${enq._id}`)
  enquiries.value = enquiries.value.filter(e => e._id !== enq._id)
  expanded.value = null
}
const formatDate = (str: string) => new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
</script>
