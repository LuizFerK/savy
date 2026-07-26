<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ListChecks, BookOpen, ShoppingCart, Dumbbell, PiggyBank } from 'lucide-vue-next'

const route = useRoute()

const items = [
  { name: 'todo', label: 'Tarefas', icon: ListChecks },
  { name: 'recipes', label: 'Receitas', icon: BookOpen },
  { name: 'shopping', label: 'Mercado', icon: ShoppingCart },
  { name: 'workouts', label: 'Treinos', icon: Dumbbell },
  { name: 'expenses', label: 'Gastos', icon: PiggyBank }
]
</script>

<template>
  <nav
    fixed inset-x-0 bottom-0 z-40 bg="#3f4171" backdrop-blur-sm
    flex items-stretch justify-around
    class="bottom-nav"
  >
    <router-link
      v-for="item in items"
      :key="item.name"
      :to="{ name: item.name }"
      flex="~ col" items-center justify-center gap-1 flex-1 h-full hover:text-gray-200
      :class="route.name === item.name ? 'text-gray-200' : 'text-gray-400'"
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
