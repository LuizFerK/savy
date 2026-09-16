<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Feather } from 'lucide-vue-next'
import { navItems } from '../nav'

const route = useRoute()
</script>

<template>
  <nav
    w-60 h-full flex-shrink-0 flex-col gap-1
    bg-zinc-900 border-r border="white/5" px-3 py-6
  >
    <div flex items-center gap-2 px-3 mb-6>
      <Feather :size="20" text-green-500 />
      <span text-base font-bold text-gray-100 tracking-tight>Zelo</span>
    </div>

    <router-link
      v-for="item in navItems"
      :key="item.name"
      :to="{ name: item.name }"
      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
      :class="route.name === item.name ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'"
    >
      <component :is="item.icon" :size="18" />
      {{ item.label }}
    </router-link>
  </nav>
</template>
