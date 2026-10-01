<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import api from './api'

const route = useRoute()
const router = useRouter()
const site = ref({ site_title: 'My Blog', site_description: '' })
const stats = ref({})

async function loadSite() {
  try {
    const res = await api.get('/api/home')
    site.value = res.data.site
    stats.value = res.data.stats
    document.title = site.value.site_title || 'My Blog'
  } catch {
    // 后端不可用时保持默认文案
  }
}

watch(
  () => route.name,
  (name) => {
    if (name === 'home') loadSite()
  },
)
onMounted(loadSite)

function onSearch(kw) {
  router.push({ name: 'home', query: { keyword: kw || undefined } })
}
</script>

<template>
  <SiteHeader :site="site" @search="onSearch" />
  <router-view :site="site" :stats="stats" />
  <SiteFooter :site="site" />
</template>
