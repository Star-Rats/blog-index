<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import api from '../api'

const route = useRoute()
const article = ref(null)
const notFound = ref(false)

async function load() {
  notFound.value = false
  article.value = null
  try {
    const res = await api.get(`/api/articles/${route.params.slug}`)
    article.value = res.data
    document.title = `${res.data.title} · ${document.title.split(' · ').pop() || 'My Blog'}`
  } catch (e) {
    if (e.response?.status === 404) notFound.value = true
    else throw e
  }
}

watch(() => route.params.slug, load, { immediate: true })

function fmt(value) {
  return value ? dayjs(value).format('YYYY年MM月DD日') : ''
}
</script>

<template>
  <div class="container">
    <div v-if="notFound" class="empty" style="padding: 120px 0">
      <p style="font-size: 40px">404</p>
      <p>文章不存在或已下线</p>
      <p style="margin-top: 16px"><router-link to="/" style="color: var(--accent)">← 回首页</router-link></p>
    </div>

    <article v-else-if="article" class="article-page">
      <header class="header">
        <h1>{{ article.title }}</h1>
        <div class="meta-line">
          <span v-if="article.category_name">
            <router-link :to="{ path: '/', query: { category_id: article.category_id } }" style="color: var(--accent)">
              {{ article.category_name }}
            </router-link>
          </span>
          <span>{{ fmt(article.published_at) }}</span>
          <span>{{ article.views }} 次阅读</span>
          <span v-if="article.word_count">约 {{ article.word_count }} 字</span>
        </div>
        <div v-if="article.tags?.length" class="meta-line" style="margin-top: 10px">
          <router-link
            v-for="tag in article.tags"
            :key="tag.id"
            class="chip"
            :to="{ path: '/', query: { tag_id: tag.id } }"
          >
            # {{ tag.name }}
          </router-link>
        </div>
      </header>

      <!-- 语雀渲染的 HTML 正文 -->
      <div class="prose" v-html="article.body_html"></div>

      <footer class="article-footer">
        <router-link to="/">← 返回首页</router-link>
      </footer>
    </article>

    <div v-else class="loading">加载中…</div>
  </div>
</template>
