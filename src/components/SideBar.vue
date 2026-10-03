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
let resizeObs = null
let mainObs = null
let asideTopDoc = 0

// 清除 transform 后测量真实文档位置与行程（resize/内容高度变化时重测）
function measure() {
  const aside = document.querySelector(".page-layout > aside")
  const main = document.querySelector(".page-layout > main")
  if (!aside || !main) return
  if (window.innerWidth <= 720) {
    aside.style.transform = ""
    return
  }
  aside.style.transform = "none"
  asideTopDoc = aside.getBoundingClientRect().top + window.scrollY
  apply()
}

function apply() {
  const aside = document.querySelector(".page-layout > aside")
  if (!aside || window.innerWidth <= 720) return
  // 底部跟随：侧栏底部始终钉在视口底部上方 24px（顶部不足 76px 时保持原位）
  const vh = window.innerHeight
  const y = Math.max(window.scrollY - asideTopDoc - aside.offsetHeight + vh - 24, 0)
  aside.style.transform = `translateY(${y}px)`
}

onMounted(() => {
  onScrollHandler = () => requestAnimationFrame(apply)
  window.addEventListener("scroll", onScrollHandler, { passive: true })
  window.addEventListener("resize", () => measure())
  if (window.ResizeObserver) {
    resizeObs = new ResizeObserver(() => measure())
    const layout = document.querySelector(".page-layout")
    if (layout) resizeObs.observe(layout)
    const main = document.querySelector(".page-layout > main")
    if (main) mainObs = new ResizeObserver(() => measure())
    if (main) mainObs.observe(main)
  }
  measure()
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScrollHandler)
  window.removeEventListener("resize", measure)
  resizeObs?.disconnect()
  mainObs?.disconnect()
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
