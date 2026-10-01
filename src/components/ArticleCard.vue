<script setup>
import dayjs from 'dayjs'

defineProps({ article: Object })
const emit = defineEmits(['filter-tag'])

function fmt(value) {
  return value ? dayjs(value).format('YYYY-MM-DD') : ''
}
</script>

<template>
  <article class="article-card">
    <img v-if="article.cover" class="cover" :src="article.cover" alt="" />
    <div v-else class="no-cover">{{ (article.title || '文')[0] }}</div>
    <div class="body">
      <router-link :to="`/articles/${article.slug}`">
        <h2>{{ article.title }}</h2>
      </router-link>
      <p class="desc">{{ article.description || '暂无摘要' }}</p>
      <div class="meta">
        <router-link v-if="article.category_name" class="cat" :to="{ path: '/', query: { category_id: article.category_id } }">
          {{ article.category_name }}
        </router-link>
        <a v-for="tag in article.tags" :key="tag.id" class="chip" href="javascript:void(0)" @click="emit('filter-tag', tag.id)">
          # {{ tag.name }}
        </a>
        <span>{{ fmt(article.published_at) }}</span>
        <span>{{ article.views }} 次阅读</span>
        <span v-if="article.word_count">{{ article.word_count }} 字</span>
      </div>
    </div>
  </article>
</template>
