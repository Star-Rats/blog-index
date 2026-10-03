<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

defineProps({
  categories: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  stats: { type: Object, default: () => ({}) },
  activeCategory: { type: [Number, String], default: null },
})
const emit = defineEmits(['filter-tag', 'filter-category', 'clear'])

// ---- 侧栏跟随滚动（transform 方案，兼容侧栏高于视口的情况）----
// 滚动时侧栏先随内容上移；其底部到达视口底部后钉住跟随，右侧不会出现空白
let onScrollHandler = null
let ticking = false

// 每次都清除 transform 现场重测：不缓存任何位置状态，初次加载/数据变化后计算都准确
function syncNow() {
  const aside = document.querySelector(".page-layout > aside")
  if (!aside || window.innerWidth <= 720) return
  aside.style.transform = "none"
  // 底部跟随：侧栏底部到达视口底部上方 24px 后钉住跟随（此前保持自然位置）
  const y = Math.max(
    window.scrollY - aside.getBoundingClientRect().top - aside.offsetHeight + window.innerHeight - 24,
    0,
  )
  aside.style.transform = `translateY(${y}px)`
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    syncNow()
  })
}

onMounted(() => {
  onScrollHandler = onScroll
  window.addEventListener("scroll", onScrollHandler, { passive: true })
  window.addEventListener("resize", onScroll)
  window.addEventListener("load", onScroll)
  if (window.ResizeObserver) {
    const obs = new ResizeObserver(onScroll)
    const layout = document.querySelector(".page-layout")
    if (layout) obs.observe(layout)
    const main = document.querySelector(".page-layout > main")
    if (main) obs.observe(main)
  }
  syncNow()
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScrollHandler)
  window.removeEventListener("resize", onScroll)
  window.removeEventListener("load", onScroll)
  const aside = document.querySelector(".page-layout > aside")
  if (aside) aside.style.transform = ""
})
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
