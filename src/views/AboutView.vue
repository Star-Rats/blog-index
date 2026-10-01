<script setup>
import { ref, watch } from 'vue'
import { marked } from 'marked'
import api from '../api'

const contentHtml = ref('')
const loading = ref(true)

marked.setOptions({ gfm: true, breaks: true })

async function load() {
  loading.value = true
  try {
    const res = await api.get('/api/about')
    // 内容由博主在后台维护，属可信来源
    contentHtml.value = marked.parse(res.data.content || '')
    if (res.data.content) {
      document.title = `关于 · ${document.title.split(' · ').pop() || 'My Blog'}`
    }
  } finally {
    loading.value = false
  }
}

watch(() => 0, load, { immediate: true })
</script>

<template>
  <div class="container" style="max-width: 820px">
    <section class="hero">
      <h1>关于</h1>
    </section>

    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="!contentHtml" class="empty">
      博主很懒，还没有写 anything～
      <p style="margin-top: 16px">
        <router-link to="/" style="color: var(--accent)">← 回首页</router-link>
      </p>
    </div>
    <article v-else class="article-page about-page">
      <div class="prose" v-html="contentHtml"></div>
    </article>
    <div style="height: 40px"></div>
  </div>
</template>

<style scoped>
.about-page {
  margin-top: 8px;
}
</style>
