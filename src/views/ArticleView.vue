<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import api from '../api'

const route = useRoute()
const article = ref(null)
const notFound = ref(false)

// ---- 大纲（TOC）----
const toc = ref([])            // [{id, text, level}]
const activeId = ref('')
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    // 高亮视口 135px 线上方最近的标题
    const line = window.scrollY + 135
    let current = ''
    for (const item of toc.value) {
      const el = document.getElementById(item.id)
      if (!el) continue
      const top = el.getBoundingClientRect().top + window.scrollY
      if (top <= line) current = item.id
      else break
    }
    if (current) activeId.value = current
  })
}

function buildToc() {
  const container = document.querySelector('.prose')
  if (!container) return
  const headings = container.querySelectorAll('h2, h3, h4')
  headings.forEach((h, i) => {
    const id = `heading-${i}`
    h.id = id
    toc.value.push({ id, text: h.textContent.trim(), level: Number(h.tagName[1]) })
  })
  if (toc.value.length) window.addEventListener('scroll', onScroll, { passive: true })
}

function jump(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeId.value = id  // 点击即时反馈；滚动结束后由 onScroll 精确校正
  history.replaceState(null, '', `#${id}`)
}

onMounted(() => {
  if (route.hash) nextTick(() => jump(route.hash.slice(1)))
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

async function load() {
  notFound.value = false
  article.value = null
  toc.value = []
  activeId.value = ''
  try {
    const res = await api.get(`/api/articles/${route.params.slug}`)
    article.value = res.data
    document.title = `${res.data.title} · ${document.title.split(' · ').pop() || 'My Blog'}`
    await nextTick()      // 等 v-html 渲染完成
    buildToc()
    if (route.hash) jump(route.hash.slice(1))
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

    <div v-else-if="article" class="article-with-toc">
      <article class="article-page">
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

        <!-- 正文（后端渲染的 HTML） -->
        <div class="prose" v-html="article.body_html"></div>

        <footer class="article-footer">
          <router-link to="/">← 返回首页</router-link>
        </footer>
      </article>

      <!-- 桌面端：右侧悬浮大纲 -->
      <aside v-if="toc.length > 1" class="toc-card">
        <div class="toc-title">大纲</div>
        <ul>
          <li
            v-for="item in toc"
            :key="item.id"
            :class="['toc-item', `lv${item.level}`, { active: activeId === item.id }]"
            @click="jump(item.id)"
          >
            {{ item.text }}
          </li>
        </ul>
      </aside>

    </div>

    <div v-else class="loading">加载中…</div>
  </div>
</template>
