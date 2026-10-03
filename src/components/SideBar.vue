<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  stats: { type: Object, default: () => ({}) },
  activeCategory: { type: [Number, String], default: null },
})
const emit = defineEmits(['filter-tag', 'filter-category', 'clear'])
</script>

<template>
  <aside>
    <!-- 顶部点缀：与左侧「最新文章」标题行同高，使分类卡片与首篇文章卡片对齐 -->
    <div class="side-ornament" aria-hidden="true">
      <span class="line"></span>
      <span class="glyph">✦</span>
      <span class="line"></span>
    </div>

    <div class="side-card">
      <h3>分类</h3>
      <router-link
        v-for="cat in categories"
        :key="cat.id"
        class="cat-row"
        :class="{ active: String(activeCategory) === String(cat.id) }"
        :to="{ path: '/', query: { category_id: cat.id } }"
      >
        <span>{{ cat.name }}</span>
        <span class="n">{{ cat.article_count }}</span>
      </router-link>
      <div v-if="!categories.length" class="empty" style="padding: 8px 0">暂无分类</div>
    </div>

    <div class="side-card">
      <h3>标签</h3>
      <div class="tag-cloud">
        <a v-for="tag in tags" :key="tag.id" class="chip" href="javascript:void(0)" @click="emit('filter-tag', tag.id)">
          # {{ tag.name }}
        </a>
        <span v-if="!tags.length" class="empty" style="padding: 4px 0">暂无标签</span>
      </div>
    </div>

    <!-- 引言卡：填充侧栏底部留白 -->
    <div class="side-quote">
      <span class="q-mark" aria-hidden="true">❝</span>
      <p>纸上得来终觉浅，<br />绝知此事要躬行。</p>
      <div class="q-from">—— 陆游《冬夜读书示子聿》</div>
    </div>

    <div v-if="activeCategory" class="side-card" style="text-align: center">
      <a href="javascript:void(0)" class="chip" @click="emit('clear')">✕ 清除分类筛选</a>
    </div>

    <div class="side-tail" aria-hidden="true">· ✦ ·</div>
  </aside>
</template>
