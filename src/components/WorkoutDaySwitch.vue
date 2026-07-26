<script setup lang="ts">
import type { WorkoutDayId } from '../types'

defineProps<{
  modelValue: WorkoutDayId
  days: { id: WorkoutDayId; label: string }[]
}>()

defineEmits<{
  (e: 'update:modelValue', value: WorkoutDayId): void
}>()
</script>

<template>
  <div flex bg="#3f4171" bg-opacity-50 rounded-xl p-1 gap-1>
    <button
      v-for="day in days"
      :key="day.id"
      @click="$emit('update:modelValue', day.id)"
      flex-1 py-2 rounded-lg text-sm font-bold uppercase transition-colors
      :class="modelValue === day.id ? 'bg-green-600 text-white' : 'text-gray-400'"
    >
      {{ day.id }}
    </button>
  </div>
</template>
