<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import api from '../api'

// 单一聚合页：同一批文章的三种聚合方式（时间轴 / 分类 / 标签）
const route = useRoute()
const router = useRouter()

const items = ref([])
const loading = ref(true)

const mode = computed(() => {
  const m = String(route.query.mode || 'time')
  return ['time', 'category', 'tag'].includes(m) ? m : 'time'
})

function setMode(m) {
  router.push({ query: { ...route.query, mode: m === 'time' ? undefined : m } })
}

async function load() {
  const res = await api.get('/api/articles/archives')
  items.value = res.data
  loading.value = false
}

watch(() => 0, load, { immediate: true })

// 时间轴：按年分组
const yearGroups = computed(() => {
  const map = new Map()
  for (const item of items.value) {
    const year = item.published_at ? dayjs(item.published_at).format('YYYY') : '未发布'
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(item)
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})

// 分类：按分类分组（数量倒序），无分类文章归入「未分类」
const categoryGroups = computed(() => {
  const map = new Map()
  for (const item of items.value) {
    const key = item.category_name || '未分类'
    if (!map.has(key)) map.set(key, { name: key, id: item.category_id, articles: [] })
    map.get(key).articles.push(item)
  }
  return [...map.values()].sort((a, b) => b.articles.length - a.articles.length)
})

// 标签：按标签分组（数量倒序）
const tagGroups = computed(() => {
  const map = new Map()
  for (const item of items.value) {
    for (const tag of item.tags) {
      if (!map.has(tag.id)) map.set(tag.id, { id: tag.id, name: tag.name, articles: [] })
      map.get(tag.id).articles.push(item)
    }
  }
  return [...map.values()].sort((a, b) => b.articles.length - a.articles.length)
})

function fmtMonth(value) {
  return value ? dayjs(value).format('MM-DD') : ''
}

const countText = computed(() => {
  if (mode.value === 'category') return `${items.value.length} 篇文章 · ${categoryGroups.value.length} 个分类`
  if (mode.value === 'tag') return `${items.value.length} 篇文章 · ${tagGroups.value.length} 个标签`
  return `共 ${items.value.length} 篇文章`
})
</script>

<template>
  <div class="container" style="max-width: 820px">
    <section class="hero">
      <h1>归档</h1>
      <p>{{ countText }}</p>
      <div class="mode-switch">
        <button :class="{ active: mode === 'time' }" @click="setMode('time')">时间轴</button>
        <button :class="{ active: mode === 'category' }" @click="setMode('category')">分类</button>
        <button :class="{ active: mode === 'tag' }" @click="setMode('tag')">标签</button>
      </div>
    </section>

    <div v-if="loading" class="loading">加载中…</div>

    <!-- 时间轴 -->
    <template v-else-if="mode === 'time'">
      <div v-if="!items.length" class="empty">暂无文章</div>
      <div v-for="[year, list] in yearGroups" :key="year" style="margin-bottom: 8px">
        <h2 class="archive-year">{{ year }}</h2>
        <router-link v-for="item in list" :key="item.id" class="archive-item" :to="`/articles/${item.slug}`">
          <span class="title">
            {{ item.title }}
            <span v-if="item.category_name" class="chip mini">{{ item.category_name }}</span>
          </span>
          <span class="date">{{ fmtMonth(item.published_at) }}</span>
        </router-link>
      </div>
    </template>

    <!-- 按分类 -->
    <template v-else-if="mode === 'category'">
      <div v-if="!items.length" class="empty">暂无文章</div>
      <div v-for="group in categoryGroups" :key="group.name" style="margin-bottom: 8px">
        <h2 class="archive-year">
          <router-link :to="{ path: '/', query: group.id ? { category_id: group.id } : {} }" class="group-link">
            {{ group.name }}
          </router-link>
          <small>{{ group.articles.length }} 篇</small>
        </h2>
        <router-link v-for="item in group.articles" :key="item.id" class="archive-item" :to="`/articles/${item.slug}`">
          <span class="title">{{ item.title }}</span>
          <span class="date">{{ fmtMonth(item.published_at) }}</span>
        </router-link>
      </div>
    </template>

    <!-- 按标签 -->
    <template v-else>
      <div v-if="!items.length" class="empty">暂无文章</div>
      <div v-for="group in tagGroups" :key="group.id" style="margin-bottom: 8px">
        <h2 class="archive-year">
          <router-link :to="{ path: '/', query: { tag_id: group.id } }" class="group-link">
            # {{ group.name }}
          </router-link>
          <small>{{ group.articles.length }} 篇</small>
        </h2>
        <router-link v-for="item in group.articles" :key="item.id" class="archive-item" :to="`/articles/${item.slug}`">
          <span class="title">{{ item.title }}</span>
          <span class="date">{{ fmtMonth(item.published_at) }}</span>
        </router-link>
      </div>
    </template>

    <div style="height: 64px"></div>
  </div>
</template>

<style scoped>
.mode-switch {
  display: inline-flex;
  gap: 4px;
  margin-top: 20px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.045);
  border-radius: 999px;
}

.mode-switch button {
  border: none;
  background: transparent;
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 13.5px;
  color: var(--muted);
  transition: all 0.15s;
}

.mode-switch button.active {
  background: var(--card);
  color: var(--accent);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(35, 39, 46, 0.12);
}

.archive-year small {
  font-size: 13px;
  color: var(--faint);
  font-weight: 400;
  margin-left: 8px;
}

.group-link:hover {
  color: var(--accent);
}

.chip.mini {
  font-size: 11px;
  padding: 0 8px;
  margin-left: 6px;
  vertical-align: 1px;
}
</style>
