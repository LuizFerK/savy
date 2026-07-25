<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'

defineProps<{
  title: string
  icon: LucideIcon
}>()
</script>

<template>
  <div h-full flex="~ col" items-center justify-center gap-3 px-8 text-center>
    <component :is="icon" :size="48" class="text-gray-400" />
    <h2 text-lg font-bold text-gray-200>{{ title }}</h2>
    <p text-sm text-gray-400>Ainda não implementado</p>
  </div>
</template>
