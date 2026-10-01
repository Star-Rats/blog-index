<script setup>
defineProps({ site: Object })
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <span v-if="site?.site_footer">{{ site.site_footer }}</span>
      <span v-else>© {{ year }} {{ site?.site_title || 'My Blog' }}</span>
      <span style="margin-left: 12px; opacity: 0.6">Powered by FastAPI</span>
    </div>
  </footer>
</template>
