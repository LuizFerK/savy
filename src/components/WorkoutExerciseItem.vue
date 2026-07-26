<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { Exercise } from '../types'

defineProps<{
  exercise: Exercise
  completed: boolean
}>()

defineEmits<{
  (e: 'toggle', id: string): void
}>()
</script>

<template>
  <button
    @click="$emit('toggle', exercise.id)"
    w-full flex items-center gap-3 rounded-2xl p-3 mb-3 select-none text-left
    bg="#3f4171" bg-opacity-50
  >
    <span
      w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
      :style="{
        borderColor: completed ? '#22c55e' : '#ffffff40',
        background: completed ? '#22c55e' : 'transparent'
      }"
    >
      <Check v-if="completed" :size="14" color="white" />
    </span>

    <span flex-1 min-w-0>
      <span block text-sm :class="completed ? 'text-gray-500 line-through' : 'text-gray-200'">{{ exercise.name }}</span>
      <span block text-xs text-gray-500 mt-0.5>{{ exercise.sets }}</span>
    </span>
  </button>
</template>
