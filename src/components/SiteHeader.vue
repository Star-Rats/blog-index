<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({ site: Object })
const emit = defineEmits(['search'])
const router = useRouter()
const keyword = ref('')

function submit() {
  emit('search', keyword.value.trim())
}
</script>

<template>
  <header class="site-header">
    <div class="container inner">
      <router-link to="/" class="logo">{{ site?.site_title || 'My Blog' }}<em>.</em></router-link>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/archives">归档</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
      <form class="search-box" @submit.prevent="submit">
        <input v-model="keyword" type="search" placeholder="搜索文章…" />
      </form>
    </div>
  </header>
</template>
