<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'
import ArticleCard from '../components/ArticleCard.vue'
import SideBar from '../components/SideBar.vue'
import SimplePagination from '../components/SimplePagination.vue'

const route = useRoute()
const router = useRouter()

const home = ref({ site: {}, stats: {}, categories: [], tags: [] })
const list = ref({ items: [], total: 0, page: 1, page_size: 10 })
const loading = ref(false)

const query = computed(() => ({
  category_id: route.query.category_id,
  tag_id: route.query.tag_id,
  keyword: route.query.keyword,
}))
const activeCategory = computed(() => query.value.category_id)
const activeTag = computed(() => Number(query.value.tag_id) || null)

async function loadHome() {
  const res = await api.get('/api/home')
  home.value = res.data
}

async function loadList() {
  loading.value = true
  try {
    const params = {
      page: Number(route.query.page) || 1,
      page_size: 8,
    }
    if (query.value.category_id) params.category_id = query.value.category_id
    if (query.value.tag_id) params.tag_id = query.value.tag_id
    if (query.value.keyword) params.keyword = query.value.keyword
    const res = await api.get('/api/articles', { params })
    list.value = res.data
  } finally {
    loading.value = false
  }
}

watch(() => route.fullPath, loadList, { immediate: true })
watch(() => route.name === 'home', (v) => v && loadHome(), { immediate: true })

const pages = computed(() => Math.max(1, Math.ceil(list.value.total / list.value.page_size)))

function goPage(p) {
  router.push({ query: { ...route.query, page: p > 1 ? p : undefined } })
}

function filterTag(tagId) {
  router.push({ query: { ...route.query, tag_id: tagId, page: undefined } })
}

function clearCategory() {
  router.push({ query: { ...route.query, category_id: undefined, page: undefined } })
}

const listTitle = computed(() => {
  if (query.value.keyword) return `搜索“${query.value.keyword}”的结果`
  if (query.value.tag_id) return `标签“${home.value.tags.find((t) => t.id === activeTag.value)?.name ?? ''}”下的文章`
  const cat = home.value.categories.find((c) => String(c.id) === String(activeCategory.value))
  if (cat) return `分类“${cat.name}”下的文章`
  return '最新文章'
})
</script>

<template>
  <div class="container">
    <section class="hero">
      <h1>{{ home.site.site_title || 'My Blog' }}</h1>
      <p>{{ home.site.site_description || '写点东西，记录生活与技术。' }}</p>
      <div class="stats">
        <span><b>{{ home.stats.article_count ?? 0 }}</b>文章</span>
        <span><b>{{ home.stats.category_count ?? 0 }}</b>分类</span>
        <span><b>{{ home.stats.tag_count ?? 0 }}</b>标签</span>
      </div>
    </section>

    <div class="page-layout">
      <main>
        <div class="section-head">
          <h2>{{ listTitle }}</h2>
          <span class="count">共 {{ list.total }} 篇</span>
        </div>
        <div v-if="loading" class="loading">加载中…</div>
        <div v-else-if="!list.items.length" class="empty">暂无文章</div>
        <div v-else class="article-list">
          <ArticleCard
            v-for="a in list.items"
            :key="a.id"
            :article="a"
            @filter-tag="filterTag"
          />
        </div>
      </main>
      <SideBar
        :categories="home.categories"
        :tags="home.tags"
        :stats="home.stats"
        :active-category="activeCategory"
        @filter-tag="filterTag"
        @clear="clearCategory"
      />
      <!-- 分页独立于网格第一行：侧栏吸附范围正好结束在最后一篇文章底部 -->
      <div class="page-pagination">
        <SimplePagination :page="list.page" :pages="pages" @change="goPage" />
      </div>
    </div>
  </div>
</template>
