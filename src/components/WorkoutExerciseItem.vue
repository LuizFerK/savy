<script setup lang="ts">
import { Check, Plus } from 'lucide-vue-next'
import type { Exercise } from '../types'
import { capitalize } from '../utils'

defineProps<{
  exercise: Exercise
  completed: boolean
  weight?: number
}>()

defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'edit-weight', id: string): void
}>()
</script>

<template>
  <div
    flex items-center gap-3 rounded-2xl p-3 mb-3 select-none
    bg="#3f4171" bg-opacity-50
  >
    <button
      @click="$emit('toggle', exercise.id)"
      flex-1 min-w-0 flex items-center gap-3 text-left
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
        <span block text-sm :class="completed ? 'text-gray-500 line-through' : 'text-gray-200'">{{ capitalize(exercise.name) }}</span>
        <span block text-xs text-gray-500 mt-0.5>{{ exercise.sets }}</span>
      </span>
    </button>

    <button
      @click="$emit('edit-weight', exercise.id)"
      flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors
      bg="#343466"
      :class="weight ? 'text-green-500' : 'text-gray-500'"
      aria-label="Anotar peso do exercício"
    >
      <template v-if="weight">{{ weight }} kg</template>
      <Plus v-else :size="14" />
    </button>
  </div>
</template>
