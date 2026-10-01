<script setup>
defineProps({ page: { type: Number, default: 1 }, pages: { type: Number, default: 1 } })
const emit = defineEmits(['change'])
</script>

<template>
  <div v-if="pages > 1" class="pagination">
    <button :disabled="page <= 1" @click="emit('change', page - 1)">‹ 上一页</button>
    <button
      v-for="p in pages"
      :key="p"
      :class="{ current: p === page }"
      @click="emit('change', p)"
    >
      {{ p }}
    </button>
    <button :disabled="page >= pages" @click="emit('change', page + 1)">下一页 ›</button>
  </div>
</template>
