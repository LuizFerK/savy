<script setup lang="ts">
import { useRoute } from 'vue-router'
import { navItems } from '../nav'

const route = useRoute()
</script>

<template>
  <nav
    fixed inset-x-0 bottom-0 z-40 bg="zinc-900/90" backdrop-blur-sm border-t border="white/5"
    flex items-stretch justify-around
    class="bottom-nav"
  >
    <router-link
      v-for="item in navItems"
      :key="item.name"
      :to="{ name: item.name }"
      flex="~ col" items-center justify-center gap-1 flex-1 h-full hover:text-gray-200
      :class="route.name === item.name ? 'text-gray-200' : 'text-gray-500'"
    >
      <component :is="item.icon" :size="20" />
      <span text-xs font-medium>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  height: var(--bottom-nav-h);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
