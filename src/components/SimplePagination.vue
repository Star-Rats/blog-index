<script setup>
defineProps({ page: { type: Number, default: 1 }, pages: { type: Number, default: 1 } })
const emit = defineEmits(['change'])
</script>

<template>
  <div v-if="pages > 1" class="pagination">
    <button class="prev" :disabled="page <= 1" @click="emit('change', page - 1)">‹ 上一页</button>
    <span class="page-indicator">{{ page }} / {{ pages }}</span>
    <button
      v-for="p in pages"
      :key="p"
      class="page-num"
      :class="{ current: p === page }"
      @click="emit('change', p)"
    >
      {{ p }}
    </button>
    <button class="next" :disabled="page >= pages" @click="emit('change', page + 1)">下一页 ›</button>
  </div>
</template>
